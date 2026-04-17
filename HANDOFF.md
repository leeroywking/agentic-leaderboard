# Handoff

This repo is a research and product-design repo with a multi-page static
prototype that covers the surfaces a buyer needs to see before they can say
yes. The core product idea is a leaderboard for **named AI agent identities**
with persistent reputation, not a leaderboard for base LLMs or model benchmark
scores.

## Current Direction

- Treat each agent as a durable public identity.
- Measure agenticness as a *shape* across four evidence-backed axes — Reach,
  Depth, Autonomy, Acceptance — defined in `docs/MEASUREMENT_MODEL.md`.
  Composite score uses versioned weights (`v1.0`: `0.20 / 0.25 / 0.20 / 0.35`)
  and is always displayed alongside the shape.
- Lanes (`agency`, `verified_work`, `reliability`, `economic`, and later
  `arena`) are proof-event intake categories, not the same thing as
  agenticness axes. Lanes feed axes.
- Use W3C Verifiable Credentials role vocabulary: the agent is the **subject**,
  whoever produces evidence is the **issuer**, whoever consumes the reputation
  to make a decision is the **relying party**, Agentic Leaderboard is the
  **platform**.
- Monetize from day one. Load-bearing invariant: **money guarantees process,
  not outcome.** UL / BBB / D&B / credit-bureau precedent. Rejection rate is
  public and includes sponsor-associated agents.
- V1 pricing (calibrated against comparables — see `WORK_HISTORY.md`):
  - **Subject:** free Listed, $149/yr Verified, $499 first-year Certified.
  - **Relying party:** free Sandbox (100 lookups/mo), $299/mo Pilot (5K),
    $999/mo Standard (25K), custom Enterprise.
  - **Charter sponsors:** $2,500/mo Sponsor, $5,000/mo Verified issuer.
- The USD $0.01 autonomous payment stays strictly as a proof-of-agency ritual,
  not as the commercial transaction. Per-proof-update $0.01 fees exist as a
  spam filter, not revenue.
- First verified-work connector is GitHub (PR / commit / CI / release). Wedge:
  17M AI-generated PRs/month on GitHub with ~90% reported noise rate (early
  2026). Maintainers and agent marketplaces can't keep up without a reputation
  signal.
- Do not put implementation internals, database choices, workers, schemas,
  proof fees, or payment mechanics on the homepage. Those belong in docs or on
  `/proof.html`, `/pricing.html`, and `/how-it-works.html`.
- Proof quality matters more than claim size. A small verified accomplishment
  should outrank a large unverified screenshot.
- Avoid collecting private system prompts, secrets, API keys, or screenshots
  with PII as proof.

## Current Repo State

### Documentation

- `README.md` — research notes on existing named-agent leaderboards, Felix /
  Kelly Claude / ClawFreelance earnings claims, proof standards, and a pointer
  to the axes in `docs/MEASUREMENT_MODEL.md`.
- `AGENTS.md` — repo-level collaboration and commit discipline.
- `WORK_HISTORY.md` — decision journal with research citations, defensible
  positions, and reversals. Every non-obvious pricing or product decision is
  logged here so it can be challenged and defended.
- `docs/MEASUREMENT_MODEL.md` — what the leaderboard measures, including the
  four axes, per-axis computation plans, v1 composite weights, and display
  guidance across leaderboard row, passport, and embeddable badge.
- `docs/PLATFORM_DESIGN.md` — current platform design baseline: data model,
  `System` registry, `AgentAxisScore`, `AgentCompositeScore`, stack decisions.
- `docs/HOMEPAGE_POSITIONING.md` — EC2-style positioning plus shape-display
  rules.
- `docs/AGENT_DISCOVERY_STRATEGY.md` — outreach constraints and badge seeding.
- `docs/CANDIDATE_REPOS.md` — manual review list for potential first-contact.

### Prototype

Multi-page Vite static site. Configured via `vite.config.js`. Every page
imports shared modules from `src/shared/`, so data and rendering stay
consistent.

Pages (all in repo root, paired with `src/pages/*.js` entries):

- `index.html` — homepage with hero, value pillars, agenticness section,
  sample leaderboard, featured passport, use cases, CTA.
- `agents.html` — registry of all sample agents with certification/lane filters.
- `leaderboard.html` — verified-work lane with sort by composite or any axis.
- `for-agents.html` — subject-side conversion page.
- `for-relying-parties.html` — relying-party conversion + pilot tiers.
- `pricing.html` — subject, relying-party, and charter sponsor pricing,
  plus comparable-research backup.
- `how-it-works.html` — submission pipeline with rejection-rate philosophy
  and evidence-degradation rules.
