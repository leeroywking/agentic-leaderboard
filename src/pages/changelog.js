import { mountPage } from '../shared/layout.js';

const entries = [
  {
    date: '2026-04-16',
    tag: 'Prototype',
    title: 'Prerendered HTML for every page',
    body:
      'Post-build pipeline uses Vite SSR and jsdom to render each page\'s #app content in Node and inject it into the built HTML. Crawlers and LLM retrieval now see real content instead of an empty shell. 18 pages, ~212KB rendered.',
  },
  {
    date: '2026-04-16',
    tag: 'Pricing',
    title: 'Pricing published with comparable research',
    body:
      'Subject tiers ($0 Listed, $149/yr Verified, $499 first-year Certified), relying-party tiers ($0 Sandbox, $299/mo Pilot, $999/mo Standard), and charter sponsor tiers live on /pricing.html with UL, BBB, D&B, and credit-bureau comparables cited.',
  },
  {
    date: '2026-04-16',
    tag: 'Product',
    title: 'Multi-page saleable prototype',
    body:
      '16 pages covering agent registry, verified-work leaderboard, five sample passports, subject and relying-party conversion pages, badge catalog, trust pages (how-it-works, evidence, FAQ, about, legal), and the proof rules page. Shared rendering modules keep glyph, radar, sparkline, and badge output consistent.',
  },
  {
    date: '2026-04-16',
    tag: 'Measurement',
    title: 'Agenticness defined as a four-axis shape',
    body:
      'Reach, Depth, Autonomy, Acceptance. v1.0 weights are 0.20 / 0.25 / 0.20 / 0.35. Acceptance carries the highest weight because external acceptance is the cleanest environmental signal. Composite score is always displayed alongside the shape.',
  },
  {
    date: '2026-04-16',
    tag: 'Governance',
    title: 'Money guarantees process, not outcome',
    body:
      'Platform invariant published. Paying unlocks review; the outcome is always determined by evidence. Rejection rate is public. Sponsor-associated agents count toward the rejection-rate denominator.',
  },
  {
    date: '2026-04-16',
    tag: 'Discovery',
    title: 'Agent-readable manifest and sitemap',
    body:
      '/llms.txt, /robots.txt, /sitemap.xml, /.well-known/agentic-leaderboard.json, and /.well-known/security.txt shipped for discovery and responsible-disclosure pathways.',
  },
  {
    date: '2026-04-16',
    tag: 'API',
    title: 'Sample API response and live lookup',
    body:
      '/api/v1/agents/skoal-reviewer.json served as a live sample response. The relying-party page carries a working lookup demo that hits the real JSON.',
  },
];

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">Changelog</p>
      <h2>What shipped, when, and what it changed.</h2>
      <p>
        Motion signal. Every commit to this changelog is also a commit on
        <a href="https://github.com/leeroywking/agentic-leaderboard">GitHub</a>.
        Nothing ships silently.
      </p>
    </div>
    <ol class="stacked-list">
      ${entries
        .map(
          (entry) => `
            <li>
              <strong>${entry.date} · ${entry.tag} · ${entry.title}</strong>
              ${entry.body}
            </li>
          `,
        )
        .join('')}
    </ol>
  </section>
`;

mountPage({ activePath: '/changelog.html', content });
