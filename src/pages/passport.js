import { mountPage } from '../shared/layout.js';
import { findAgent } from '../shared/agents.js';
import { computeComposite, weightsVersion } from '../shared/scoring.js';
import {
  renderRadar,
  renderSparkline,
  renderAxisDetailGrid,
  renderAxisGlyph,
  renderPillBadge,
  escapeHtml,
} from '../shared/render.js';

export function renderPassport(slug) {
  const agent = findAgent(slug);
  if (!agent) {
    mountPage({
      activePath: '/agents.html',
      content: `<section class="section"><h2>Agent not found</h2><p>Back to the <a href="/agents.html">registry</a>.</p></section>`,
    });
    return;
  }

  const composite = computeComposite(agent.axes);
  const externalN = agent.axes.acceptance.externalN ?? 0;
  const externalPct = Math.round((agent.axes.acceptance.externalRate ?? 0) * 100);

  const bindingsHtml = agent.identityBindings
    .map(
      (binding) => `
        <li>
          <strong>${escapeHtml(binding.type)}</strong>
          <code>${escapeHtml(binding.value)}</code>
        </li>
      `,
    )
    .join('');

  const timelineHtml = agent.proofTimeline
    .map(
      (event) => `
        <article class="proof-event">
          <div>
            <time>${escapeHtml(event.date)}</time>
            <span class="event-kind">${escapeHtml(event.kind)}</span>
          </div>
          <div>
            <strong>${escapeHtml(event.title)}</strong>
            <p>
              ${escapeHtml(event.system)} · acceptor:
              ${escapeHtml(event.acceptor)} · confidence:
              ${escapeHtml(event.confidence)}
            </p>
          </div>
          <span class="event-outcome ${escapeHtml(event.outcome)}">${escapeHtml(event.outcome)}</span>
        </article>
      `,
    )
    .join('');

  const content = `
    <section class="section profile-section">
      <div class="passport-header">
        <img src="${escapeHtml(agent.avatar)}" alt="${escapeHtml(agent.name)} passport avatar" />
        <div>
          <p class="eyebrow">Agent passport · ${escapeHtml(agent.certification)}</p>
          <h2>${escapeHtml(agent.name)}</h2>
          <p class="passport-handle">${escapeHtml(agent.handle)} · ${escapeHtml(agent.type)}</p>
          <div class="passport-meta">
            <span><strong>${composite}</strong> composite · ${weightsVersion}</span>
            <span><strong>${agent.proofs}</strong> proof events</span>
            <span><strong>${agent.systems.length}</strong> verified systems</span>
            <span><strong>${escapeHtml(agent.framework)}</strong> framework</span>
          </div>
        </div>
      </div>
      <div class="passport-body">
        <div class="passport-radar">
          ${renderRadar(agent.axes)}
          <div class="continuity">
            <p class="eyebrow">Identity continuity since ${escapeHtml(agent.firstSeen)}</p>
            ${renderSparkline(agent.continuity)}
            <p class="continuity-note">
              Events under the same signed identity over 12 rolling months.
            </p>
          </div>
        </div>
        <div class="axis-detail-grid">
          ${renderAxisDetailGrid(agent.axes)}
        </div>
      </div>
      <div class="badge-embed-grid">
        <div class="badge-embed">
          <p class="eyebrow">Embeddable badge</p>
          ${renderPillBadge({
            left: 'verified work',
            right: externalN > 0 ? `${externalN} accepted · ${externalPct}%` : 'insufficient evidence',
            tone: externalN > 0 ? 'verified' : 'review',
          })}
          <p>
            One axis at a time, always linked back to the proof trail below.
            Drop-in embed code is on the <a href="/badges.html">badge catalog</a>.
          </p>
        </div>
        <div class="badge-embed">
          <p class="eyebrow">Shape at a glance</p>
          ${renderAxisGlyph(agent.axes)}
          <p>
            Bar height is axis value; bar opacity is proof confidence. Hover
            any bar in supported browsers to see the underlying value.
          </p>
        </div>
      </div>
    </section>

    <section class="narrow-section">
      <div class="section-heading">
        <p class="eyebrow">Identity and controller bindings</p>
        <h2>Owner: ${escapeHtml(agent.owner)} (${escapeHtml(agent.ownerType)})</h2>
        <p>
          At least one identity binding is required. Multiple bindings raise
          the certification tier and harden the passport against impersonation.
        </p>
      </div>
      <ul class="stacked-list">
        ${bindingsHtml}
      </ul>
    </section>

    <section class="section agenticness-section">
      <div class="section-heading">
        <p class="eyebrow">Proof timeline</p>
        <h2>Every event links to an independent source.</h2>
        <p>
          Accepted, rejected, and pending events all appear here. Nothing is
          hidden because it looks bad — the shape only means something if the
          failures are visible too.
        </p>
      </div>
      <div class="proof-timeline">
        ${timelineHtml}
      </div>
    </section>

    <section class="section source-section">
      <div class="cta-panel">
        <div>
          <h3>Is this your agent?</h3>
          <p>
            Claim the profile, upgrade certification, add identity bindings, or
            dispute an attribution on the owner dashboard.
          </p>
        </div>
        <div class="cta-actions">
          <a href="/for-agents.html#submit">Claim / upgrade</a>
          <a class="secondary" href="/agents.html">Back to registry</a>
        </div>
      </div>
    </section>
  `;

  mountPage({ activePath: '/agents.html', content });
}
