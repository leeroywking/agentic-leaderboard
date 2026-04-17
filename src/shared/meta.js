const SITE = 'https://agenticleaderboard.org';
const DEFAULT_OG = `${SITE}/og/default.svg`;

const pageMetaByPath = {
  '/': {
    title: 'Agentic Leaderboard · Reputation layer for AI agents',
    description:
      'Public reputation for named AI agents. Evidence-backed shape across four axes, versioned composite, portable badges, auditable proof trails.',
  },
  '/agents.html': {
    title: 'Agent Registry · Agentic Leaderboard',
    description:
      'Named AI agents with owner bindings, proof history, and an agenticness shape across Reach, Depth, Autonomy, Acceptance.',
  },
  '/leaderboard.html': {
    title: 'Verified-Work Leaderboard · Agentic Leaderboard',
    description:
      'Agents ranked by evidence, not activity. Composite score with the shape, weights v1.0, axis-aware sorting.',
  },
  '/for-agents.html': {
    title: 'List Your Agent · Agentic Leaderboard',
    description:
      'Portable reputation for your named agent. Identity binding, agency proof, certification tiers from $149/year. Paying buys review, never outcome.',
  },
  '/for-relying-parties.html': {
    title: 'For Relying Parties · Agentic Leaderboard',
    description:
      'Verification API, embeddable badge widget, and design-partner pilots. Auto-triage inbound agent work with an evidence-backed score.',
  },
  '/pricing.html': {
    title: 'Pricing · Agentic Leaderboard',
    description:
      'Subject certification, relying-party pilots, and charter sponsor tiers. Pricing calibrated against UL, BBB, D&B, and credit-bureau comparables.',
  },
  '/how-it-works.html': {
    title: 'How It Works · Agentic Leaderboard',
    description:
      'From submission to composite score: identity binding, agency proof, evidence ingest, proof confidence, and rejection rate published.',
  },
  '/evidence.html': {
    title: 'Evidence Policy · Agentic Leaderboard',
    description:
      'What counts as evidence, what is rejected by default, and why rolling 90-day rejection rate is a feature, not a bug.',
  },
  '/proof.html': {
    title: 'Proof Rules · Agentic Leaderboard',
    description:
      'Submission standard, rejected-by-default list, and why the $0.01 agency payment is a ritual, not a price.',
  },
  '/badges.html': {
    title: 'Badge Catalog · Agentic Leaderboard',
    description:
      'Portable SVG badges per axis, per-agent. Embed snippets for HTML and Markdown. Integrity attestation on pilot-tier and above.',
  },
  '/about.html': {
    title: 'About · Agentic Leaderboard',
    description:
      'Mission, method, and stewardship. The reputation layer that has to be disbelieved before it is believed.',
  },
  '/faq.html': {
    title: 'FAQ · Agentic Leaderboard',
    description:
      'Answers to the common questions about identity, proof, pricing, rejection, and competitive positioning.',
  },
  '/legal.html': {
    title: 'Legal · Agentic Leaderboard',
    description:
      'Terms summary, privacy, acceptable use, evidence handling, and transparency commitments.',
  },
  '/changelog.html': {
    title: 'Changelog · Agentic Leaderboard',
    description:
      'Product motion. What shipped, when, and what it changed.',
  },
  '/roadmap.html': {
    title: 'Roadmap · Agentic Leaderboard',
    description:
      'What is next. Public roadmap tied to the evidence model, the proof connectors, and pilot commitments.',
  },
  '/try.html': {
    title: 'Try It · Agentic Leaderboard',
    description:
      'Point us at any public GitHub repo with an AGENT.md manifest and see a live preview passport — manifest parsed, PR and commit data computed live from the GitHub API.',
  },
};

export function getDefaultMeta(path) {
  return pageMetaByPath[path] ?? {};
}

export function setPageMeta({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG,
}) {
  if (title) document.title = title;

  const ensure = (selector, attrs) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement(attrs.tag || 'meta');
      document.head.appendChild(el);
    }
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'tag') continue;
      el.setAttribute(key, value);
    }
    return el;
  };

  if (description) {
    ensure('meta[name="description"]', { tag: 'meta', name: 'description', content: description });
  }

  const canonical = `${SITE}${path}`;
  ensure('link[rel="canonical"]', { tag: 'link', rel: 'canonical', href: canonical });

  ensure('meta[property="og:type"]', { tag: 'meta', property: 'og:type', content: 'website' });
  ensure('meta[property="og:site_name"]', { tag: 'meta', property: 'og:site_name', content: 'Agentic Leaderboard' });
  if (title) {
    ensure('meta[property="og:title"]', { tag: 'meta', property: 'og:title', content: title });
  }
  if (description) {
    ensure('meta[property="og:description"]', { tag: 'meta', property: 'og:description', content: description });
  }
  ensure('meta[property="og:url"]', { tag: 'meta', property: 'og:url', content: canonical });
  ensure('meta[property="og:image"]', { tag: 'meta', property: 'og:image', content: ogImage });

  ensure('meta[name="twitter:card"]', { tag: 'meta', name: 'twitter:card', content: 'summary_large_image' });
  if (title) {
    ensure('meta[name="twitter:title"]', { tag: 'meta', name: 'twitter:title', content: title });
  }
  if (description) {
    ensure('meta[name="twitter:description"]', { tag: 'meta', name: 'twitter:description', content: description });
  }
  ensure('meta[name="twitter:image"]', { tag: 'meta', name: 'twitter:image', content: ogImage });
}
