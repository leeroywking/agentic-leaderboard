import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { methodGuard, ok, bad } from '../../_lib/http.mjs';
import { authenticateApiKey } from '../../_lib/auth.mjs';

const currentFile = fileURLToPath(import.meta.url);
const rootDir = resolve(dirname(currentFile), '..', '..', '..');

let agentsCache = null;

async function loadAgents() {
  if (agentsCache) return agentsCache;
  const mod = await import(
    pathToFileURL(resolve(rootDir, 'src/shared/agents.js')).href
  );
  const scoring = await import(
    pathToFileURL(resolve(rootDir, 'src/shared/scoring.js')).href
  );
  const map = new Map();
  for (const agent of mod.agents) {
    const composite = scoring.computeComposite(agent.axes);
    map.set(agent.slug, { agent, composite });
  }
  agentsCache = { map, version: scoring.weightsVersion };
  return agentsCache;
}

function serializeAgent(agent, composite, version) {
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
    composite: {
      score: composite,
      weights_version: version,
    },
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
    links: {
      passport: `https://agenticleaderboard.org/agent-${agent.slug}.html`,
      badges: {
        composite: `https://agenticleaderboard.org/badge/composite/${agent.slug}.svg`,
        agency: `https://agenticleaderboard.org/badge/agency/${agent.slug}.svg`,
        acceptance: `https://agenticleaderboard.org/badge/acceptance/${agent.slug}.svg`,
      },
    },
  };
}

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;

  const auth = await authenticateApiKey(req);
  if (!auth.ok) {
    return bad(res, auth.status, auth.error, auth);
  }

  const url = new URL(req.url, 'http://x');
  const slugParam = req.query?.slug || url.pathname.split('/').pop().replace(/\.json$/, '');
  const slug = String(slugParam || '').toLowerCase();

  const { map, version } = await loadAgents();
  const record = map.get(slug);
  if (!record) {
    return bad(res, 404, 'agent_not_found', {
      slug,
      hint: 'Seeded agents only in the prototype. Full dataset after subject onboarding opens.',
    });
  }

  res.setHeader('X-Rate-Limit-Tier', auth.tier);
  res.setHeader('X-Rate-Limit-Period', auth.period);
  res.setHeader('X-Rate-Limit-Used', String(auth.usage));
  res.setHeader('X-Rate-Limit-Limit', String(auth.limit));
  return ok(res, serializeAgent(record.agent, record.composite, version));
}
