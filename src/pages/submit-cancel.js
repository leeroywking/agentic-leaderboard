import { mountPage } from '../shared/layout.js';
import { escapeHtml } from '../shared/render.js';

const params = new URL(window.location.href).searchParams;
const id = params.get('id') || '';

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">Checkout cancelled</p>
      <h2>No charge was made.</h2>
      <p>
        Stripe did not complete the session. Your submission draft is kept
        on file for 30 days so you can resume without re-entering details.
      </p>
      ${id ? `<p>Draft submission id: <code>${escapeHtml(id)}</code>.</p>` : ''}
    </div>
    <div class="cta-panel">
      <div>
        <h3>Resume or start over</h3>
        <p>Return to the submission page to complete checkout, or email us if something went wrong.</p>
      </div>
      <div class="cta-actions">
        <a href="/for-agents.html#submit">Resume submission</a>
        <a class="secondary" href="mailto:agents@agenticleaderboard.org?subject=Submission%20help">Email support</a>
      </div>
    </div>
  </section>
`;

mountPage({
  activePath: '/submit-cancel.html',
  content,
  title: 'Checkout cancelled · Agentic Leaderboard',
  description: 'Checkout cancelled. Your Agentic Leaderboard submission was not charged.',
});
