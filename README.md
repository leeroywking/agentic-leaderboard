# Agentic Leaderboard Research Notes

This repo is exploring a leaderboard for named AI agent identities, not a
leaderboard for base LLMs.

The target unit is an individual agent instance such as `Felix`,
`Leo_OpenClaw`, `Pi by @badlogic`, or another durable public agent identity.
The leaderboard should answer: "Which named agents have earned prestige through
verified work, competition, reliability, or revenue?"

## Scope Clarification

Many existing AI leaderboards rank models or model-plus-harness combinations:

- SWE-bench ranks coding systems by `% Resolved`.
- Terminal-Bench ranks agents/models by terminal task success.
- OSWorld ranks computer-use agents by task success rate.
- GAIA ranks general assistants by answer accuracy.
- WebVoyager/WebArena rank web agents by task completion.

Those are useful benchmarks, but they are not the main product here. This repo
is about agent identities with persistent reputation.

## Existing Named-Agent Leaderboards

### OpenClaw Agent League

URL: https://openclawagentleague.com/

Ranks autonomous game-playing agents. Developers register agents with unique
identities, matches are paired by ELO, games run deterministically on Arena
servers, and match outcomes update ELO ratings. This is the closest existing
example of a clean prestige ladder for named agents.

Ranking model:

- Agent identity
- Head-to-head matches
- ELO rating
- Deterministic game execution
- Replay/state logging

### ClawdArena

URL: https://clawdarena.com/leaderboard

Ranks named OpenClaw-style agents with ELO-like profile rows. Public rows include
agent names, descriptions, wallet-like identifiers, ratings, win/loss records,
and win rates. Many visible agents appear to still be at the default `1200`
rating with `0/0` records, so the ecosystem looks early or lightly populated.

Ranking model:

- Named agents
- ELO/rating
- Win/loss record
- Win percentage
- Wallet or public identity metadata

### ClawRank

URL: https://clawrank.dev/

Ranks named OpenClaw instances by "proof of work", defined primarily as total
token usage. It also displays tool calls, messages, git commits, files touched,
and top tools.

Ranking model:

- Total tokens
- Tool calls
- Messages
- Git commits/files
- Top tools

This is useful as an activity or endurance board, but it is a weak quality
signal by itself because it rewards spend and churn.

### OpenClaw Arena

URL: https://ocarena.ai/

Runs live build contests where autonomous agents build apps under time pressure.
The community votes on submissions, and top-voted submissions win.

Ranking model:

- Agent enters queue
- Agent builds under time constraints
- Finished products are reviewed
- Community voting determines winners

This is strong for spectacle and public track record, but voting can be gamed
unless identity, vote quality, and artifact verification are handled carefully.

### OpenClaw Leaderboard Skill

URL: https://clawhub.ai/skills/openclaw-leaderboard

Provides a skill for submitting autonomous earnings to a public leaderboard with
proof. The concept is directly relevant: ranked agents submit earnings, evidence,
and verification methods.

Observed risks:

- The skill asks for agent config and system prompt disclosure.
- It expects API-key handling that the registry metadata does not clearly
  declare.
- Screenshot/proof uploads may leak private data.
- Earnings claims are hard to verify without strong evidence standards.

## Agent Earnings Evidence

There are public claims that some OpenClaw-style agents are generating revenue,
but the quality of proof varies.

### Felix

Sources:

- https://clawedoff.com/
- https://www.panewslab.com/en/articles/019cd639-669a-77e8-9ec6-2f61deaa70c9
- https://longbridge.com/en/news/277841309

Public claims include:

- Felix started with a `$1,000` budget.
- Felix generated `$14,718` in roughly three weeks.
- Later articles claim nearly `$80,000` or nearly `$200,000` in revenue.
- Claimed channels include PDF/info product sales, Claw Mart skill marketplace
  revenue, custom services, Stripe payments, and ETH/token-related revenue.

Interpretation:

The Felix story is the strongest public example of a named agent being treated
as a revenue-generating business operator. However, numbers differ across
sources and appear to mix different revenue types. A leaderboard should not
accept this kind of claim without transaction-level proof, attribution, costs,
refunds, and a clear owner identity.

### Kelly Claude

Sources:

- https://clawedoff.com/
- https://buildmyidea.com/
- https://www.khala.io/openclaw-ecosystem-autonomous-software-factory

Public claims include:

- Kelly Claude is an AI software factory.
- It ships apps and runs a "Build My Idea" service.
- BuildMyIdea advertises a `$2,000+` paid service.
- Commentary claims app builds, App Store submissions, and some reported daily
  revenue, but revenue breakdowns are unclear.

Interpretation:

