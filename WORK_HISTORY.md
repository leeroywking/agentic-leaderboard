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

## 2026-04-16 — Relying-party first, subject second for outreach

**Decision.** First outreach batch targets relying parties (paying side) rather
than subjects (listed side). Drafts in `docs/RELYING_PARTY_OUTREACH.md`.
Tier 1 targets: CodeRabbit, Graphite, Greptile (AI code review),
AI Agents Directory + Glama (registries), Credo AI (adjacent governance).
Subject-side outreach (the existing `docs/CANDIDATE_REPOS.md` list) moves to
Tier 3, pursued only once at least one relying-party pilot has signed.

**Why.** Subject-side listings don't generate revenue until relying parties
are paying. The subject-side work is also easier — a free Listed tier
listing flows without much friction once the subject infra is built — so
it's not the rate-limiter. Relying parties are. Also: one signed
relying-party pilot is disproportionately credible. It makes the product a
thing someone pays for, which is the load-bearing credibility step per the
"monetization is the credibility signal" decision above.

**Defensible if challenged.**
- "Subjects are the supply side and you need supply first." → The current
  sample dataset has 10 named agents with realistic shapes. That's enough
  to demo the product to a relying party. Real subject supply grows
  naturally once the product is live and the first relying party is
  driving traffic to passport pages.
- "Cold outreach to CodeRabbit/Graphite is low-hit-rate." → Agreed. The
  doc caps at 10 cold emails per week across tiers, tracks follow-up
  cadence, and suppresses after 14 days. The goal is one conversation,
  not one hundred. The shortlist is specifically tuned to platforms with
  visible agent-PR pain so the outreach has a real hook.
- "Why not sell into enterprise (D&B-style) right away?" → Enterprise
  procurement is 3-9 months. Our first revenue should come from platforms
  that can commit in one meeting. Enterprise follows the pilot logos.

---

## 2026-04-16 — Prerender at build time

**Decision.** `npm run build` now runs `vite build` followed by a
`scripts/prerender.mjs` step that uses Vite's SSR module loader and a
jsdom-backed document to render each page's `#app` content in Node and
inject it into the built HTML file.

**Why.** The prototype's pages were rendering entirely client-side, which
means crawlers (Google, Bing, ChatGPT's browsing, Claude's WebSearch, and
most LLM retrieval) would see only the empty shell `<div id="app"></div>`
and miss the actual product pitch, pricing, and evidence. For a service
whose whole premise is "be publicly inspectable," serving empty HTML to
inspectors is a contradiction.

**Alternatives considered.**
- *Full rewrite to Astro or Next.js SSG:* correct long-term, but a 1-2 day
  detour right now. Deferred.
- *vite-plugin-ssr / vike:* introduces a plugin dependency and a routing
  convention our app doesn't need.
- *Puppeteer-based prerender:* heavier dependency (Chromium binary). Jsdom
  with Vite SSR is enough because our pages are synchronous.

**Tradeoff.** Browsers still run the bundled JS on load and overwrite
`#app` with identical content. That means a split-second of re-rendering
on page load. For a static prototype this is fine; for a production app
with state, a proper hydration pattern would be needed (skip render when
DOM is already populated). That can be added incrementally when the
pages have real state beyond rendered content.

---

## 2026-04-16 — End-to-end backend: Stripe Checkout, Upstash, Resend, admin

**Decision.** Ship a minimum viable backend that takes real customers end
to end: agent submission form → Stripe Checkout → webhook-driven status
transition → admin review → email outcomes. Relying-party sandbox keys
issue instantly (free tier). Relying-party pilot tier runs through
Stripe Checkout with $299/mo subscription. Every endpoint degrades
gracefully when providers aren't configured.

Stack:
- Vercel serverless functions at `api/*.mjs` (ESM Node handlers).
- Upstash Redis via `@upstash/redis` for persistence, with in-memory Map
  fallback so the handlers never crash on missing config.
- Stripe Checkout Sessions, with webhook signature verification.
- Resend for transactional email, with console-log fallback.
- Admin surface at `/admin.html` gated by `ADMIN_TOKEN`.

**Why Upstash over Vercel KV.** Vercel KV was deprecated in 2026-Q1 in
favor of Upstash Redis via the Vercel Marketplace. Same underlying
provider, supported path.

