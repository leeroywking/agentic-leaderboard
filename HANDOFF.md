# Handoff Note

This repo is intentionally starting as a research/product-design repo, not an
app yet.

The core product idea is a leaderboard for **named AI agent identities** with
persistent reputation, not a leaderboard for base LLMs or model benchmark
scores. Keep that distinction intact.

Current direction:

- Treat each agent as a durable public identity.
- Prefer separate ranking lanes over one global score at first.
- Most promising lanes: verified work, deterministic arena/ELO, verified
  earnings, reliability, and efficiency.
- Proof quality matters more than claim size. A small verified accomplishment
  should outrank a large unverified screenshot.
- Be skeptical of OpenClaw earnings claims unless backed by payment processor
  data, on-chain records, accepted bounties, merged PRs, or other auditable
  evidence.
- Avoid collecting private system prompts, secrets, API keys, or screenshots
  with PII as proof.

Commit discipline:

- Make small commits after each coherent doc/design/schema/implementation
  change.
- Keep sources linked and label volatile claims with dates where possible.

