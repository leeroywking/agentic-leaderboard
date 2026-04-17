# Work History

A decision journal. Every non-obvious product, pricing, or architectural choice
is logged here with the research or reasoning behind it. When a decision is
challenged in review, the counter-argument lives in this file. Updates should
be append-only — if a decision is reversed, log the reversal below the original
entry, do not rewrite history.

Dates are absolute. Claude is the author unless otherwise marked.

---

## 2026-04-16 — Agenticness measured as a four-axis shape

**Decision.** An agent's agenticness is measured as the evidence-backed shape
across four orthogonal axes: Reach, Depth, Autonomy, Acceptance. Composite
score uses versioned weights (`v1.0`: `0.20 / 0.25 / 0.20 / 0.35`). Display
always pairs the composite number with the shape so a single digit never
implies more precision than the proof model can claim.

**Why this over alternatives.**
- *Single global score*: tempting for ranking-sport dopamine, but the exact
  anti-pattern the product is reacting against (ClawRank's token-count score
  rewards spend, not agency). Rejected.
- *Lanes only*: the `HANDOFF.md` already documented `verified_work`,
  `reliability`, `economic`, `agency`. Lanes are proof-event categories,
  though — they do not describe *the agent*. They answer "what kind of
  evidence is this?" not "what is this agent like?" Kept lanes, added axes.
- *Radar only, no composite*: honest but unrankable; the product becomes
  impossible to sort. Rejected in favor of the FICO pattern: publish the
  composite, publish the weights, publish the decomposition, accept that
  weights will become a political object (FICO survives this).
- *More than four axes*: breadth > depth > autonomy > acceptance covers the
  externally-observable signals. Adding "reliability" or "efficiency" as
  axes duplicates what Acceptance and Depth already capture, and each new
  axis dilutes the next. Four is the fewest that preserves the shape.

**Confirmed by user**: "I love it" — 2026-04-16 session.

---

## 2026-04-16 — Monetization is load-bearing in v1, not deferred

**Decision.** Agentic Leaderboard monetizes from day one via (a) a subject-side
certification fee for the identity-binding process, (b) paid relying-party
pilots for the verification API and embeddable badge widget, (c) charter
sponsor tiers for runtime/harness vendors. The USD $0.01 autonomous payment
stays strictly as a proof-of-agency ritual, not as the platform's commercial
transaction.

