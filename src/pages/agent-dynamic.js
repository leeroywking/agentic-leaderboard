import { mountPage } from '../shared/layout.js';
import { findAgent } from '../shared/agents.js';
import { renderPassport } from './passport.js';
import { escapeHtml, renderRadar, renderSparkline, renderAxisDetailGrid, renderAxisGlyph, renderPillBadge } from '../shared/render.js';
import { computeComposite, weightsVersion } from '../shared/scoring.js';

const params = new URL(window.location.href).searchParams;
const slug = (params.get('slug') || '').toLowerCase();

function renderNotFound(message) {
  mountPage({
    activePath: '/agents.html',
    content: `
      <section class="section measure-section">
        <div class="section-heading">
          <p class="eyebrow">Agent passport</p>
          <h2>No agent matches that slug.</h2>
          <p>${escapeHtml(message)}</p>
        </div>
        <div class="cta-panel">
          <div>
            <h3>Back to the registry</h3>
            <p>Browse the full list of named agents.</p>
          </div>
          <div class="cta-actions">
            <a href="/agents.html">Agent registry</a>
            <a class="secondary" href="/for-agents.html">List an agent</a>
          </div>
        </div>
      </section>
    `,
  });
}

function renderFromApiRecord(record) {
  // The API response maps axis values back to the prototype's internal
  // shape for reuse of the existing passport renderers.
  const axes = {
    reach: {
      v: record.axes.reach.value,
      c: record.axes.reach.confidence,
      detail: `${record.axes.reach.systems?.length || 0} declared systems`,
    },
    depth: {
      v: record.axes.depth.value,
      c: record.axes.depth.confidence,
      detail: 'Awaiting connector data',
    },
    autonomy: {
      v: record.axes.autonomy.value,
      c: record.axes.autonomy.confidence,
      grade: record.axes.autonomy.grade_accepted || 'supervised',
      capNote: record.axes.autonomy.cap_note || 'capped by available evidence',
    },
    acceptance: {
      v: record.axes.acceptance.value,
      c: record.axes.acceptance.confidence,
      externalN: record.axes.acceptance.external_n || 0,
      externalRate: record.axes.acceptance.external_rate || 0,
      selfRate: record.axes.acceptance.self_rate,
    },
  };
  const composite = computeComposite(axes);
  const externalPct = Math.round((axes.acceptance.externalRate || 0) * 100);

  const content = `
    <section class="section profile-section">
      <div class="passport-header">
        <div style="width:96px;height:96px;border-radius:8px;border:1px solid var(--line);background:var(--paper);display:grid;place-items:center;font-weight:900;font-size:2rem;color:var(--muted);">
          ${escapeHtml((record.name || '?').slice(0, 1).toUpperCase())}
        </div>
        <div>
          <p class="eyebrow">Agent passport · ${escapeHtml(record.certification || 'verified')}</p>
          <h2>${escapeHtml(record.name)}</h2>
          <p class="passport-handle">${escapeHtml(record.handle)} · ${escapeHtml(record.type || 'named agent')}</p>
          <div class="passport-meta">
            <span><strong>${composite}</strong> composite · ${weightsVersion}</span>
            <span><strong>${record.axes.acceptance.external_n || 0}</strong> accepted events</span>
            <span><strong>${record.axes.reach.systems?.length || 0}</strong> declared systems</span>
          </div>
        </div>
      </div>
      <div class="passport-body">
        <div class="passport-radar">
          ${renderRadar(axes)}
          <div class="continuity">
            <p class="eyebrow">Identity continuity</p>
            ${renderSparkline(Array(12).fill(0))}
            <p class="continuity-note">Awaiting first verified evidence. Sparkline fills as proof events land.</p>
          </div>
        </div>
        <div class="axis-detail-grid">
          ${renderAxisDetailGrid(axes)}
        </div>
      </div>
      <div class="badge-embed-grid">
        <div class="badge-embed">
          <p class="eyebrow">Shape</p>
          ${renderAxisGlyph(axes)}
        </div>
        <div class="badge-embed">
          <p class="eyebrow">Badge</p>
          ${renderPillBadge({
            left: 'verified work',
            right: (record.axes.acceptance.external_n || 0) > 0
              ? `${record.axes.acceptance.external_n} accepted · ${externalPct}%`
              : 'awaiting first evidence',
            tone: (record.axes.acceptance.external_n || 0) > 0 ? 'verified' : 'review',
          })}
        </div>
      </div>
    </section>

    <section class="narrow-section">
      <div class="section-heading">
        <p class="eyebrow">Identity bindings</p>
        <h2>Owner: ${escapeHtml(record.owner?.handle || 'unknown')} (${escapeHtml(record.owner?.kind || 'unknown')})</h2>
      </div>
      <ul class="stacked-list">
        ${(record.identity_bindings || [])
          .map(
            (b) => `
              <li>
                <strong>${escapeHtml(b.type)}</strong>
                <code>${escapeHtml(b.value)}</code>
              </li>
            `,
          )
          .join('')}
      </ul>
    </section>
  `;

  mountPage({
    activePath: '/agents.html',
    content,
    title: `${record.name} · Agentic Leaderboard`,
    description: `Passport for ${record.name}. Composite ${composite} against weights ${weightsVersion}.`,
  });
}

async function main() {
  if (!slug) {
    renderNotFound('Add a slug like /agent.html?slug=skoal-reviewer');
    return;
  }

  // If the agent is in the static dataset, delegate to the existing
  // passport renderer which has the richest view.
  if (findAgent(slug)) {
    renderPassport(slug);
    return;
  }

  try {
    const response = await fetch(`/api/public/agents/${encodeURIComponent(slug)}`);
    if (!response.ok) {
      renderNotFound(`No passport found for slug "${slug}".`);
      return;
    }
    const record = await response.json();
    renderFromApiRecord(record);
  } catch (err) {
    renderNotFound(`Failed to load passport: ${err.message}`);
  }
}

main();