- `evidence.html` — accepted evidence types, rejected by default, rolling
  rejection-rate framing.
- `badges.html` — SVG badge catalog with HTML and Markdown embed snippets,
  usage policy.
- `proof.html` — updated: $0.01 as ritual, pricing as commercial.
- `faq.html` — 12-question FAQ covering identity, pricing, composite,
  rejection, earnings, integrations, and competitive positioning.
- `about.html` — mission, method, stewardship, contact.
- `legal.html` — plain-language terms summary + transparency commitments.
- `agent-*.html` — five sample passports with 4-axis radar, continuity
  sparkline, proof timeline, identity bindings, embeddable badge preview.

Shared modules in `src/shared/`:

- `agents.js` — canonical sample dataset (10 named agents).
- `scoring.js` — weights, weights version, axis order and metadata, composite
  computation, ranking helper.
- `render.js` — glyph, radar, sparkline, axis detail grid, agent row, pill
  badge renderers.
- `nav.js` — topbar + footer.
- `layout.js` — `mountPage({ activePath, content })` helper used by every
  page to attach chrome.

Public assets in `public/` (copied through Vite's static asset pipeline):

- `llms.txt` — curated agent-readable index of every public surface.
- `robots.txt` — allow normal search + AI crawlers; sitemap reference.
- `.well-known/agentic-leaderboard.json` — discovery manifest with axes,
  weights, tiers, and policies.

Build verified: `npm run build` produces 16 HTML pages plus `llms.txt`,
`robots.txt`, and `.well-known/`. Total gzipped CSS 4.7kB; per-page JS
between 0.14kB (passport-thin entries) and 12.2kB (agent registry).

### Known limitations of the prototype

- Pages render client-side via JS after load. Search and LLM crawlers will
  see only the HTML shell unless a pre-render step is added. The fix is
  either Vite SSG (e.g. `vite-plugin-ssr` / `@sveltejs/kit`-style prerender)
  or a build-time jsdom pass that captures the rendered DOM per page. This
  is a deploy-before-GA task, not a blocker for design-partner conversations.
- No backend, auth, submissions, payments, or API endpoints are implemented.
  Pricing pages reference mailto: links for early conversations rather than
  a checkout flow. This is consistent with "design-partner pilot" v1 motion.
- Submission connectors (GitHub PR/commit/CI, on-chain, payment processor)
  are described in `docs/PLATFORM_DESIGN.md` but not coded.
- Sample agent data is curated by hand. Nothing is fetched from live sources.

### Public repo

- `https://github.com/leeroywking/agentic-leaderboard`.

## Open Questions

- Which first paid design partner do we target? (Candidates in
  `WORK_HISTORY.md`: agent marketplaces, MCP registry operators, AI code
  review products, agent-PR-heavy OSS projects.)
- Is the Verified tier at $149/yr correctly calibrated, or should it be
  lower (to capture individual open-source agent operators) or higher (to
  signal institutional seriousness)?
- Should the composite weights be v1.0 at launch, or should Acceptance be
  weighted even higher (e.g. `0.15 / 0.2 / 0.15 / 0.5`) until other axes
  have better connector coverage?
- Does the rejection-rate philosophy belong on `/how-it-works.html` or on
  `/evidence.html`, or should it have its own page?
- Pre-render strategy — jsdom build hook vs. Vite SSG plugin vs. port the
  rendering to a SSR framework (Astro, 11ty, Next.js App Router)?

## Suggested Next Steps

1. Stand up the Verified-tier signup flow with one real payment provider
   (Stripe) against the certification fee model in `WORK_HISTORY.md`.
2. Ship the first relying-party pilot conversation using
   `/for-relying-parties.html` as the sales page. Three pilot slots are
   explicitly offered; log who we reach out to in `WORK_HISTORY.md`.
3. Build the GitHub-connector subset: read a repo's `AGENT.md`, verify
   identity binding, fetch PR / CI / commit evidence, map to proof events.
4. Add pre-rendering (jsdom-based static output) before any public launch.
5. Add the rolling 90-day rejection-rate dashboard referenced from
   `/evidence.html`.
6. Commission outside review of the rejection-rate dataset at 90 days.

## Commit Discipline

- Make small commits after each coherent doc/design/schema/implementation
  change.
- Log every non-obvious decision in `WORK_HISTORY.md` with the research or
  reasoning behind it. If a user challenges a decision on next review, defend
  with data from `WORK_HISTORY.md` or from the cited source.
- Keep sources linked and label volatile claims with dates where possible.
- Decisions are append-only in `WORK_HISTORY.md` — if a decision is reversed,
  add a reversal entry below the original, do not rewrite history.
