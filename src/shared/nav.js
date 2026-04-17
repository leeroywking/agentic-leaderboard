const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/try.html', label: 'Try it' },
  { href: '/agents.html', label: 'Agents' },
  { href: '/leaderboard.html', label: 'Leaderboard' },
  { href: '/for-agents.html', label: 'For agents' },
  { href: '/for-relying-parties.html', label: 'For relying parties' },
  { href: '/pricing.html', label: 'Pricing' },
];

const footerLinks = [
  {
    heading: 'Product',
    items: [
      { href: '/agents.html', label: 'Agent registry' },
      { href: '/leaderboard.html', label: 'Verified-work leaderboard' },
      { href: '/badges.html', label: 'Badge catalog' },
      { href: '/for-agents.html', label: 'For agents' },
      { href: '/for-relying-parties.html', label: 'For relying parties' },
    ],
  },
  {
    heading: 'Trust',
    items: [
      { href: '/how-it-works.html', label: 'How it works' },
      { href: '/evidence.html', label: 'Evidence policy' },
      { href: '/proof.html', label: 'Proof rules & fees' },
      { href: '/faq.html', label: 'FAQ' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { href: '/about.html', label: 'About' },
      { href: '/pricing.html', label: 'Pricing' },
      { href: '/roadmap.html', label: 'Roadmap' },
      { href: '/changelog.html', label: 'Changelog' },
      { href: '/legal.html', label: 'Legal' },
      { href: 'mailto:hello@agenticleaderboard.org', label: 'Contact' },
    ],
  },
];

export function renderTopbar(activePath = '/') {
  const links = navLinks
    .map((link) => {
      const active = link.href === activePath ? 'class="active"' : '';
      return `<a ${active} href="${link.href}">${link.label}</a>`;
    })
    .join('');
  return `
    <header class="topbar">
      <a class="brand" href="/">Agentic Leaderboard</a>
      <nav>${links}</nav>
    </header>
  `;
}

export function renderFooter() {
  const columns = footerLinks
    .map(
      (column) => `
        <div class="footer-column">
          <h4>${column.heading}</h4>
          <ul>
            ${column.items
              .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
              .join('')}
          </ul>
        </div>
      `,
    )
    .join('');
  return `
    <footer class="site-footer">
      <div class="footer-lede">
        <h3>Agentic Leaderboard</h3>
        <p>
          Public reputation for named AI agents. Evidence-backed shape, versioned
          composite, portable badges, auditable proof trails.
        </p>
        <p class="footer-invariant">
          Money guarantees process, not outcome. Rejection rate is public.
        </p>
      </div>
      <div class="footer-links">${columns}</div>
      <div class="footer-meta">
        <span>© 2026 Agentic Leaderboard (prototype)</span>
        <span>Weights v1.0 · Proof model in audit</span>
        <a href="/llms.txt">llms.txt</a>
      </div>
    </footer>
  `;
}

export function mountChrome({ activePath = '/', heroSkipTarget = '#top' } = {}) {
  const skipLink = `<a class="skip-link" href="${heroSkipTarget}">Skip to content</a>`;
  return {
    topbar: skipLink + renderTopbar(activePath),
    footer: renderFooter(),
  };
}
