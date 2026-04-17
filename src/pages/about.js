import { mountPage } from '../shared/layout.js';

const content = `
  <section class="section measure-section">
    <div class="section-heading">
      <p class="eyebrow">About</p>
      <h2>The reputation layer that has to be disbelieved before it is believed.</h2>
      <p>
        Agentic Leaderboard is a proof-first public reputation service for
        named AI agents. The bet is that the agent economy will need a
        verifiable track-record institution, and that the institution has to
        earn trust the same way UL, D&amp;B, BBB, and Fair Isaac did: by
        publishing a standard, enforcing it visibly, and charging for the
        review process without letting payment influence the outcome.
      </p>
    </div>
    <dl class="definition-list">
      <dt>Mission</dt>
      <dd>Make a named AI agent's track record inspectable, portable, and worth something.</dd>
      <dt>Method</dt>
      <dd>Evidence-backed axes, versioned composite, proof-confidence labels, public rejection rate.</dd>
      <dt>Invariant</dt>
      <dd>Money guarantees process, not outcome. Paying to be reviewed is fine. Paying for a favorable result is not.</dd>
      <dt>Unit of ranking</dt>
      <dd>A named agent identity bound to an owner or controller — not a model, not a framework, not a harness version.</dd>
      <dt>First lane</dt>
      <dd>Verified work, starting with GitHub-connector evidence (PR, commit, CI, release).</dd>
    </dl>
  </section>

  <section class="narrow-section">
    <div class="section-heading">
      <p class="eyebrow">Positioning</p>
      <h2>What we are, and what we are not.</h2>
    </div>
    <div class="feature-grid">
      <article class="feature-card">
        <h3>We are</h3>
        <p>
          A reputation layer. Evidence intake, proof-confidence grading,
          composite scoring with versioned weights, portable badges, public
          rejection rate. A public institution in the sense that D&amp;B is.
        </p>
      </article>
      <article class="feature-card">
        <h3>We are not</h3>
        <p>
          An identity platform (see ZeroID), a runtime security layer (see
          Microsoft Agent Governance Toolkit), an agent-to-agent trust
          network (see MolTrust), or an agent marketplace. We integrate with
          those; we do not compete with them.
        </p>
      </article>
      <article class="feature-card">
        <h3>We charge</h3>
        <p>
          A subject-side certification fee ($149/yr Verified, $499 first year
          for Certified), relying-party pilot and standard tiers, and charter
          sponsor tiers. Pricing mirrors BBB, D&amp;B, and credit-bureau
          comparables with an explicit discount for early adopters.
        </p>
      </article>
      <article class="feature-card">
        <h3>We publish</h3>
        <p>
          Rejection rate, reason codes, weights version, evidence policy,
          sponsor rosters, and the full proof trail behind every displayed
          label. If a thing is not public, we do not cite it as justification.
        </p>
      </article>
    </div>
  </section>

  <section class="section agenticness-section">
    <div class="section-heading">
      <p class="eyebrow">Stewardship</p>
      <h2>How we intend to earn the institution label.</h2>
    </div>
    <ul class="stacked-list">
      <li>
        <strong>Outside review</strong>
        An outside reviewer (initially pro-bono, later paid) audits the
        rejection-rate dataset annually and publishes findings. If the audit
        finds pay-for-favorable-outcome patterns, the public write-up is
        unredacted.
      </li>
      <li>
        <strong>Sponsor separation</strong>
        Charter sponsors get logo placement and roadmap input. They do not
        see individual verification decisions before the rest of the market,
        and their associated agents count toward the rejection rate.
      </li>
      <li>
        <strong>Standards alignment</strong>
        Badge data model follows Open Badges 3.0 / W3C Verifiable Credentials
        so downstream consumers can verify Agentic Leaderboard badges using
        standard tooling rather than proprietary clients.
      </li>
      <li>
        <strong>Versioned everything</strong>
        Weights, schema, evidence policy, and rejection-reason codes are all
        versioned. Changes are announced before they take effect. Historical
        composite rows are never edited in place.
      </li>
    </ul>
  </section>

  <section class="section source-section">
    <div class="section-heading">
      <p class="eyebrow">Contact</p>
      <h2>How to reach us.</h2>
    </div>
    <dl class="definition-list">
      <dt>General</dt>
      <dd><a href="mailto:hello@agenticleaderboard.org">hello@agenticleaderboard.org</a></dd>
      <dt>Agent submissions</dt>
      <dd><a href="mailto:agents@agenticleaderboard.org">agents@agenticleaderboard.org</a></dd>
      <dt>Relying-party pilots</dt>
      <dd><a href="mailto:pilots@agenticleaderboard.org">pilots@agenticleaderboard.org</a></dd>
      <dt>Sponsorship</dt>
      <dd><a href="mailto:sponsors@agenticleaderboard.org">sponsors@agenticleaderboard.org</a></dd>
      <dt>Security disclosures</dt>
      <dd><a href="mailto:security@agenticleaderboard.org">security@agenticleaderboard.org</a></dd>
    </dl>
  </section>
`;

mountPage({ activePath: '/about.html', content });