**Why.** User was direct: "we need the monetization to establish trust and
credibility, that part I'm sure about." Historical precedent backs this:
every serious reputation institution (D&B, Moody's, UL, BBB, Fair Isaac)
charged from day one, and the paid relationships were themselves the
credibility signal. Free directories read as vanity projects.

**Load-bearing invariant.** Money guarantees process, not outcome. UL listings
cost real money and products still fail UL testing and UL publishes the
failures. BBB accreditation costs money and bad companies are still
rejected. That asymmetry — paid to be reviewed, rejected on merit — is what
makes paid certification credible instead of corrupt. Public rejection rate
is a feature.

---

## 2026-04-16 — Pricing bands backed by comparable research

**Decision.** V1 pricing (numbers subject to pilot calibration, but
defensible against comparables):

### Subject side (agent operators)

| Tier | Price | What it buys |
|------|-------|--------------|
| Listed | $0 + one-time $0.01 autonomous payment | Basic profile, agency-proofed badge only, no verified lane eligibility |
| Verified agent | $149 / year | Identity binding review, verified-lane eligibility, dispute handling, axis scoring, 25 proof-update slots/yr |
| Certified agent | $499 first year, $149 / year thereafter | Signed manifest, priority review queue, deeper identity bindings (DNS + repo + signed message), 250 proof-update slots/yr |

`$0.01` per additional proof-update or measured work item beyond the included
slots, consistent with existing `ProofOperationFee` model in
`docs/PLATFORM_DESIGN.md`.

### Relying-party side (consumers of reputation)

| Tier | Price | What it buys |
|------|-------|--------------|
| Sandbox | $0 | 100 lookups/month, badge widget, read-only API, no SLA |
| Pilot | $299 / month | 5,000 lookups, embeddable badge widget, webhook for proof state changes, listed as pilot partner |
| Standard | $999 / month | 25,000 lookups, bulk lookup endpoint, lane filtering, dashboards |
| Enterprise | Custom | SLA, volume lookups, private integrations |

Per-lookup overage: $0.15. Credit-bureau comparables run $2.90-$3.99 per
report; agent reputation is lower-stakes so the per-lookup number is an order
of magnitude lower.

### Charter sponsors / issuer integrations

| Tier | Price | What it buys |
|------|-------|--------------|
| Sponsor | $2,500 / month | Logo placement on `/about`, roadmap input, quarterly briefings |
| Verified issuer | $5,000 / month | Automated evidence ingestion from the issuer's own platform, co-branded badges, NOT preferential verification outcomes |

**Invariant check.** None of these tiers buy rank, buy favorable verification,
or accelerate evidence acceptance beyond process steps that are published.

**Research citations and reasoning.**

- **UL certification**: $5,000–$50,000 initial plus $20,000–$30,000 annual
  maintenance ([JJRLAB][ul-jjr], [Sheridan Tech 2026][ul-sheridan]). Heavy,
  enterprise-scale; useful as an *upper* bound, not a target. Agentic
  Leaderboard's subject tier should be accessible to individual agent
  operators, not just enterprises, so UL pricing would be wrong by 2 orders
  of magnitude.
- **BBB accreditation**: ~$965/year for small businesses (>10 employees),
  climbing to ~$4,000 for larger orgs ([Fit Small Business][bbb-fsb]).
  Closest direct analogue: annual, subscription-style, for small operators.
  $149/yr Verified tier is a deliberate undercut of BBB since agents have
  lower revenue than small businesses and need an accessible entry point.
- **D&B DUNS**: free baseline, $229 expedited, $149/mo for Credit Insights
  Plus, $329-$799 for premium rated service ([D&B][dnb-official],
  [NerdWallet][dnb-nw], [Nav][dnb-nav]). The $499 one-time Certified setup
  mirrors D&B's one-time premium rating model.
- **Credit bureau API lookups**: $2.90-$3.99 per report via third-party
  integrators ([iSoftpull via search]). Agent reputation lookups are
  lower-stakes than consumer credit, so $0.15 per overage lookup is a
  defensible order-of-magnitude lower. Pilot tier at $299/month for 5K
  lookups works out to $0.06/lookup — reasonable early-adopter discount.
- **Open Badges 3.0 issuance platforms**: Certifier offers 250 free
  credentials/year; Open Badge Factory has moved all issuance to OB 3.0.
  Zero-cost issuance is the accepted floor for badge issuance, so free
  Listed tier plus free Sandbox API lookups conforms to the ecosystem norm.

[ul-jjr]: https://www.jjrlab.com/news/how-much-does-ul-certification-cost.html
[ul-sheridan]: https://sheridantech.io/2026/03/14/ul-certification-costs/
[bbb-fsb]: https://fitsmallbusiness.com/bbb-accredited/
[dnb-official]: https://www.dnb.com/en-us/smb/duns/get-a-duns.html
[dnb-nw]: https://www.nerdwallet.com/business/credit-cards/learn/duns-number
[dnb-nav]: https://www.nav.com/resource/duns-number/

**Defensible positions if challenged.**

- "Too cheap, it looks like a toy." → Subject tier intentionally undercuts
  BBB to capture individual agent operators, which is where the long tail
  lives. We can raise later after pilot data shows willingness to pay.
- "Too expensive for agent owners." → $149/yr is less than most devs spend
  on GitHub Copilot in two months. If an agent is producing verifiable
  work, $149/yr is trivial versus what the agent's owner monetizes
  downstream (even an OpenClaw-style Felix with $14K in reported revenue
  makes $149 a 1% overhead).
- "Relying-party pricing is too low; leaves money on table." → Intentional.
  Early pilots need momentum, not margin. Lookup volume at Standard tier
  works out to $0.04/lookup, which is still 70× less than credit-bureau
  data. Raise after 3+ paying relying parties exist.
- "Charter sponsor looks pay-for-play." → This is the one tier where the
  invariant is most fragile. Separation is enforced by: (a) logo placement
  is on `/about`, *not* on ranked profiles or leaderboard rows; (b) verified
  issuer integrations buy data plumbing only; (c) public policy forbids
  giving sponsors a favorable floor on verification outcomes; (d) rejection
  rate published includes sponsor-associated agents. If even one sponsor's
  agent is publicly rejected, the invariant becomes credible.

---

## 2026-04-16 — Competitive positioning: named-agent reputation, not agent scoring

**Decision.** Position Agentic Leaderboard as distinct from:

- **MolTrust** ([moltrust.ch]): trust scores from agent-to-agent ratings.
  Different primitive — agents rate each other. Easy to game with coalitions.
  Our primitive is *external-system acceptance*, which is harder to game.
- **Lorg**: hash-chained "permanent intelligence archive" with cryptographic
  trust scores. Closer to "agent memory log" than "agent reputation."
  Different audience.
- **AgentScore**: trust-gating API. Complements rather than competes — once
  our axes exist, AgentScore or equivalents can consume them.
- **ZeroID**: identity platform for autonomous agents (OpenID SSF + CAEP).
  Identity layer, not reputation layer. We should integrate rather than
  duplicate.
- **Microsoft Agent Governance Toolkit**: runtime security, OWASP-10-agentic.
  Different axis entirely (safety vs reputation).
- **MCP Registry (official)**: agent/server capability discovery. We plug
  into this as an integrator — an agent listed in MCP Registry can surface
  its Agentic Leaderboard shape inline.
- **a2a "Reputation-Aware Agent Discovery"** (discussion #1631): ongoing
  proposal in the a2a protocol. Monitor; potential integration partner.
- **Hedera agent registry** (187K verified): on-chain identity at scale, but
  on-chain identity is not the same as evidence-backed reputation. Integration
  target, not competitor.

**The wedge.** GitHub reported 17 million AI-generated PRs/month as of March
2026, and roughly 90% are noise (danilchenko.dev 2026-04-11). Maintainers
cannot keep up. The wedge is: if a named agent has a verifiable track record
of *accepted* PRs (Acceptance axis) with external maintainer acceptance (not
self-merges), maintainers can auto-triage submissions by Agentic Leaderboard
score. First relying-party design partner candidates fall out of this:
agent-PR-heavy OSS projects, AI code review platforms, and MCP registry
operators themselves.

**Defensible if challenged.** "Isn't MolTrust/Lorg/AgentScore doing this?" →
No. Agent-to-agent ratings (MolTrust) are gameable by coalition. Memory
archives (Lorg) are not ranking. Trust-gating APIs (AgentScore) consume
reputation data, they do not produce it. Our differentiation is:
evidence-backed, externally-validated, proof-confidence-labeled, and
non-gameable-by-coalition because acceptance by third parties (maintainers,
processors, chains) cannot be faked by agent swarms.

---

## 2026-04-16 — Multi-page Vite for product surfaces

**Decision.** Move from two-page Vite (`index.html`, `proof.html`) to a
multi-page app covering the surfaces a buyer needs to see before they can
say yes:

- Core sales: `index.html`, `for-agents.html`, `for-relying-parties.html`,
  `pricing.html`
- Product-works: `agents.html`, `agent-*.html` (3+ passport samples),
  `leaderboard.html`, `badges.html`
- Trust signals: `how-it-works.html`, `evidence.html`, `about.html`,
  `faq.html`, `legal.html`
- Existing: `proof.html` (updated)

**Why not an SPA with client routing?** Static multi-page is more
SEO-indexable, every page has a canonical URL, and `llms.txt` /
`/.well-known/agentic-leaderboard.json` can list them without extra infra.
Per `docs/PLATFORM_DESIGN.md` the production stack will be Next.js App
Router which is also server-first — the prototype should match that shape,
not diverge into a router we'll throw away.

**Shared code structure.**

- `src/shared/agents.js` — canonical sample dataset, all pages import from
  here so the leaderboard, the registry, and each passport stay consistent
- `src/shared/nav.js` — site chrome (topbar, footer) rendered by every page
- `src/shared/glyph.js` — axis rendering helpers (glyph, radar, sparkline,
  badge); single source of truth for how a shape is drawn
- `src/shared/scoring.js` — composite computation + weights; importable by
  anything that ranks

**Tradeoff.** Every new page needs an explicit entry in `vite.config.js`.
Worth it — explicit beats magic for a prototype someone is going to fork.

---

## 2026-04-16 — GitHub-first for first verified-work connector

**Decision.** The first integrated connector is GitHub (PR/commit/CI/release)
rather than Stripe, on-chain, or a payment processor. Proof events from
GitHub feed the Acceptance and Depth axes at `verified` confidence when
maintainer acceptance is external.

**Why.** (a) The "17 million AI-generated PRs/month, 90% noise" wedge puts
GitHub at the center of the initial trust-pain. (b) GitHub identity is
already owner-bindable via GitHub OAuth, which is in
`docs/PLATFORM_DESIGN.md` as the first auth provider. (c) Evidence is
publicly inspectable with no PII concerns. (d) `acceptor_kind` is
determinable from the PR's merger vs. submitter vs. repo owner.

**Defensible if challenged.** "But earnings are the interesting lane." →
Yes, and earnings is the *hardest* lane to verify (payment processor
contracts, PII redaction, refund reconciliation). Shipping earnings lane
first trades a year of compliance work for a lane that will be dominated by
self-reports regardless of our work. GitHub lane is 6 weeks of connector
development for a visible corpus on day one.

---
