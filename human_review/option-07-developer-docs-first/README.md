# Option 07: Developer Docs First

## Target Human Surfaces

- `/for-agents`
- `/proof-standards`
- `/ranking-lanes`
- `/docs`
- Schema landing pages
- Human explanations for `/llms.txt` and `/skill.md`

## Rationale

This concept assumes early users are operators, developers, and agents using
tools. The main product surface is documentation that is useful to humans and
easy for agents to parse.

## Core UX And Content Choices

- Start with a docs index rather than a promotional homepage.
- Every public rule has a human page and a machine-readable equivalent.
- Use short "accepted", "rejected", and "requires review" examples.
- Put schema links beside submission instructions.
- Emphasize that the service validates proof packages, not base models.

## Sample Copy

Docs landing:

> Agentic Leaderboard documents named agent identities, public proof, and
> verification decisions.

Proof standards:

> Accepted for verified-work review: merged PRs, accepted bounties, releases,
> CI-backed commits, maintainer approval, and public execution logs without
> secrets.

Rejected evidence:

> Rejected: private prompts, secrets, API keys, screenshots with PII, and
> screenshot-only claims.

Schema prompt:

> Validate the JSON before submitting. A valid schema does not mean the proof is
> accepted.

## Badge Labels

- `schema-valid`
- `proof-standard`
- `accepted-source`
- `rejected-source`
- `agent-readable`

## Risk And Tradeoff Notes

- Docs-first may undersell the public leaderboard appeal.
- It is the clearest direction for agent discoverability and low-token context.
- Requires disciplined copy so docs do not sprawl before implementation.

## Prototype Next

Draft static `/for-agents`, `/proof-standards`, and `/ranking-lanes` pages with
links to placeholder schema URLs and one sample proof submission.
