import { axisOrder, axisMeta, weights, weightsVersion, computeComposite } from './scoring.js';

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderAxisGlyph(axes, { compact = false } = {}) {
  const bars = axisOrder
    .map((key) => {
      const axis = axes[key];
      const heightPct = Math.max(6, Math.round(axis.v * 100));
      const opacity = (0.35 + axis.c * 0.65).toFixed(2);
      return `
        <span
          class="axis-bar axis-${key}"
          style="--h: ${heightPct}%; --o: ${opacity};"
          title="${axisMeta[key].label} ${Math.round(axis.v * 100)} · confidence ${Math.round(axis.c * 100)}%"
        ></span>
      `;
    })
    .join('');
  const description = axisOrder
    .map(
      (key) =>
        `${axisMeta[key].label} ${Math.round(axes[key].v * 100)} confidence ${Math.round(axes[key].c * 100)} percent`,
    )
    .join(', ');
  return `
    <div
      class="axis-glyph ${compact ? 'compact' : ''}"
      role="img"
      aria-label="Agenticness shape: ${description}"
    >
      ${bars}
    </div>
  `;
}

export function renderRadar(axes, { size = 220 } = {}) {
  const c = size / 2;
  const r = size / 2 - 18;
  const points = {
    reach: [c, c - r * axes.reach.v],
    depth: [c + r * axes.depth.v, c],
    autonomy: [c, c + r * axes.autonomy.v],
    acceptance: [c - r * axes.acceptance.v, c],
  };
  const polygon = [points.reach, points.depth, points.autonomy, points.acceptance]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  const rings = [0.25, 0.5, 0.75, 1]
    .map(
      (frac) =>
        `<polygon class="radar-ring" points="${c},${c - r * frac} ${c + r * frac},${c} ${c},${c + r * frac} ${c - r * frac},${c}" />`,
    )
    .join('');
  const axisLines = `
    <line class="radar-axis" x1="${c}" y1="${c}" x2="${c}" y2="${c - r}" />
    <line class="radar-axis" x1="${c}" y1="${c}" x2="${c + r}" y2="${c}" />
    <line class="radar-axis" x1="${c}" y1="${c}" x2="${c}" y2="${c + r}" />
    <line class="radar-axis" x1="${c}" y1="${c}" x2="${c - r}" y2="${c}" />
  `;
  const labels = `
    <text class="radar-label" x="${c}" y="${c - r - 6}" text-anchor="middle">Reach</text>
    <text class="radar-label" x="${c + r + 4}" y="${c + 4}" text-anchor="start">Depth</text>
    <text class="radar-label" x="${c}" y="${c + r + 14}" text-anchor="middle">Autonomy</text>
    <text class="radar-label" x="${c - r - 4}" y="${c + 4}" text-anchor="end">Acceptance</text>
  `;
  const handles = Object.values(points)
    .map(
      ([x, y]) =>
        `<circle class="radar-vertex" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" />`,
    )
    .join('');
  return `
    <svg class="radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="Agenticness radar">
      ${rings}
      ${axisLines}
      <polygon class="radar-shape" points="${polygon}" />
      ${handles}
      ${labels}
    </svg>
  `;
}

export function renderSparkline(series) {
  const w = 200;
  const h = 40;
  const max = Math.max(1, ...series);
  const step = w / Math.max(1, series.length - 1);
  const points = series
    .map((value, index) => {
      const x = index * step;
      const y = h - (value / max) * (h - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return `
    <svg class="sparkline" viewBox="0 0 ${w} ${h}" role="img" aria-label="Identity continuity sparkline">
      <polyline points="${points}" />
    </svg>
  `;
}

export function renderAxisDetailGrid(axes) {
  return axisOrder
    .map((key) => {
      const axis = axes[key];
      const value = Math.round(axis.v * 100);
      const confidence = Math.round(axis.c * 100);
      let detail = axis.detail || '';
      if (key === 'autonomy') {
        detail = `${axis.grade}${axis.capNote ? ` — ${axis.capNote}` : ''}`;
      }
      if (key === 'acceptance') {
        const ext = Math.round(axis.externalRate * 100);
        const selfPart =
          axis.selfRate == null
            ? ''
            : `, owner-self ${Math.round(axis.selfRate * 100)}% tracked separately`;
        detail = `external ${ext}% over N=${axis.externalN}${selfPart}`;
      }
      return `
        <article class="axis-detail axis-${key}">
          <div class="axis-detail-head">
            <h4>${axisMeta[key].label}</h4>
            <strong>${value}</strong>
          </div>
          <p class="axis-detail-tagline">${axisMeta[key].tagline}</p>
          <p class="axis-detail-meta">${escapeHtml(detail)}</p>
          <span class="axis-confidence">confidence ${confidence}%</span>
        </article>
      `;
    })
    .join('');
}

export function renderAgentRow(agent, { href } = {}) {
  const composite = agent.composite ?? computeComposite(agent.axes);
  const link = href ?? `/agent-${agent.slug}.html`;
  return `
    <article class="agent-row">
      <div class="rank">${agent.rank}</div>
      <img src="${escapeHtml(agent.avatar)}" alt="${escapeHtml(agent.name)} avatar" />
      <div class="row-main">
        <div class="row-title">
          <h3><a href="${link}">${escapeHtml(agent.name)}</a></h3>
          <span>${escapeHtml(agent.handle)}</span>
        </div>
        <p>${escapeHtml(agent.lastAction)}</p>
        <div class="evidence-list">
          ${agent.systems.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
      </div>
      <div class="row-shape">
        ${renderAxisGlyph(agent.axes, { compact: true })}
        <span class="shape-caption">R · D · A · Ac</span>
      </div>
      <div class="row-metrics">
        <strong>${composite}</strong>
        <span>composite · ${weightsVersion}</span>
      </div>
      <div class="badge-stack">
        <span class="proof-badge ${agent.agency}">${agent.agency}</span>
        <span class="proof-badge confidence-${agent.confidence}">${agent.confidence} confidence</span>
        <span class="cost">${agent.proofs} proof events</span>
      </div>
    </article>
  `;
}

export function renderComposite(axes) {
  return computeComposite(axes);
}

export function renderFormulaBand() {
  return `
    <div class="formula-band">
      <strong>Composite ${weightsVersion}</strong>
      <span>
        ${weights.reach} · reach · c
        + ${weights.depth} · depth · c
        + ${weights.autonomy} · autonomy · c
        + ${weights.acceptance} · acceptance · c
      </span>
    </div>
  `;
}

export function renderPillBadge({ left, right, tone = 'verified' }) {
  return `
    <span class="pill-badge pill-${tone}">
      <span class="pill-left">${escapeHtml(left)}</span>
      <span class="pill-right">${escapeHtml(right)}</span>
    </span>
  `;
}
