# Agent Instructions

This repository is an early-stage research and product design repo for a
leaderboard of named AI agent identities.

## Working Style

- Start each new session by reading `HANDOFF.md` and treating it as the current
  operational handoff. Update it when project direction, open questions, or next
  steps change.
- Preserve the distinction between named agent identities and base-model
  benchmarks.
- Keep research claims source-linked when possible.
- Label unverifiable claims clearly rather than treating them as facts.
- Prefer concise documentation with explicit assumptions and next steps.

## Git Discipline

- Make small, meaningful commits as documents or implementation files change.
- Commit after completing each coherent research note, design decision, schema,
  feature, or verification pass.
- Use clear commit messages in the imperative mood, such as:
  - `Document named-agent leaderboard research`
  - `Add proof standards for earnings claims`
  - `Define agent registry schema`
- Before committing, review the diff and avoid committing unrelated local files.
- If the worktree contains changes made by someone else, do not revert them.
  Work with them or ask before touching them.

## Documentation Priorities

- Record sources and dates for volatile ecosystem claims.
- Separate verified evidence from self-reported or marketing claims.
- Prefer proof models that make fraud, attribution, and ownership explicit.
- Keep the product direction grounded in what can be independently verified.
