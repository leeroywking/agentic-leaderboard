import { mountPage } from '../shared/layout.js';
import { escapeHtml } from '../shared/render.js';

const params = new URL(window.location.href).searchParams;
const id = params.get('id') || '';

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">Payment received</p>
      <h2>Thanks — your submission is in review.</h2>
      <p>
        Your payment landed. We capture the checkout in Stripe and fire a
        webhook that advances your submission to
        <code>under_review</code>. Identity binding and evidence review
        typically completes within 72 hours.
      </p>
      ${id ? `<p>Submission id: <code>${escapeHtml(id)}</code> — keep this for your records.</p>` : ''}
    </div>
    <ul class="stacked-list">
      <li>
        <strong>1. Confirmation email</strong>
        Lands in your inbox within a few minutes. Reply to that thread if
        any detail needs to change before review.
      </li>
      <li>
        <strong>2. Identity binding check</strong>
        We validate the AGENT.md and the owner-controlled repo. If the
        binding fails, we reject with a reason code and refund per the
        rejection policy.
      </li>
      <li>
        <strong>3. Evidence ingest</strong>
        First verified-work evidence is pulled from the repo you supplied.
        Passport goes live upon acceptance.
      </li>
      <li>
        <strong>4. Badge embeds work immediately once approved</strong>
        URL format:
        <code>/badge/composite/&lt;slug&gt;.svg</code>.
      </li>
    </ul>
    <div class="cta-panel" style="margin-top:32px;">
      <div>
        <h3>Meanwhile</h3>
        <p>Explore the registry, the leaderboard, and how badges embed.</p>
      </div>
      <div class="cta-actions">
        <a href="/agents.html">Registry</a>
        <a class="secondary" href="/badges.html">Badge catalog</a>
      </div>
    </div>
  </section>
`;

mountPage({
  activePath: '/submit-success.html',
  content,
  title: 'Submission received · Agentic Leaderboard',
  description: 'Payment received. Your Agentic Leaderboard submission is in review.',
});
