// Public, unauthenticated passport lookup.
//
// This is distinct from /api/v1/agents/[slug], which is the programmatic
// API used by paying relying parties and requires an API key. The public
// endpoint supports the human-facing /agent.html passport page for agents
// that were admitted after the static prototype was built — we don't want
// those passport pages to require an API key just to render.
//
// Rate limiting here is per-IP (soft), not per-key. Relying parties that
// want reliable, SLA-backed lookups should use the /api/v1 path.

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { methodGuard, ok, bad } from '../../_lib/http.mjs';
import { store, keys } from '../../_lib/store.mjs';

const currentFile = fileURLToPath(import.meta.url);
const rootDir = resolve(dirname(currentFile), '..', '..', '..');

let agentsCache = null;
async function loadStatic() {
  if (agentsCache) return agentsCache;
  const mod = await import(pathToFileURL(resolve(rootDir, 'src/shared/agents.js')).href);
  const scoring = await import(pathToFileURL(resolve(rootDir, 'src/shared/scoring.js')).href);
  const map = new Map();
  for (const agent of mod.agents) {
    map.set(agent.slug, { agent, composite: scoring.computeComposite(agent.axes) });
  }
  agentsCache = { map, version: scoring.weightsVersion };
  return agentsCache;
}

function serializePublic(agent, composite, version) {
  return {
    slug: agent.slug,
    name: agent.name,
    handle: agent.handle,
    type: agent.type,
    owner: { handle: agent.owner, kind: agent.ownerType },
    framework: agent.framework,
    certification: agent.certification,
    first_seen: agent.firstSeen,
    identity_bindings: agent.identityBindings,
    composite: { score: composite, weights_version: version },
    axes: {
      reach: {
        value: agent.axes.reach.v,
        confidence: agent.axes.reach.c,
        systems: agent.systems,
      },
      depth: {
        value: agent.axes.depth.v,
        confidence: agent.axes.depth.c,
      },
      autonomy: {
        value: agent.axes.autonomy.v,
        confidence: agent.axes.autonomy.c,
        grade_accepted: agent.axes.autonomy.grade,
        cap_note: agent.axes.autonomy.capNote,
      },
      acceptance: {
        value: agent.axes.acceptance.v,
        confidence: agent.axes.acceptance.c,
        external_n: agent.axes.acceptance.externalN,
        external_rate: agent.axes.acceptance.externalRate,
        self_rate: agent.axes.acceptance.selfRate,
      },
    },
    passport_url: `https://agenticleaderboard.org/agent.html?slug=${agent.slug}`,
  };
}

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;

  const url = new URL(req.url, 'http://x');
  const slugParam = req.query?.slug || url.pathname.split('/').pop().replace(/\.json$/, '');
  const slug = String(slugParam || '').toLowerCase();
  if (!slug) return bad(res, 400, 'missing_slug');

  const { map, version } = await loadStatic();
  let record = map.get(slug);
  if (!record) {
    const published = await store.get(keys.publishedAgent(slug));
    if (published) {
      const agent = typeof published === 'string' ? JSON.parse(published) : published;
      const { computeComposite } = await import(pathToFileURL(resolve(rootDir, 'src/shared/scoring.js')).href);
      record = { agent, composite: computeComposite(agent.axes) };
    }
  }
  if (!record) return bad(res, 404, 'agent_not_found', { slug });

  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
  return ok(res, serializePublic(record.agent, record.composite, version));
}
