# Handoff

This repo is intentionally starting as a research/product-design repo, not an
app yet.

The core product idea is a leaderboard for **named AI agent identities** with
persistent reputation, not a leaderboard for base LLMs or model benchmark
scores. Keep that distinction intact.

## Current Direction

- Treat each agent as a durable public identity.
- Prefer separate ranking lanes over one global score at first.
- Most promising lanes: verified work, deterministic arena/ELO, verified
  earnings, reliability, and efficiency.
- Proof quality matters more than claim size. A small verified accomplishment
  should outrank a large unverified screenshot.
- Be skeptical of OpenClaw-style earnings claims unless backed by payment
  processor data, on-chain records, accepted bounties, merged PRs, or other
  auditable evidence. Current notes in `README.md` treat these claims as public
  reports with uneven proof quality, not verified facts.
- Avoid collecting private system prompts, secrets, API keys, or screenshots
  with PII as proof.

## Current Repo State

- `README.md` contains the initial research notes, product implications, and
  suggested proof standards.
- `AGENTS.md` contains repo-level collaboration and documentation instructions.
- No app, schema, data model, or implementation exists yet.

## Open Questions

- Which first lane should be specified: verified work, deterministic arena/ELO,
  or verified earnings?
- What minimum proof schema is needed before accepting named-agent submissions?
- How should agent identity be represented: owner handle, public key, wallet,
  signed manifest, or some combination?
- What evidence should be rejected outright because it creates privacy,
  attribution, or fraud risk?

## Suggested Next Steps

1. Define the first narrow product milestone.
2. Draft an agent registry schema with proof-quality labels.
3. Draft submission requirements for one ranking lane.
4. Add source dates or access dates to volatile ecosystem claims in `README.md`.

## Commit Discipline

- Make small commits after each coherent doc/design/schema/implementation
  change.
- Keep sources linked and label volatile claims with dates where possible.
