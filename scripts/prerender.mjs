// Post-build prerender.
//
// Each page's source module mounts to <div id="app"> via mountPage().
// We load the source module with Vite's SSR loader (which handles ESM,
// CSS imports, and the vite.config aliases), giving it a jsdom-backed
// global document. The module executes, mutates the DOM, and we inject
// the resulting innerHTML into the built HTML file in dist/.
//
// Browsers still run the bundled JS again on load — that overwrites
// #app with identical content (equivalent to hydration). The rendered
// HTML is for crawlers and first-paint; the bundle is for interactivity.

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { JSDOM, VirtualConsole } from 'jsdom';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(rootDir, 'dist');

const pages = [
  { html: 'index.html', entry: '/src/pages/home.js' },
  { html: 'agents.html', entry: '/src/pages/agents.js' },
  { html: 'leaderboard.html', entry: '/src/pages/leaderboard.js' },
  { html: 'for-agents.html', entry: '/src/pages/for-agents.js' },
  { html: 'for-relying-parties.html', entry: '/src/pages/for-relying-parties.js' },
  { html: 'pricing.html', entry: '/src/pages/pricing.js' },
  { html: 'how-it-works.html', entry: '/src/pages/how-it-works.js' },
  { html: 'evidence.html', entry: '/src/pages/evidence.js' },
  { html: 'badges.html', entry: '/src/pages/badges.js' },
  { html: 'proof.html', entry: '/src/pages/proof.js' },
  { html: 'faq.html', entry: '/src/pages/faq.js' },
  { html: 'about.html', entry: '/src/pages/about.js' },
  { html: 'legal.html', entry: '/src/pages/legal.js' },
  { html: 'agent-xbot-ai.html', entry: '/src/pages/agent-xbot-ai.js' },
  { html: 'agent-founderai-bot.html', entry: '/src/pages/agent-founderai-bot.js' },
  { html: 'agent-dragontrade.html', entry: '/src/pages/agent-dragontrade.js' },
  { html: 'agent-skoal-reviewer.html', entry: '/src/pages/agent-skoal-reviewer.js' },
  { html: 'agent-lexa-legal.html', entry: '/src/pages/agent-lexa-legal.js' },
];

function setupDocument() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', () => {});
  const dom = new JSDOM(
    '<!doctype html><html><body><div id="app"></div></body></html>',
    { url: 'http://localhost/', virtualConsole },
  );
  const { window } = dom;

  globalThis.document = window.document;
  globalThis.window = window;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Element = window.Element;
  globalThis.Node = window.Node;
  globalThis.addEventListener = window.addEventListener.bind(window);
  globalThis.removeEventListener = window.removeEventListener.bind(window);
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  globalThis.fetch = async () => ({
    ok: false,
    status: 599,
    statusText: 'prerender-no-network',
    json: async () => ({}),
  });

  return dom;
}

async function renderOne(page, vite) {
  const dom = setupDocument();
  try {
    await vite.ssrLoadModule(page.entry, { fixStacktrace: true });
  } catch (err) {
    dom.window.close();
    throw err;
  }

  const appNode = dom.window.document.querySelector('#app');
  if (!appNode || !appNode.innerHTML.trim()) {
    dom.window.close();
    throw new Error('Page rendered empty #app');
  }
  const appContent = appNode.innerHTML;
  dom.window.close();

  const absPath = resolve(distDir, page.html);
  const original = await readFile(absPath, 'utf8');
  const withContent = original.replace(
    /<div id="app">\s*<\/div>/,
    `<div id="app">${appContent}</div>`,
  );
  await writeFile(absPath, withContent);
  return appContent.length;
}

async function main() {
  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });

  let total = 0;
  let failed = 0;
  for (const page of pages) {
    // Clear SSR module cache so each page gets a fresh module tree and a
    // fresh document.
    vite.moduleGraph.invalidateAll();
    try {
      const bytes = await renderOne(page, vite);
      total += bytes;
      console.log(`  prerendered  ${page.html} (${bytes.toLocaleString()} chars)`);
    } catch (err) {
      failed += 1;
      console.error(`  failed       ${page.html}: ${err.message}`);
      if (process.env.DEBUG) console.error(err);
    }
  }

  await vite.close();
  console.log(
    `\nPrerender complete. ${pages.length - failed}/${pages.length} pages, ${total.toLocaleString()} chars total.`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
