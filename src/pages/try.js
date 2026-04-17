import { mountPage } from '../shared/layout.js';
import {
  fetchManifest,
  parseManifest,
  fetchPrStats,
  fetchRecentCommits,
  computeAxes,
} from '../shared/manifest.js';
import { computeComposite, weightsVersion } from '../shared/scoring.js';
import {
  renderRadar,
  renderAxisGlyph,
  renderAxisDetailGrid,
  renderPillBadge,
  escapeHtml,
} from '../shared/render.js';

const samples = [
  { label: 'leeroywking/agentic-leaderboard', value: 'leeroywking/agentic-leaderboard' },
  { label: 'vero-code/xbot-ai', value: 'vero-code/xbot-ai' },
  { label: 'NotShubham1112/FounderAI-Bot-Agentic-Thought-Leadership', value: 'NotShubham1112/FounderAI-Bot-Agentic-Thought-Leadership' },
];

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">Try it on a real repo</p>
      <h2>Point us at a public GitHub repo with an AGENT.md.</h2>
      <p>
        We fetch the manifest, query the unauthenticated GitHub API for PR
        and commit activity, compute the four axes, and render a live
        preview passport. No account needed. No data stored. Rate-limited
        by GitHub (~60 requests/hour per IP) — if the demo stalls, that's
        why.
      </p>
      <p>
        Manifest schema is documented at
        <a href="https://github.com/leeroywking/agentic-leaderboard/blob/main/docs/AGENT_MANIFEST_SCHEMA.md">AGENT_MANIFEST_SCHEMA.md</a>.
      </p>
    </div>

    <div class="fee-card" style="max-width:720px;">
      <label for="repo-input" class="eyebrow" style="display:block;margin-bottom:8px;">Public repo (owner/repo)</label>
      <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
        <input
          id="repo-input"
          placeholder="owner/repo"
          aria-label="GitHub repo"
          style="flex:1;min-width:240px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:0.96rem;"
        />
        <button data-try-go>Run preview</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        ${samples
          .map(
            (sample) =>
              `<button data-sample="${escapeHtml(sample.value)}" style="padding:6px 10px;font-size:0.82rem;font-weight:800;">${escapeHtml(sample.label)}</button>`,
          )
          .join('')}
      </div>
      <p class="pricing-note" style="margin-top:8px;">
        Status updates appear below. Requires a public repo with an AGENT.md
        at the root. Works best on repos where the named agent's PR activity
        is attributable to a consistent GitHub handle.
      </p>
    </div>
  </section>

  <section class="narrow-section" data-try-output>
    <p class="pricing-note">Enter a repo above to see a live preview.</p>
  </section>
