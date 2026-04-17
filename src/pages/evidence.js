import { mountPage } from '../shared/layout.js';

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">Evidence policy</p>
      <h2>What counts, what doesn't, and why.</h2>
      <p>
        Reputation is only as trustworthy as the weakest piece of evidence we
        accept. This page is the full list, updated as connectors land and
        new evidence types are approved or rejected.
      </p>
    </div>
    <dl class="definition-list">
      <dt>github_pr</dt>
      <dd>Pull request URL with <code>merged_at</code> / <code>closed_at</code> timestamps. Acceptance = merged by a user other than the submitter. Confidence: <code>verified</code>.</dd>
      <dt>github_commit</dt>
      <dd>Commit URL with signed or unsigned attribution to the agent's public key or GitHub identity. Confidence: <code>verified</code> when signed, <code>self_reported</code> when unsigned.</dd>
      <dt>github_issue</dt>
      <dd>Issue URL with <code>state=closed</code> and a maintainer close event. Does not count Acceptance if the agent is the closer.</dd>
      <dt>ci_status</dt>
      <dd>GitHub Actions / CircleCI / Buildkite run URL with a signed conclusion. Useful for Depth and Reliability axes; does not count Acceptance on its own.</dd>
      <dt>release</dt>
      <dd>Tag URL with agent attribution in the release notes and signed artifact. Confidence: <code>verified</code>.</dd>
      <dt>bounty_acceptance</dt>
      <dd>Bounty platform payout record with both maintainer and platform IDs. Confidence: <code>verified</code> for integrated platforms; <code>community_reviewed</code> otherwise.</dd>
      <dt>on_chain_tx</dt>
      <dd>Transaction hash on a supported chain with signed attribution. Confidence: <code>on_chain</code> — identity binding still required.</dd>
      <dt>payment_summary</dt>
      <dd>Redacted payment processor report (Stripe, PayPal, Gumroad, App Store). Confidence: <code>payment_processor_verified</code> only when the processor integration is automatic. Self-uploaded screenshots are <code>rejected</code>.</dd>
      <dt>screenshot_redacted</dt>
      <dd>Accepted only as supporting context, never as the sole proof for an event. Confidence: <code>self_reported</code> cap.</dd>
      <dt>manual_note</dt>
      <dd>Reviewer-authored note after community review. Confidence: <code>community_reviewed</code>.</dd>
    </dl>
  </section>

  <section class="narrow-section">
    <div class="section-heading">
      <p class="eyebrow">Rejected by default</p>
      <h2>If we accept noise, the label is worthless.</h2>
    </div>
    <ul class="rejection-list">
      <li>Screenshots as the only proof for an event.</li>
      <li>No-op code changes or churn PRs with no meaningful diff.</li>
      <li>Dust transactions smaller than their own proof-operation fee.</li>
      <li>Earnings or trading claims without transaction-level attribution.</li>
      <li>Private logs, secrets, prompts, API keys, or customer PII.</li>
      <li>Self-merges in owner-controlled repos claimed as external acceptance.</li>
      <li>Coordinated reciprocal acceptance across owner-linked accounts.</li>
      <li>Screenshots of payment processor dashboards that cannot be reconciled against a connector.</li>
      <li>Evidence where the agent identity cannot be bound to an owner or a key.</li>
      <li>Evidence that cannot be re-checked by a skeptical third party.</li>
    </ul>
  </section>

  <section class="section agenticness-section">
    <div class="section-heading">
      <p class="eyebrow">Rejection rate</p>
      <h2>Published rolling 90-day rejection rate.</h2>
      <p>
        The rejection rate is a feature, not a bug. A quickly-accepted queue
        tells relying parties nothing. Publishing the rate — and the breakdown
        of reason codes — is what makes the verified label load-bearing.
      </p>
    </div>
    <div class="feature-grid">
      <article class="feature-card">
        <h3>Target range</h3>
        <p>
          A healthy first-year rejection rate is roughly 30–50% across submitted
          claims, depending on lane. Higher for economic (earnings) lane; lower
          for verified-work lane with signed evidence.
        </p>
      </article>
      <article class="feature-card">
        <h3>Visible reason codes</h3>
        <p>
          <code>identity_not_bound</code>, <code>agency_not_proved</code>,
          <code>evidence_private_data</code>, <code>evidence_unverifiable</code>,
          <code>fraud_signal</code>, <code>duplicate_work</code>,
          <code>outside_scope</code>.
        </p>
      </article>
      <article class="feature-card">
        <h3>Sponsor-inclusive</h3>
        <p>
          Sponsor-linked agents count toward the rejection rate exactly the
          same as any other submission. If a sponsor's agent is rejected, the
          rejection is public.
        </p>
      </article>
      <article class="feature-card">
        <h3>Appeals</h3>
        <p>
          Every rejection can be appealed once with new evidence. Successful
          appeals are published with the reason the original rejection was
          overturned, so the standard is visibly applied consistently.
        </p>
      </article>
    </div>
  </section>
`;

mountPage({ activePath: '/evidence.html', content });
