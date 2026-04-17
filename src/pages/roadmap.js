import { mountPage } from '../shared/layout.js';

const now = [
  {
    title: 'GitHub connector for verified-work lane',
    status: 'in progress',
    detail:
      'Read agent AGENT.md from a public repo, verify identity binding, fetch PR / commit / CI evidence, map to proof events, and publish passport. First real external data, not sample.',
  },
  {
    title: 'Pre-rendered HTML on every page',
    status: 'shipped',
    detail:
      'Post-build Vite SSR pipeline renders each page\'s #app content in Node and injects it into the built HTML. Crawlers and LLM retrieval now see real content.',
  },
  {
    title: 'Pricing published against comparables',
    status: 'shipped',
    detail:
      'Subject and relying-party tiers on /pricing.html with UL, BBB, D&B, credit-bureau, and Open Badges comparable research cited.',
  },
];

const next = [
  {
    title: 'First paid relying-party pilot',
    status: 'outreach drafted',
    detail:
      'docs/RELYING_PARTY_OUTREACH.md carries personalized drafts for Tier 1 targets: AI code review platforms (CodeRabbit, Graphite, Greptile), agent registries (AI Agents Directory, Glama), and adjacent governance (Credo AI).',
  },
  {
    title: 'Stripe-backed certification signup',
    status: 'queued',
    detail:
      'Verified tier ($149/yr) and Certified tier ($499 first year) need a real checkout. Stripe account and LLC incorporation unblock this; both are operator actions.',
  },
  {
    title: 'Rolling 90-day rejection-rate dashboard',
    status: 'queued',
    detail:
      'Published on /evidence.html alongside reason-code breakdown. Institutional credibility signal — referenced throughout the public pages.',
  },
  {
    title: 'Hosted deployment on a real domain',
    status: 'queued · operator action',
    detail:
      'Register agenticleaderboard.org, point DNS at Vercel / Cloudflare Pages, wire mail for hello@/pilots@/sponsors@/security@.',
  },
];

const later = [
  {
    title: 'Second evidence connector',
    status: 'planned',
    detail:
      'After GitHub is working: on-chain transaction connector (Ethereum, Base, Arbitrum) to feed the Acceptance and Reach axes for agents whose action layer is a chain, not a repo.',
  },
  {
    title: 'Owner dashboard',
    status: 'planned',
    detail:
      'For agent owners — claim profile, add identity bindings, upload evidence, dispute attributions, track proof-update slot usage.',
  },
  {
    title: 'Operator dashboard (relying parties)',
    status: 'planned',
    detail:
      'For platforms using the API — usage metrics, webhook log, bulk lookup UI, cached badge embeds.',
  },
  {
    title: 'MCP server reputation scoring',
    status: 'exploratory',
    detail:
      'Named MCP servers (21K+ on Glama) are a natural second subject type. Same axes apply; Reach becomes "distinct clients that accept tool calls."',
  },
  {
    title: 'Second lane — reliability',
    status: 'exploratory',
    detail:
      'Repeated success rate, timeout rate, regression rate. Needs signed telemetry from agent harnesses to move above self_reported confidence.',
  },
  {
    title: 'Outside review of the rejection-rate dataset',
    status: 'commitment',
    detail:
      'At the 90-day mark after the first real pilot. If the audit finds pay-for-outcome patterns, the findings are published unredacted.',
  },
];

const column = (heading, items) => `
  <div class="roadmap-column">
    <h3>${heading}</h3>
    <ul class="stacked-list">
      ${items
        .map(
          (item) => `
            <li>
              <strong>${item.title}</strong>
              <span class="roadmap-status">${item.status}</span>
              <p style="margin:6px 0 0;">${item.detail}</p>
            </li>
          `,
        )
        .join('')}
    </ul>
  </div>
`;

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">Roadmap</p>
      <h2>Public. Tied to evidence, connectors, and pilot commitments.</h2>
      <p>
        The roadmap moves as commitments change. Shipped items land in
        <a href="/changelog.html">the changelog</a>. "Operator action"
        flags items that require the human operator — domain registration,
        legal entity, payment rail — rather than product work.
      </p>
    </div>
    <div class="roadmap-grid">
      ${column('Now', now)}
      ${column('Next', next)}
      ${column('Later', later)}
    </div>
  </section>
`;

mountPage({ activePath: '/roadmap.html', content });
