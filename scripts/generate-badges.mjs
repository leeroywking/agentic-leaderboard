// Generate static shields-style SVG badges for every agent, one per axis
// and one composite + one agency per agent. Written to public/badge/ so
// they're served by Vite as static assets.
//
// Width calculation assumes ~7px per character for the SFMono-ish font
// stack. Approximate; the renderer pads conservatively.

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { agents } = await import(
  pathToFileURL(resolve(rootDir, 'src/shared/agents.js')).href
);
const { computeComposite, axisMeta } = await import(
  pathToFileURL(resolve(rootDir, 'src/shared/scoring.js')).href
);

const CHAR_WIDTH = 7.2;
const PADDING = 12;
const HEIGHT = 28;

const colors = {
  verified: '#1e7d58',
  agency: '#8bdff3',
  review: '#f4c752',
  reject: '#ee6b5f',
  reach: '#1e7d58',
  depth: '#2f8ea7',
  autonomy: '#b88a22',
  acceptance: '#6a4fd3',
};

const darkText = new Set(['agency', 'review']);

function svgBadge(leftLabel, rightLabel, tone = 'verified') {
  const leftWidth = Math.ceil(leftLabel.length * CHAR_WIDTH) + PADDING * 2;
  const rightWidth = Math.ceil(rightLabel.length * CHAR_WIDTH) + PADDING * 2;
  const totalWidth = leftWidth + rightWidth;
  const rightBg = colors[tone] || colors.verified;
  const rightFill = darkText.has(tone) ? '#1f2327' : '#ffffff';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${HEIGHT}" viewBox="0 0 ${totalWidth} ${HEIGHT}" role="img" aria-label="${leftLabel}: ${rightLabel}">
  <title>${leftLabel}: ${rightLabel}</title>
  <clipPath id="clip"><rect width="${totalWidth}" height="${HEIGHT}" rx="4"/></clipPath>
  <g clip-path="url(#clip)">
    <rect width="${leftWidth}" height="${HEIGHT}" fill="#2b2f36"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${HEIGHT}" fill="${rightBg}"/>
  </g>
  <g font-family="SFMono-Regular, Consolas, Menlo, monospace" font-size="13" font-weight="800">
    <text x="${leftWidth / 2}" y="19" text-anchor="middle" fill="#ffffff">${leftLabel}</text>
    <text x="${leftWidth + rightWidth / 2}" y="19" text-anchor="middle" fill="${rightFill}">${rightLabel}</text>
  </g>
</svg>`;
}

function compositeBadgeFor(agent) {
  const composite = computeComposite(agent.axes);
  return svgBadge('agenticness', `${composite} · v1.0`, 'verified');
}

function agencyBadgeFor(agent) {
  const tone = agent.agency === 'agency-proofed' ? 'agency' : 'review';
  const right = agent.agency === 'agency-proofed' ? 'proofed' : 'profiled';
  return svgBadge('agency', right, tone);
}

function axisBadgeFor(agent, axis) {
  const a = agent.axes[axis];
  const label = axisMeta[axis].label.toLowerCase();
  let right;
  let tone;
  if (axis === 'autonomy') {
    right = a.grade;
    tone = a.grade === 'autonomous' || a.grade === 'long_horizon_unattended' ? 'verified' : 'review';
  } else if (axis === 'acceptance') {
    if (a.externalN == null || a.externalN < 10) {
      right = 'insufficient evidence';
      tone = 'review';
    } else {
      right = `${Math.round(a.externalRate * 100)}% · N=${a.externalN}`;
      tone = 'verified';
    }
  } else {
    right = `${Math.round(a.v * 100)} · c ${Math.round(a.c * 100)}%`;
    tone = a.c >= 0.6 ? 'verified' : 'review';
  }
  return svgBadge(label, right, tone);
}

async function main() {
  const outBase = resolve(rootDir, 'public/badge');
  // Clean existing generated badges so stale files don't linger.
  await rm(outBase, { recursive: true, force: true });
  await mkdir(outBase, { recursive: true });

  let count = 0;
  for (const agent of agents) {
    await mkdir(resolve(outBase, 'composite'), { recursive: true });
    await writeFile(
      resolve(outBase, 'composite', `${agent.slug}.svg`),
      compositeBadgeFor(agent),
    );
    count += 1;

    await mkdir(resolve(outBase, 'agency'), { recursive: true });
    await writeFile(
      resolve(outBase, 'agency', `${agent.slug}.svg`),
      agencyBadgeFor(agent),
    );
    count += 1;

    for (const axis of ['reach', 'depth', 'autonomy', 'acceptance']) {
      await mkdir(resolve(outBase, axis), { recursive: true });
      await writeFile(
        resolve(outBase, axis, `${agent.slug}.svg`),
        axisBadgeFor(agent, axis),
      );
      count += 1;
    }
  }

  // Generic examples used on /badges.html for the catalog preview.
  await writeFile(
    resolve(outBase, 'example-verified-work.svg'),
    svgBadge('verified work', '47 accepted · 94%', 'verified'),
  );
  await writeFile(
    resolve(outBase, 'example-rejected.svg'),
    svgBadge('rejected', 'identity_not_bound', 'reject'),
  );

  console.log(`Wrote ${count} per-agent badges + 2 examples to public/badge/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