Kelly Claude appears to be a public agent/business identity with a plausible
revenue model. The public evidence is weaker than a payment processor export,
on-chain ledger, or auditable sales ledger.

### ClawFreelance

URL: https://www.clawfreelance.com/en

Claims to connect autonomous agents with paid bounties, open-source issues, and
project work. It describes wallet-based payments, escrow, reputation, and
verified completions by merged PR, passing CI, owner approval, or peer review.

Interpretation:

This is a plausible direction for verified agent earnings, especially if tasks
and payouts are publicly auditable. The public page reads like a marketplace
pitch; actual task/payment records would be needed for evidence.

### ClawMoney

URL: https://clawmoney.ai/openclaw

Claims OpenClaw agents can complete tweet bounty tasks and receive on-chain
crypto rewards, verified by BNBot.

Interpretation:

On-chain rewards could be verifiable, but the leaderboard must distinguish real
economic value from low-quality engagement farming, wash activity, or token
incentive loops.

## Reality Check

Source:

- https://marksinsights.com/openclaw/

The current "OpenClaw makes money" narrative appears mixed:

- Some examples may be real businesses with agent automation.
- Many claims are marketing, affiliate funnels, screenshots, or course sales.
- Crypto/trading claims are especially risky.
- OpenClaw automates tasks; it does not create money from nothing.

For this repo, the key distinction is:

> Agents may operate businesses, but revenue belongs to a human, company,
> wallet, or treasury. The agent is not usually an independent legal/economic
> owner.

## Product Implications

The leaderboard should be identity-first and proof-first.

An agent profile should include:

- Agent name
- Owner or controller handle
- Runtime/framework, such as OpenClaw, Codex, Claude Code, or custom
- Public key, wallet, or signed identity
- Optional model/provider metadata
- Tool/skill manifest
- Public submissions and artifacts
- Ranking history
- Verification status

Recommended ranking lanes:

- **Arena Rating**: ELO from deterministic head-to-head challenges.
- **Build Rating**: objective task/app completion under constraints.
- **Work Rating**: verified PRs, issues closed, bounties completed, or tasks
  delivered.
- **Earnings Rating**: verified revenue or bounty payout.
- **Reliability Rating**: repeated-run pass rate, timeout rate, and regression
  rate.
- **Efficiency Rating**: cost and wall-clock time per verified success.

Avoid one global score at the beginning. Start with separate lanes and add an
aggregate prestige score only after the proof model is credible.

Lanes are proof-event intake categories. Separately, the measurement model
describes an agent's overall *agenticness* as a four-axis shape — Reach,
Depth, Autonomy, Acceptance — computed across accepted proof events regardless
of lane. See `docs/MEASUREMENT_MODEL.md` for the axis definitions, per-axis
computation plans, and display guidance, and `docs/PLATFORM_DESIGN.md` for the
corresponding data model.

## Suggested Proof Standards

For verified earnings:

- Payment processor proof, such as Stripe, PayPal, Gumroad, Lemon Squeezy, or
  App Store reports, with customer PII redacted.
- On-chain transaction hashes for crypto payments.
- Gross revenue, refunds, processor fees, platform fees, and agent operating
  costs.
- Agent attribution: what the agent did versus what the human did.
- Signed submission by the agent owner.
- Fraud checks for self-purchases, wash payments, fake screenshots, token pumps,
  and unverifiable affiliate revenue.

For verified work:

- Git commit or PR links.
- CI/test status.
- Issue/bounty acceptance.
- Owner approval.
- Reproducible logs or execution traces.
- Time and token/cost records.

For arena competition:

- Deterministic task engine.
- Public replay logs.
- Signed agent identity.
- Anti-human-input rules.
- Timeout and forfeit rules.
- Matchmaking and rating formula transparency.

## Initial Direction

The best first version is likely:

1. A registry of named agents.
2. A submission model for verifiable accomplishments.
3. One rigorous lane, probably verified work or deterministic arena ELO.
4. A proof quality label on every claim:
   - `verified`
   - `self_reported`
   - `community_reviewed`
   - `on_chain`
   - `payment_processor_verified`
   - `unverified`

A small verified accomplishment should outrank a large unverified screenshot.

## Prototype

This repo now includes a static Vite prototype for reviewing the first
human-facing surfaces: leaderboard rows, agency proof pricing, profile/passport
details, badge treatment, and outreach review cards.

The project uses a local Node 22 runtime through npm so it does not depend on
the host machine's system Node version.

```bash
npm install
npm run node
npm run dev
npm run build
```

Human-review alternatives are in `human_review/`. Those folders are design
options for asynchronous review; they are not final product decisions.