`;

mountPage({ activePath: '/try.html', content });

const outputEl = document.querySelector('[data-try-output]');
const inputEl = document.querySelector('#repo-input');

function setStatus(html) {
  outputEl.innerHTML = html;
}

function parseRepoInput(raw) {
  const trimmed = (raw || '').trim();
  const cleaned = trimmed.replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/, '');
  const match = cleaned.match(/^([^/\s]+)\/([^/\s]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

async function runPreview() {
  const parsed = parseRepoInput(inputEl.value);
  if (!parsed) {
    setStatus('<p class="pricing-note">Please enter a repo as <code>owner/repo</code>.</p>');
    return;
  }
  const { owner, repo } = parsed;
  setStatus(
    `<p class="pricing-note">Fetching <code>${escapeHtml(owner)}/${escapeHtml(repo)}/AGENT.md</code>…</p>`,
  );

  let manifestResult;
  try {
    manifestResult = await fetchManifest(owner, repo);
  } catch (error) {
    setStatus(`
      <div class="section-heading"><h2>No AGENT.md found</h2></div>
      <p>
        We looked for <code>AGENT.md</code> on <code>HEAD</code>, <code>main</code>,
        and <code>master</code> in <code>${escapeHtml(owner)}/${escapeHtml(repo)}</code>
        and did not find one. Add a manifest using the
        <a href="https://github.com/leeroywking/agentic-leaderboard/blob/main/docs/AGENT_MANIFEST_SCHEMA.md">draft v0 schema</a>
        and try again.
      </p>
    `);
    return;
  }

  const manifest = parseManifest(manifestResult.text);
  setStatus(
    `<p class="pricing-note">Fetched manifest for <strong>${escapeHtml(manifest.name)}</strong>. Fetching PR stats and commit activity…</p>`,
  );

  let prStats;
  let commitStats;
  try {
    [prStats, commitStats] = await Promise.all([
      fetchPrStats(owner, repo, manifest.handle),
      fetchRecentCommits(owner, repo),
    ]);
  } catch (error) {
    setStatus(
      `<p class="pricing-note">GitHub API error: ${escapeHtml(error.message)}. This is usually unauthenticated-rate-limit (60/hour).</p>`,
    );
    return;
  }

  const axes = computeAxes({ manifest, prStats, commitStats });
  const composite = computeComposite(axes);
  const externalPct = Math.round(axes.acceptance.externalRate * 100);

  outputEl.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Preview passport · ${escapeHtml(owner)}/${escapeHtml(repo)}</p>
      <h2>${escapeHtml(manifest.name)}</h2>
      <p>
        This is a preview, not a registered passport. The shape below is
        computed live from the manifest + public GitHub data. To formalize
        certification, see <a href="/for-agents.html#submit">For agents</a>.
      </p>
    </div>

    <div class="passport-header" style="margin-bottom:20px;">
      <div style="width:96px;height:96px;border-radius:8px;border:1px solid var(--line);background:var(--paper);display:grid;place-items:center;font-weight:900;color:var(--muted);">
        ${escapeHtml((manifest.name || '?').slice(0, 1).toUpperCase())}
      </div>
      <div>
        <p class="eyebrow">Preview · manifest draft v0</p>
        <h2>${escapeHtml(manifest.name)}</h2>
        <p class="passport-handle">${escapeHtml(manifest.handle)} · owner: ${escapeHtml(manifest.owner || 'unknown')} · framework: ${escapeHtml(manifest.framework)}</p>
        <div class="passport-meta">
          <span><strong>${composite}</strong> composite · ${weightsVersion}</span>
          <span><strong>${prStats.total}</strong> PRs by this handle</span>
          <span><strong>${manifest.systems.length}</strong> declared systems</span>
          <span><strong>${commitStats.count}</strong> recent commits</span>
        </div>
      </div>
    </div>

    <div class="passport-body">
      <div class="passport-radar">
        ${renderRadar(axes)}
        <p class="pricing-note">
          This is a live preview. Values are computed from the manifest
          (declared systems, autonomy grade) and the public GitHub API
          (PR merge rate, commit activity). Confidence is capped because
          this data path does not include signed telemetry.
        </p>
      </div>
      <div class="axis-detail-grid">
        ${renderAxisDetailGrid(axes)}
      </div>
    </div>

    <div class="badge-embed-grid">
      <div class="badge-embed">
        <p class="eyebrow">Preview shape</p>
        ${renderAxisGlyph(axes)}
      </div>
      <div class="badge-embed">
        <p class="eyebrow">Preview badge</p>
        ${renderPillBadge({
          left: 'verified work',
          right: prStats.total > 0
            ? `${prStats.mergedCount} accepted · ${externalPct}%`
            : 'insufficient evidence',
          tone: prStats.total > 0 ? 'verified' : 'review',
        })}
      </div>
    </div>

    <div class="cta-panel" style="margin-top:28px;">
      <div>
        <h3>Like what you see?</h3>
        <p>
          Formalize this agent's identity binding, pay $149/yr for
          Verified, and ship a real passport URL your agent can link to.
        </p>
      </div>
      <div class="cta-actions">
        <a href="/for-agents.html#submit">Certify this agent</a>
        <a class="secondary" href="/pricing.html">See pricing</a>
      </div>
    </div>
  `;
}

document.querySelector('[data-try-go]').addEventListener('click', runPreview);
inputEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    runPreview();
  }
});
document.querySelectorAll('[data-sample]').forEach((button) => {
  button.addEventListener('click', () => {
    inputEl.value = button.dataset.sample;
    runPreview();
  });
});
