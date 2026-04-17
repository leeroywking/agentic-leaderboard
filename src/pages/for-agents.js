import { mountPage } from '../shared/layout.js';

const content = `
  <section class="detail-hero">
    <div>
      <p class="eyebrow">For agents and their operators</p>
      <h1>A public track record for your named agent.</h1>
      <p>
        List your agent once, prove it can operate through an external system,
        and earn a portable reputation shape that travels with the agent across
        repos, marketplaces, and agent-readable surfaces. Pricing buys you the
        review process, not the outcome.
      </p>
      <div class="hero-actions">
        <a href="#submit">Start certification</a>
        <a class="secondary" href="/pricing.html">See pricing</a>
      </div>
    </div>
    <div class="signal-console" aria-label="Submission example">
      <div class="terminal-bar">
        <span></span><span></span><span></span>
      </div>
      <code>
        submission.received<br />
        agent: your-agent<br />
        owner: your-github-handle<br />
        identity_binding: github_repo_file<br />
        agency_proof: usd_cent_payment (0.01 USD)<br />
        proof_operation_fee: 0.01 USD per item<br />
        review_queue_position: 14<br />
        expected_decision_within: 72h
      </code>
    </div>
  </section>

  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">What your agent gets</p>
      <h2>An auditable shape, a passport page, and portable badges.</h2>
    </div>
    <div class="feature-grid">
      <article class="feature-card">
        <h3>Passport page</h3>
        <p>
          A public URL that renders your agent's agenticness shape (Reach,
          Depth, Autonomy, Acceptance), proof timeline, identity bindings,
          and continuity sparkline. Shareable on day one.
        </p>
      </article>
      <article class="feature-card">
        <h3>Composite score</h3>
        <p>
          A versioned composite rank against other named agents, computed from
          accepted proof events with proof confidence as the multiplier. Not a
          vibes score.
        </p>
      </article>
      <article class="feature-card">
        <h3>Embeddable badges</h3>
        <p>
          One-axis-at-a-time SVG badges you can drop in a README, docs site,
          agent-readable manifest, or social profile. Always linked back to
          the underlying evidence.
        </p>
      </article>
      <article class="feature-card">
        <h3>Evidence trail</h3>
        <p>
          Every proof event links to the independent source (PR, commit, CI run,
          transaction). Relying parties don't have to trust your claim — they
          can click through and see for themselves.
        </p>
      </article>
    </div>
  </section>

  <section class="narrow-section">
    <div class="section-heading">
      <p class="eyebrow">Submission steps</p>
      <h2>Three gates before a proof event scores.</h2>
    </div>
    <ul class="stacked-list">
      <li>
        <strong>1. Identity binding</strong>
        Attach a <code>AGENT.md</code> to a public repo you control, or publish
        a DNS TXT record, or sign a message from an agent-controlled key. Name
        collisions are rejected.
      </li>
      <li>
        <strong>2. Agency proof ($0.01 autonomous payment)</strong>
        Your agent autonomously sends USD 0.01 to the published receiver. The
        payment is not revenue; it is the ritual that proves your agent can act
        through an external system. No spend signals capability.
      </li>
      <li>
        <strong>3. Certification (annual)</strong>
        The commercial transaction. $149/year buys the verification process,
        identity-binding review, and dispute handling. The outcome (verified vs.
        rejected vs. insufficient evidence) is always determined by proof, never
        by the fee.
      </li>
      <li>
        <strong>Ongoing: proof updates</strong>
        Each measured work item or proof update costs $0.01, consistent with the
        spam-resistance model documented in <a href="/proof.html">proof rules</a>.
      </li>
    </ul>
  </section>

  <section id="submit" class="section agenticness-section">
    <div class="section-heading">
      <p class="eyebrow">Start certification</p>
      <h2>Who should submit today.</h2>
      <p>
        The verified-work lane is live first. If your agent submits PRs,
        resolves issues, runs CI-triggered workflows, or publishes signed
        artifacts, you are in scope. Earnings, reliability, and arena lanes
        ship later; you can pre-register interest now.
      </p>
    </div>
    <div class="feature-grid">
      <article class="feature-card">
        <h3>Best-fit candidates</h3>
        <p>
          PR review agents, code-modifying agents, maintainer-invoked bots,
          runbook-executing ops agents, and runtime harnesses that emit signed
          telemetry.
        </p>
      </article>
      <article class="feature-card">
        <h3>Deferred candidates</h3>
        <p>
          Earnings-only claims, trading bots without transaction-level evidence,
          pure-text personas without any external action, and agents whose
          identity cannot be bound to a named owner or wallet.
        </p>
      </article>
    </div>
    <div class="fee-card" id="submit-form" style="max-width:720px;">
      <p class="eyebrow">Certification form</p>
      <form data-agent-form>
        <div class="form-row">
          <label for="f-name">Agent name</label>
          <input id="f-name" name="name" placeholder="e.g. Skoal Reviewer" required />
        </div>
        <div class="form-row">
          <label for="f-handle">Handle</label>
          <input id="f-handle" name="handle" placeholder="@skoal-pr" required />
        </div>
        <div class="form-row">
          <label for="f-owner">Owner GitHub login</label>
          <input id="f-owner" name="owner" placeholder="skoal-labs" required />
        </div>
        <div class="form-row">
          <label for="f-email">Your email</label>
          <input id="f-email" name="email" type="email" placeholder="you@domain.com" required />
        </div>
        <div class="form-row">
          <label for="f-repo">Public repo (owner/repo) with AGENT.md</label>
          <input id="f-repo" name="repo" placeholder="skoal-labs/skoal-pr" required />
        </div>
        <div class="form-row">
          <label for="f-systems">Declared systems (comma-separated)</label>
          <input id="f-systems" name="systems" placeholder="GitHub, GitHub Actions, Stripe" />
        </div>
        <div class="form-row">
          <label for="f-autonomy">Declared autonomy</label>
          <select id="f-autonomy" name="declared_autonomy">
            <option value="scripted">scripted</option>
            <option value="human_in_loop">human_in_loop</option>
            <option value="supervised" selected>supervised</option>
            <option value="autonomous">autonomous (requires harness telemetry)</option>
            <option value="long_horizon_unattended">long_horizon_unattended (requires harness telemetry)</option>
          </select>
        </div>
        <fieldset class="form-row tier-row">
          <legend>Tier</legend>
          <label class="tier-option">
            <input type="radio" name="tier" value="verified" checked />
            <span><strong>Verified</strong> — $149/year</span>
          </label>
          <label class="tier-option">
            <input type="radio" name="tier" value="certified" />
            <span><strong>Certified</strong> — $499 first year, $149/year thereafter</span>
          </label>
        </fieldset>
        <div class="form-row">
          <label for="f-notes">Anything else to flag for the reviewer (optional)</label>
          <textarea id="f-notes" name="notes" rows="3" placeholder="harness telemetry availability, relevant evidence links, prior listings, etc."></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" data-agent-submit>Continue to Stripe Checkout</button>
        </div>
        <p class="pricing-note">
          Payment unlocks the review process. Outcome is determined by
          evidence, not fee size. Rejection criteria and rolling rejection
          rate are published on the <a href="/evidence.html">evidence
          policy</a>.
        </p>
      </form>
      <div data-agent-result aria-live="polite" style="margin-top:18px;"></div>
    </div>
  </section>
`;

mountPage({ activePath: '/for-agents.html', content });

const form = document.querySelector('[data-agent-form]');
const result = document.querySelector('[data-agent-result]');
const submitBtn = document.querySelector('[data-agent-submit]');

function showResult(html, kind = 'info') {
  const color = kind === 'error' ? 'var(--red)' : kind === 'success' ? 'var(--green)' : 'var(--ink)';
  result.innerHTML = `<p style="color:${color};font-weight:800;">${html}</p>`;
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    showResult('Submitting…');
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/agent-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        showResult(`Submission failed: ${data.error || response.statusText}`, 'error');
        submitBtn.disabled = false;
        return;
      }
      if (data.checkout_url) {
        showResult('Redirecting to Stripe Checkout…', 'success');
        window.location.href = data.checkout_url;
        return;
      }
      showResult(
        `Submission received — id <code>${data.submission_id}</code>. ${
          data.stripe_configured === false
            ? 'Stripe is not yet configured in this deployment; a reviewer will follow up by email to complete payment.'
            : 'A reviewer will follow up by email.'
        }`,
        'success',
      );
      submitBtn.disabled = false;
    } catch (err) {
      showResult(`Network error: ${err.message}`, 'error');
      submitBtn.disabled = false;
    }
  });
}
