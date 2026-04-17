# Handoff

This repo is intentionally starting as a research/product-design repo with a
small static prototype for reviewing product direction.

The core product idea is a leaderboard for **named AI agent identities** with
persistent reputation, not a leaderboard for base LLMs or model benchmark
scores. Keep that distinction intact.

## Current Direction

- Treat each agent as a durable public identity.
- Position the public product as a reputation layer for working autonomous
  agents: public profiles, portable badges, proof-linked rankings, and
  confidence labels.
- The homepage should follow an EC2-style infrastructure-product pattern:
  short product definition, why it matters, product capabilities, sample
  surface, use cases, and links to deeper details.
- Do not put implementation internals, database choices, workers, schemas,
  proof fees, or payment mechanics on the homepage. Those belong in docs or on
  `/proof.html`.
- Prefer separate ranking lanes over one global score at first.
- Most promising lanes: verified work, deterministic arena/ELO, verified
  earnings, reliability, and efficiency.
- Proof quality matters more than claim size. A small verified accomplishment
  should outrank a large unverified screenshot.
- Require minimum real-world agency proof before leaderboard eligibility. The
  current default is an autonomous payment of USD 0.01 or equivalent, used only
  to prove the agent can act through an external system.
- Charge USD 0.01 per proof update or measured work item as the platform's only
  intended financialization. This offsets infrastructure/review costs and does
  not buy rank. It should also discourage no-op PRs, dust transactions, and
  other wasteful proof spam.
- Be skeptical of OpenClaw-style earnings claims unless backed by payment
  processor data, on-chain records, accepted bounties, merged PRs, or other
  auditable evidence. Current notes in `README.md` treat these claims as public
  reports with uneven proof quality, not verified facts.
- Avoid collecting private system prompts, secrets, API keys, or screenshots
  with PII as proof.

## Current Repo State

- `README.md` contains the initial research notes, product implications, and
  suggested proof standards.
- `docs/AGENT_DISCOVERY_STRATEGY.md` outlines agent-facing discovery, GitHub
  outreach constraints, badge seeding, and rollout metrics.
- `docs/PLATFORM_DESIGN.md` is the current platform design baseline for future
  implementation agents.
- `docs/MEASUREMENT_MODEL.md` defines what the leaderboard should and should
  not measure, with source anchors for future implementation agents.
- `docs/HOMEPAGE_POSITIONING.md` explains why the homepage follows an
  EC2-style infrastructure-product structure and leads with trust, portable
  reputation, and proof-backed badges while keeping fee mechanics and
  implementation internals off the homepage.
- `docs/CANDIDATE_REPOS.md` contains a manually reviewable seed list for
  possible future repo outreach. It is not an approval to open issues.
- `human_review/` contains ten varied human-facing option packets for
  asynchronous review of leaderboard, badge, profile, proof, and outreach
  surfaces.
- The Vite prototype in `index.html`, `src/main.js`, and `src/styles.css`
  exercises the current human-facing direction with sample data, product
  capabilities, use cases, a sample leaderboard, proof framing, and an agent
  passport. It uses a local Node 22 runtime installed through npm; run `npm run
  node`, `npm run dev`, and `npm run build` for verification.
- Fee and submission mechanics live on `proof.html` and `src/proof.js`, not the
  homepage.
- The public GitHub repository is
  `https://github.com/leeroywking/agentic-leaderboard`.
- `AGENTS.md` contains repo-level collaboration and documentation instructions.
- No backend schema, data model, payment integration, auth layer, or production
  implementation exists yet.
- Last verified state: worktree clean, local dev server stopped, `npm run
  build` passing, `main` pushed to `origin/main` at commit `0eb0056`.

## Open Questions

- Which first lane should be specified: verified work, deterministic arena/ELO,
  or verified earnings?
- What minimum proof schema is needed before accepting named-agent submissions?
- How should agent identity be represented: owner handle, public key, wallet,
  signed manifest, or some combination?
- What evidence should be rejected outright because it creates privacy,
  attribution, or fraud risk?
- What should the first non-mock dataset look like for the sample leaderboard?
- Which product capability should be built first: registry, passport, badge, or
  verified-work lane?

## Suggested Next Steps

1. Review the current homepage against `docs/HOMEPAGE_POSITIONING.md` before
   adding new sections. Keep it product-led.
2. Draft the first production-grade proof schema for the verified-work lane.
3. Draft the agent registry/passport data model behind the product surface.
4. Decide whether the next prototype should implement registry, passport,
   badge, or verified-work submission first.
5. Review `docs/CANDIDATE_REPOS.md` and approve or reject any first-contact
   candidates before outreach.
6. Add source dates or access dates to volatile ecosystem claims in `README.md`.

## Commit Discipline

- Make small commits after each coherent doc/design/schema/implementation
  change.
- Keep sources linked and label volatile claims with dates where possible.
