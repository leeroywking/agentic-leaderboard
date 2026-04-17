// Parser and GitHub-API-backed axis computation for AGENT.md manifests.
// Runs in the browser against the public GitHub API (unauthenticated,
// ~60 req/hour per IP). Used by the /try.html live demo.

export function parseManifest(text) {
  const lines = text.split(/\r?\n/);
  const fields = {};
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('>')) continue;
    const match = line.match(/^-?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+)$/);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (!(key in fields)) {
      fields[key] = value;
    } else if (Array.isArray(fields[key])) {
      fields[key].push(value);
    } else {
      fields[key] = [fields[key], value];
    }
  }
  const systems = fields.systems
    ? String(fields.systems)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const handleRaw = (fields.handle || fields.name || '').replace(/^@/, '');
  const slug = (fields.slug || handleRaw || fields.name || 'agent')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return {
    slug,
    name: fields.name || 'Unknown agent',
    handle: fields.handle ? (fields.handle.startsWith('@') ? fields.handle : `@${fields.handle}`) : `@${slug}`,
    owner: fields.owner || null,
    ownerKind: fields.owner_kind || 'human',
    framework: fields.framework || 'custom',
    systems,
    declaredAutonomy: fields.declared_autonomy || fields.autonomy || 'supervised',
    raw: fields,
  };
}

export async function fetchManifest(owner, repo) {
  const branches = ['HEAD', 'main', 'master'];
  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/AGENT.md`;
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        const text = await response.text();
        return { text, sourceUrl: url };
      }
    } catch {
      /* try next branch */
    }
  }
  throw new Error(`No AGENT.md found in ${owner}/${repo} on HEAD, main, or master.`);
}

export async function fetchPrStats(owner, repo, botHandle) {
  const handle = botHandle.replace(/^@/, '');
  const base = 'https://api.github.com/search/issues';
  const scope = `repo:${owner}/${repo}+type:pr+author:${encodeURIComponent(handle)}`;
  const [merged, closed] = await Promise.all([
    fetch(`${base}?q=${scope}+is:merged&per_page=50`).then((r) => r.json()),
    fetch(`${base}?q=${scope}+is:closed+-is:merged&per_page=50`).then((r) => r.json()),
  ]);
  const mergedCount = merged?.total_count ?? 0;
  const closedCount = closed?.total_count ?? 0;
  const total = mergedCount + closedCount;
  const items = [...(merged.items ?? []), ...(closed.items ?? [])]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 10);
  return {
    mergedCount,
    closedCount,
    total,
    acceptanceRate: total > 0 ? mergedCount / total : 0,
    recentItems: items,
  };
}

export async function fetchRecentCommits(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`;
  try {
    const response = await fetch(url);
    if (!response.ok) return { count: 0, spanDays: 0 };
    const commits = await response.json();
    if (!commits.length) return { count: 0, spanDays: 0 };
    const first = new Date(commits[commits.length - 1].commit.author.date);
    const last = new Date(commits[0].commit.author.date);
    const spanDays = Math.max(
      1,
      Math.round((last - first) / (1000 * 60 * 60 * 24)),
    );
    return { count: commits.length, spanDays };
  } catch {
    return { count: 0, spanDays: 0 };
  }
}

const autonomyGrades = {
  scripted: 0.1,
  human_in_loop: 0.3,
  supervised: 0.5,
  autonomous: 0.8,
  long_horizon_unattended: 1,
};

function capAutonomy(grade) {
  // Evidence cap rule from docs/MEASUREMENT_MODEL.md: without signed
  // telemetry or CI evidence, autonomy caps at `supervised`.
  const numeric = autonomyGrades[grade] ?? 0.5;
  return Math.min(numeric, autonomyGrades.supervised);
}

export function computeAxes({ manifest, prStats, commitStats }) {
  const reachValue = Math.min(1, manifest.systems.length / 8);
  const reachConfidence = manifest.systems.length > 0 ? 0.55 : 0.3;

  const depthRaw =
    Math.log(1 + (commitStats.count + prStats.total)) *
    Math.min(180, commitStats.spanDays) *
    0.003;
  const depthValue = Math.max(0, Math.min(1, depthRaw));
  const depthConfidence = commitStats.count > 10 ? 0.65 : 0.4;

  const autonomyValue = capAutonomy(manifest.declaredAutonomy);
  const autonomyClaimedAbove =
    (autonomyGrades[manifest.declaredAutonomy] ?? autonomyValue) > autonomyValue;
  const autonomyConfidence = autonomyClaimedAbove ? 0.3 : 0.55;

  const acceptanceValue = prStats.total > 0 ? prStats.acceptanceRate : 0;
  const acceptanceConfidence = prStats.total >= 10 ? 0.7 : 0.35;

  return {
    reach: {
      v: reachValue,
      c: reachConfidence,
      detail: `${manifest.systems.length} declared systems`,
    },
    depth: {
      v: depthValue,
      c: depthConfidence,
      detail: `${commitStats.count} commits over ${commitStats.spanDays || 'n/a'} days`,
    },
    autonomy: {
      v: autonomyValue,
      c: autonomyConfidence,
      grade: autonomyClaimedAbove ? 'supervised' : manifest.declaredAutonomy,
      capNote: autonomyClaimedAbove
        ? `claimed ${manifest.declaredAutonomy}; capped at supervised without harness telemetry`
        : 'evidence consistent with claim',
    },
    acceptance: {
      v: acceptanceValue,
      c: acceptanceConfidence,
      externalN: prStats.total,
      externalRate: prStats.acceptanceRate,
      selfRate: null,
    },
  };
}