**Why graceful degradation per provider.** The prototype needs to be
deployable with any subset of env vars. A developer cloning the repo
should be able to `npm run build && npm run smoke:api` without setting
up Stripe, Resend, and Upstash accounts first. Real deployments
incrementally add env vars; each added var enables the next surface.

**Known gaps to close before the first paying customer.**
1. Admin approval of a subject submission does not yet auto-generate a
   passport HTML page. The static `src/shared/agents.js` is the source
   for all passport pages, so adding a new agent requires editing that
   file and redeploying. This is acceptable for the first 1–5 customers
   and forces the reviewer to actually read the submission, but it
   must be automated before scaling. Plan: extend
   `api/v1/agents/[slug].mjs` to check Upstash for approved-but-not-yet-
   published submissions and serve a generated passport response, then
   add a client-side passport renderer that handles both static and
   dynamic slugs.
2. Stripe subscription renewal logic is not implemented. For the
   Verified tier ($149/yr), the Stripe subscription auto-renews;
   webhook handler does nothing special on renewal (no status change
   needed). For Certified ($499 first year, $149/yr after), the
   second-year billing has to be manual via Stripe invoice until a
   proper renewal flow ships. Tolerable for the first cohort.
3. `/api/v1/agents/skoal-reviewer.json` (static file in `public/api/`)
   is still served unauthenticated as the public demo endpoint used by
   the `/for-relying-parties` lookup widget. The authenticated
   `/api/v1/agents/skoal-reviewer` (no `.json`) is the real API. Both
   coexist — the static is intentional for the demo. Document the
   distinction prominently before pilots onboard to avoid confusion.

**Defensible if challenged.**
- "Should have used Supabase/Postgres instead of Redis." Redis is
  enough for submissions + API keys + usage counters at the first-100-
  customer scale. Relational schema becomes useful when we need joins
  (submissions × proof events × badges) — not before.
- "Should have used Clerk/Auth0 for admin auth." A single `ADMIN_TOKEN`
  env var is enough for a one-person review pass. Adding an auth
  provider for zero scale is premature.
- "Forms should POST to Formspree instead of building a backend."
  Formspree routes to email; we need real data capture (composite
  scoring, rate limiting, API key issuance) that email cannot provide.
  The backend is what makes the product a product.

---

## 2026-04-16 — Ship a client-side "try it" before the real connector

**Decision.** Build `/try.html` as a client-side-only demo that takes a
`owner/repo` input, fetches `AGENT.md` from raw.githubusercontent.com,
queries the unauthenticated GitHub API for PR merge/close counts and
commit activity, computes the four axes, and renders a live preview
passport. No backend. No auth. Rate-limited to GitHub's 60 req/hour/IP.

Also publish `docs/AGENT_MANIFEST_SCHEMA.md` (draft v0) as the manifest
format the demo parses, and add a `AGENT.md` at the repo root so the
demo has a self-referential example.

**Why this instead of a full GitHub connector.** A full connector needs
a backend (webhook-driven, OAuth-authenticated, persistent storage) and
is weeks of work. A client-side demo turns the pitch from "static page
about reputation" into "drop your repo URL in and see a real shape in
10 seconds." That is the thing that closes a pilot conversation.
Accuracy is lower (rate-limited, no signed telemetry, no long-term
continuity), but the demo is explicit about that and the honest-absence
display ("insufficient evidence" / capped autonomy) is on-brand.

**Alternatives considered.**
- *Full Vercel-serverless connector*: 2-3 days of work, requires API key
  management, doesn't demo any faster. Deferred.
- *Pre-computed sample agents only*: already shipped (10 of them). The
  remaining gap was "does this work on a repo I care about?" — the demo
  closes that.
- *Read-only MCP server*: roadmap item, not pilot-critical.

**Defensible if challenged.**
- "Rate-limited, so the demo dies under load." → Yes. The demo page is
  explicit about the rate limit. A successful outreach that triggers
  traffic beyond the limit is a good problem to have and flips the
  decision on building the real backend.
- "AGENT.md format is draft v0 — fragile if we change it later." → The
  draft label is visible in the docs and on the demo. We version the
  schema and publish migration notices. Open Badges did the same going
  from 2.0 to 3.0.
- "A demo that returns low numbers is bad marketing." → Correct only if
  we hide that the numbers are low because confidence is capped. The
  demo shows the cap ("no harness telemetry yet"), which is the same
  story the pricing page tells. Consistency with the pitch wins here.

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
