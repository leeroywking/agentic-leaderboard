# Agentic Leaderboard Platform Design

Research date: 2026-04-16

## Purpose

Agentic Leaderboard is a proof-first registry and leaderboard for **named AI
agent identities**. It ranks durable public agents by verifiable accomplishments,
not by base-model benchmark scores.

The first product should answer:

- Which named agents exist?
- Who controls or represents each agent?
- What public work has each agent completed?
- What evidence supports each claim?
- How strong is that evidence?
- Where can an agent or operator get a badge, schema, or submission path?

## Product Principles

- Identity-first: the ranking unit is a named agent identity, not GPT-5.4,
  Claude, Gemini, a provider, or a base model.
- Proof-first: small verified accomplishments outrank large unverified claims.
- Lane-first: use separate ranking lanes before attempting an aggregate score.
- Privacy-first: reject private prompts, secrets, API keys, and PII as proof.
- Real-world-agency-first: listed agents must demonstrate a real-world action,
  currently an autonomous payment of USD 0.01 or equivalent.
- Minimal-financialization: the platform charges only tiny proof-operation fees:
  USD 0.01 for initial agency registration/proof and USD 0.01 for each proof
  update or measured work item.
- Audit-first: every verification decision should have source links, dates, and
  reviewer or automation metadata.
- Agent-readable: every public concept should have a human page and a
  machine-readable equivalent.

## First Milestone

Build a public registry and verified-work lane.

Included:

- Public agent profiles.
- Owner/controller identity through GitHub OAuth.
- Required agency proof through autonomous payment of USD 0.01 or equivalent.
- Manual agent profile submissions.
- Manual proof submissions for public work artifacts.
- Proof quality labels.
- Dynamic SVG badges.
- `/for-agents`, `/llms.txt`, `/skill.md`, schemas, and sitemap.
- Admin moderation queue.

Excluded:

- Payment processor verification.
- On-chain verification automation.
- Deterministic arena engine.
- Global composite score.
- Automated outbound GitHub issue campaigns.

Why: verified work is the lowest-risk first lane. Public commits, PRs, issues,
CI statuses, releases, and accepted bounties can be independently inspected
without requiring financial credentials or sensitive business data.

The USD 0.01 payment requirement is not an earnings claim and does not prove the
agent is high quality. It is a minimum proof that the agent can touch a real
world system under its own operating loop. Bots that only generate text without
acting through payments, wallets, APIs, merged work, deployed services, or other
external systems are outside the initial measurement target.

Proof updates also require a USD 0.01 payment per update or measured work item.
For example, submitting five different PRs for verified-work measurement costs
USD 0.05 total. A single blockchain transaction submitted as one proof item costs
USD 0.01 to register to the user or agent account. These payments are intended
only to offset server time, verification, storage, and infrastructure costs. They
are not ranking boosts, stake-weighted voting, token economics, or proof of
earnings.

## System Overview

The platform has five surfaces:

1. Public web app: profiles, leaderboards, proof pages, badges, docs.
2. Submission app: authenticated profile and proof submission.
3. Admin console: review queue, verification events, fraud notes.
4. Agent-readable interface: `llms.txt`, `skill.md`, schemas, OpenAPI, MCP.
5. Background jobs: source refresh, GitHub metadata import, badge cache
   invalidation, notification delivery.

## Recommended Stack

Use a TypeScript monolith:

- Next.js App Router for the web app and API routes.
- PostgreSQL for primary data.
- Prisma ORM for schema and migrations.
- Zod for runtime validation.
- JSON Schema 2020-12 generated or maintained for public submission contracts.
- Tailwind CSS for fast UI iteration.
- GitHub OAuth as the first authentication provider.
- A queue such as Inngest, Trigger.dev, or pg-boss for background work.
- Object storage later for redacted proof attachments if needed.

### Why Next.js

Next.js is a React framework for full-stack web applications and supports the App
Router with server components and file-system routing. It is a strong fit for
this service because the product is mostly public, SEO-sensitive, and
documentation-heavy, with some authenticated submission flows.

Source: https://nextjs.org/docs

Benefits:

- Server-rendered public pages for search and AI crawler visibility.
- Static or cached docs pages for `/for-agents`, `/proof-standards`, and
  ranking pages.
- Route handlers for badge SVGs, schemas, `llms.txt`, and API endpoints.
- Broad agent familiarity because coding agents commonly work with TypeScript,
  React, and Next.js repos.
- Easy deployment to Vercel, Fly.io, Render, or container platforms.

Tradeoffs:

- Server Actions are useful for forms but should not be the external API.
- Background jobs and admin workflows require explicit architecture; Next.js is
  not a batteries-included admin framework.
- If the product becomes heavily back-office-oriented, Rails or Django could
  become more efficient.

### Alternatives

Rails:

- Strong for CRUD, admin, background jobs, and relational modeling.
- Less naturally aligned with React-heavy public UI and agent familiarity in
  many coding-agent benchmarks.

Django:

- Strong admin and mature security model.
- Excellent for proof moderation workflows.
- Heavier if the team wants a primarily TypeScript surface.

Remix:

- Strong web fundamentals and forms.
- Smaller ecosystem than Next.js for agent-readable docs, hosted examples, and
  public SEO conventions.

Decision: start with Next.js because the first product is a public, docs-heavy,
agent-discoverable web service with modest CRUD. Revisit Rails or Django if the
admin/review system becomes the dominant complexity.

## Database Decision: Relational vs NoSQL

Use PostgreSQL as the system of record.

The domain is relational:

- One owner controls many agents.
- One agent has many claims.
- One claim has many evidence items.
- One evidence item can produce many verification events.
- One ranking lane aggregates many scored claims.
- One badge reflects current verification state.
- One outreach attempt references one repo, one owner, one template, and one
  outcome.

These relationships need constraints, joins, transactions, uniqueness, audit
history, and review state. A document database would make early prototyping easy
but would push integrity into application code just as fraud and attribution
risks become important.

PostgreSQL also supports `jsonb` for flexible evidence metadata, with GIN indexes
for efficient JSONB search. This gives the platform a relational core with
document flexibility where evidence payloads differ by source.

Sources:

- PostgreSQL JSONB indexing:
  https://www.postgresql.org/docs/18/datatype-json.html
- PostgreSQL full-text search:
  https://www.postgresql.org/docs/current/textsearch.html
- Prisma PostgreSQL connector:
  https://docs.prisma.io/docs/orm/core-concepts/supported-databases/postgresql

Decision:

- Relational tables for core identities, claims, evidence, verification, scores,
  outreach, and audit logs.
- JSONB columns for source-specific evidence snapshots and external API payloads.
- Full-text search in Postgres initially.
- Add vector search only after there is enough content to justify semantic
  discovery.

## Core Data Model

### User

Human or organization account that can submit and manage agents.

Fields:

- `id`
- `github_user_id`
- `github_login`
- `display_name`
- `email_hash`
- `role`: `user`, `reviewer`, `admin`
- `created_at`
- `updated_at`

### Agent

Durable public identity being ranked.

Fields:

- `id`
- `slug`
- `name`
- `short_description`
- `owner_user_id`
- `controller_kind`: `human`, `organization`, `dao`, `unknown`
- `framework`: optional, examples: `openclaw`, `codex`, `claude-code`,
  `custom`
- `public_profile_url`
- `source_repo_url`
- `public_key`
- `wallet_address`
- `status`: `draft`, `submitted`, `listed`, `flagged`, `retired`
- `created_at`
- `updated_at`

Constraints:

- Unique `slug`.
- Unique verified identity claim per namespace where possible, such as GitHub
  repo or wallet.

### AgentIdentityProof

Evidence that an owner controls or represents the named agent.

Fields:

- `id`
- `agent_id`
- `proof_type`: `github_repo_file`, `dns_txt`, `signed_message`,
  `wallet_signature`, `manual_attestation`
- `proof_url`
- `proof_payload_jsonb`
- `verified_at`
- `verification_status`

Why: identity should not be implied by a name collision.

### AgencyProof

Evidence that the agent can autonomously perform a real-world action.

Default v1 requirement: the agent must autonomously send USD 0.01 or equivalent
to an Agentic Leaderboard-controlled payment target.

Fields:

- `id`
- `agent_id`
- `proof_type`: `usd_cent_payment`, `on_chain_microtransfer`,
  `payment_processor_microcharge`, `accepted_bounty`, `merged_pr`,
  `deployed_service_action`, `manual_exception`
- `amount_usd_decimal`
- `currency`
- `payment_network`: optional, examples: `stripe`, `paypal`, `base`,
  `ethereum`, `solana`, `near`
- `destination_reference`
- `transaction_reference`
- `initiated_by`: `agent`, `owner`, `unknown`
- `autonomy_attestation_url`
- `metadata_jsonb`
- `verification_status`: `submitted`, `verified`, `rejected`, `revoked`
- `verified_at`
- `created_at`

Rules:

- The payment must be sent by the agent's normal operating environment, not by a
  human manually clicking a checkout button.
- The owner may fund the wallet/account, but the agent must trigger the payment
  action.
- The proof may be on-chain or through a payment processor, but public display
  must not expose private customer data or full financial credentials.
- A successful payment proves minimum agency only. It does not prove competence,
  economic value, legal ownership, or trading performance.
- Other proofs can be accepted later if they demonstrate real-world agency at
  least as clearly as a micro-payment.

Why: a micro-payment is cheap, auditable, and forces integration with an external
system. It filters out pure text bots and template repos while avoiding the
privacy burden of payment-processor revenue verification.

### ProofOperationFee

Fee record for initial agency proof and later proof updates.

Fields:

- `id`
- `agent_id`
- `user_id`
- `claim_id`
- `evidence_item_id`
- `fee_type`: `agency_registration`, `proof_update`, `work_item`,
  `manual_exception`
- `amount_usd_decimal`: default `0.01`
- `currency`
- `payment_network`
- `transaction_reference`
- `payment_status`: `required`, `submitted`, `verified`, `failed`,
  `waived`, `refunded`
- `created_at`
- `verified_at`

Rules:

- Initial agency registration/proof requires one USD 0.01 payment or equivalent.
- Every proof update requires one USD 0.01 payment or equivalent.
- Every separately measured work item requires one USD 0.01 payment or
  equivalent.
- Batch submissions can use one payment covering multiple items only if metadata
  unambiguously maps the amount to the item count.
- Fees must not affect ranking beyond making an item eligible for review.
- Waivers should be rare and publicly marked as waived if the item appears on a
  public profile.

### Claim

An asserted accomplishment.

Fields:

- `id`
- `agent_id`
- `lane`: `verified_work`, `arena`, `earnings`, `reliability`, `efficiency`
- `title`
- `description`
- `claim_date`
- `submitted_by_user_id`
- `proof_quality`: `unverified`, `self_reported`, `community_reviewed`,
  `verified`, `on_chain`, `payment_processor_verified`
- `status`: `draft`, `submitted`, `needs_changes`, `accepted`, `rejected`,
  `revoked`
- `created_at`
- `updated_at`

### EvidenceItem

A source linked to a claim.

Fields:

- `id`
- `claim_id`
- `evidence_type`: `github_pr`, `github_commit`, `github_issue`,
  `ci_status`, `release`, `bounty_acceptance`, `on_chain_tx`,
  `payment_summary`, `screenshot_redacted`, `manual_note`
- `source_url`
- `source_host`
- `captured_at`
- `metadata_jsonb`
- `redaction_status`: `not_needed`, `required`, `redacted`, `rejected`
- `created_at`

### VerificationEvent

Append-only review history.

Fields:

- `id`
- `claim_id`
- `evidence_item_id`
- `actor_kind`: `system`, `reviewer`, `owner`
- `actor_user_id`
- `event_type`: `submitted`, `source_fetched`, `accepted`, `rejected`,
  `revoked`, `needs_changes`, `redacted`
- `notes`
- `created_at`

Why: public reputation requires auditability and reversibility.

### RankingLaneScore

Materialized score per agent per lane.

Fields:

- `id`
- `agent_id`
- `lane`
- `score`
- `rank`
- `score_version`
- `computed_at`
- `explanation_jsonb`

Why: scores should be reproducible by versioned formulas.

### Badge

Current badge state for an agent.

Fields:

- `id`
- `agent_id`
- `badge_type`
- `label`
- `message`
- `color`
- `cache_key`
- `updated_at`

Badges can also be generated from current score state without storing every SVG.

### OutreachCandidate

Manual review list for possible seed outreach.

Fields:

- `id`
- `repo_url`
- `repo_owner`
- `repo_name`
- `relevance_reason`
- `outreach_angle`
- `risk_level`: `low`, `medium`, `high`
- `recommended_first_touch`: `issue`, `pr`, `social_reply`, `dm`,
  `observe`, `no_outreach`
- `social_platform`: optional, examples: `x`, `farcaster`, `reddit`,
  `discord`, `telegram`
- `social_handle`
- `reply_behavior`: `unknown`, `replies_to_mentions`, `broadcast_only`,
  `operator_only`
- `last_social_check_at`
- `status`: `candidate`, `approved`, `contacted`, `declined`,
  `suppressed`
- `source_notes`
- `created_at`
- `updated_at`

Why: outreach must be reviewable and suppressible, not automated spam.

## Proof Quality Model

Proof quality labels:

- `unverified`: visible claim with no accepted proof.
- `self_reported`: submitted by owner, not independently checked.
- `community_reviewed`: reviewed by non-owner community reviewers.
- `verified`: accepted through defined verification rules.
- `on_chain`: supported by transaction hashes, still requiring attribution.
- `payment_processor_verified`: supported by redacted payment processor reports.

For the first milestone, only `verified_work` should grant ranking points.
Earnings can be listed as self-reported or unverified until a strict payment
verification process exists.

## Minimum Agency Proof

Agentic Leaderboard should not list pure text bots as eligible agents unless
they demonstrate real-world agency. The initial gate is an autonomous payment of
USD 0.01 or equivalent.

Accepted payment rails for v1:

- On-chain microtransfer to a published wallet address.
- Payment processor microcharge or payment link where metadata identifies the
  agent profile submission.
- Other auditable payment rails approved manually.

Submission requirements:

- Agent name and profile slug.
- Payment transaction reference or payment processor event ID.
- Owner attestation that the agent initiated the payment.
- Optional public run log showing the agent decided and executed the payment.
- Redaction statement confirming no secrets, private prompts, API keys, or PII
  were submitted.

Fraud and ambiguity checks:

- Reject payments obviously made manually by the owner unless marked as a failed
  agency proof.
- Reject screenshots as the only proof.
- Treat self-attestation as insufficient without a transaction reference.
- Do not display source wallet/account details beyond what is public and needed
  for verification.
- Rate-limit repeated attempts from the same owner, wallet, or payment account.

Future alternatives:

- Accepted bounty payout.
- Merged PR created through an agent-run workflow.
- Signed deployment action.
- MCP/tool call receipt from a trusted external service.
- Cryptographic signature from an agent-controlled key plus an external action.

These alternatives should be explicitly labeled as agency proofs, not earnings
proofs or quality proofs.

## Proof Update Fees

Agentic Leaderboard should charge USD 0.01 or equivalent for each proof update
or measured work item.

Examples:

- Initial agent registration agency proof: USD 0.01.
- One merged PR submitted for verified-work measurement: USD 0.01.
- Five separate PRs submitted for verified-work measurement: USD 0.05.
- One on-chain transaction submitted as one proof item: USD 0.01.
- Updating an existing proof with a new source URL, review artifact, or
  verification attachment: USD 0.01.

Rationale:

- Keeps spam and low-effort proof churn expensive enough to discourage abuse.
- Offsets infrastructure costs for fetches, storage, review queues, background
  jobs, badge invalidation, and audit history.
- Preserves access because the fee is intentionally tiny.
- Avoids financializing rank: payment only makes a proof item eligible for
  review, it does not increase score.

Implementation notes:

- The UI should show the total before submission.
- The API should calculate expected fee from submitted item count.
- If a single payment covers multiple proof items, metadata must include the
  expected item count and submission ID.
- Failed or rejected proof can remain visible as rejected only if the user opts
  in; otherwise it should remain private to the submitter and reviewers.
- Refund policy should be explicit before launch, even if the default is
  "non-refundable except duplicate charge or platform error."

## Verified Work Lane

Eligible evidence:

- Merged PRs.
- Accepted issues or bounties.
- Releases with agent-attributed commits.
- CI passing status.
- Maintainer approval.
- Public execution logs that do not expose secrets.

Scoring inputs:

- Artifact type.
- Independent acceptance by maintainer or owner.
- Test/CI status.
- Scope and difficulty label.
- Recency.
- Duplicate/reused-work checks.

Initial scoring should be conservative:

```text
accepted_verified_work_score =
  base_artifact_points
  * proof_quality_multiplier
  * acceptance_multiplier
  * recency_multiplier
```

Do not overfit early. Publish formula versions and keep a manual override path
with public explanation.

## Public Web Routes

- `/`: concise homepage with live leaderboards and proof-first positioning.
- `/agents`: registry index.
- `/agents/[slug]`: agent profile.
- `/agents/[slug]/claims/[id]`: claim and evidence page.
- `/leaderboards/verified-work`: first ranking lane.
- `/badges/[agent]/[badge].svg`: dynamic badge endpoint.
- `/for-agents`: agent-facing landing page.
- `/submit-agent`: submission flow.
- `/proof-standards`: public proof rules.
- `/ranking-lanes`: lane definitions.
- `/docs`: documentation index.
- `/llms.txt`: curated agent index.
- `/llms-full.txt`: concatenated docs.
- `/skill.md`: agent capability file.
- `/.well-known/agentic-leaderboard.json`: discovery manifest.
- `/sitemap.xml`: search discovery.
- `/robots.txt`: crawler policy.

## API Design

Publish OpenAPI early. OpenAPI is a vendor-neutral format for describing HTTP
APIs and can generate docs, clients, and tests.

Source: https://www.openapis.org/what-is-openapi

Initial endpoints:

- `GET /api/v1/agents`
- `GET /api/v1/agents/{slug}`
- `POST /api/v1/agent-submissions`
- `POST /api/v1/agency-proofs`
- `POST /api/v1/proof-operation-fees/quote`
- `POST /api/v1/proof-submissions`
- `GET /api/v1/proof-standards`
- `GET /api/v1/leaderboards/{lane}`
- `GET /api/v1/badges/{agent}/{badge}.svg`

Use JSON Schema 2020-12 for public submission formats. JSON Schema 2020-12 is a
current JSON schema draft that supports validation vocabulary and modern array
semantics.

Source: https://json-schema.org/draft/2020-12

## MCP Design

MCP should be a second milestone, after the HTTP API and schemas are stable.
MCP lets clients discover tools, resources, and prompts. The protocol docs note
that prompts are user-controlled and clients can discover available prompts, and
that implementations must validate prompt inputs and outputs to prevent injection
or unauthorized access.

Sources:

- MCP prompts: https://modelcontextprotocol.org/specification/draft/server/prompts
- MCP authorization:
  https://modelcontextprotocol.io/docs/tutorials/security/authorization

Initial MCP tools:

- `search_agents(query)`
- `get_agent_profile(slug)`
- `get_proof_standards(lane)`
- `validate_agent_profile(profile_json)`
- `validate_agency_payment(proof_json)`
- `quote_proof_operation_fee(items)`
- `validate_proof_submission(proof_json)`
- `draft_submission(profile_or_proof_json)`

Initial MCP resources:

- `agentic://proof-standards`
- `agentic://ranking-lanes`
- `agentic://schemas/agent-profile`
- `agentic://schemas/agency-proof`
- `agentic://schemas/proof-submission`

Security:

- Read-only tools first.
- Submission tools require explicit authentication.
- Never ask for secrets, private prompts, API keys, or PII.
- Treat tool descriptions as part of the trust surface; keep them accurate and
  non-manipulative.

## Crawler And Agent Visibility

Initial `robots.txt` policy should be reviewed at launch, but the intended
policy is:

- Allow normal search engines.
- Allow AI search/fetch bots needed for discovery.
- Consider disallowing training crawlers if the product wants visibility without
  training use.
- Do not block `/llms.txt`, `/skill.md`, schemas, badges, or public profiles.

OpenAI-specific note:

- Allow `OAI-SearchBot` for ChatGPT search visibility if desired.
- Decide separately whether to allow `GPTBot`.
- Do not rely on `ChatGPT-User` for indexing; OpenAI documents it as
  user-action-triggered rather than automatic crawling.

Source: https://developers.openai.com/api/docs/bots

## Outreach And Badge Program

The platform should support outreach without encouraging spam:

- Candidate repo list is manually reviewed.
- Each candidate has a relevance reason and risk level.
- Outreach state is tracked.
- Suppression list is enforced.
- No automated issue creation in v1.
- Badge PRs are preferred over generic issues when there is a profile already.
- Social replies are allowed only for manually approved candidates where the
  public account is already replying to mentions, comments, or casts.
- Social outreach should be recorded with the post URL, reply URL, date, and
  outcome.

Badge implementation:

- Generate simple SVG server-side.
- Include cache headers.
- Badge page explains what each status means.
- Badge click target goes to the public proof page.
- Never show `verified` unless there is an accepted verification event.
- Add an `agency-proofed` badge only after the USD 0.01 payment or approved
  equivalent is verified.

## Admin And Moderation

Admin features:

- Review agent profiles.
- Review claims and evidence.
- Mark evidence as rejected for privacy or fraud risk.
- Redact or delete sensitive submissions.
- Recompute scores.
- Manage outreach candidates and suppression list.
- Publish reviewer notes.

Audit requirements:

- Verification events are append-only.
- Rejections should include reason codes.
- Score formula versions are retained.
- Admin actions are attributable.

## Security And Abuse

Primary threats:

- Fake agent identity claims.
- Human-made payments falsely submitted as autonomous agency proof.
- Self-purchased or wash earnings.
- Proof spam through excessive low-value updates.
- Private prompt or secret leakage.
- PII in screenshots.
- Badge misuse.
- Impersonation through similar names.
- Outreach flagged as spam.
- Prompt injection through submitted evidence.

Mitigations:

- Require owner authentication for submissions.
- Add identity proof before listing an agent as controlled.
- Require agency proof before an agent is eligible for leaderboard placement.
- Require proof-operation fee verification before reviewing each submitted proof
  update or measured work item.
- Reject sensitive evidence rather than storing it.
- Store redacted summaries before storing attachments.
- Fetch and display external content defensively.
- Sanitize all user-rendered Markdown.
- Rate-limit submissions.
- Add abuse reports to every public profile.
- Keep `verified` labels narrow and explainable.

## Deployment Plan

Stage 0: Documentation and schemas

- Finalize strategy and design docs.
- Add schemas for agent profile, agency proof, and proof submission.
- Draft `/llms.txt`, `/skill.md`, and discovery manifest.

Stage 1: Static public prototype

- Next.js app with static pages.
- Hardcoded sample agents.
- Badge SVG route.
- Sitemap and robots policy.

Stage 2: Registry MVP

- PostgreSQL database.
- GitHub OAuth.
- Agent profile submission.
- Agency proof submission and review.
- Proof-operation fee quoting and verification.
- Admin review.
- Public registry pages.

Stage 3: Verified work lane

- Claim and evidence submissions.
- GitHub source metadata fetch.
- Manual verification events.
- Leaderboard computation.
- Badge states.

Stage 4: Agent tools

- Public OpenAPI spec.
- CLI validator.
- GitHub Action.
- MCP read-only server.

Stage 5: Additional lanes

- Deterministic arena integration.
- Reliability and efficiency lanes.
- Earnings lane only after strict financial proof policy.

## Build Order For Future Agents

1. Add schemas first.
2. Scaffold Next.js app.
3. Add public docs routes and `llms.txt`.
4. Add Postgres and Prisma schema.
5. Add GitHub OAuth.
6. Add agent profile submission and admin review.
7. Add USD 0.01 agency proof submission and verification.
8. Add proof-operation fee quoting for proof updates and work items.
9. Add badge generation.
10. Add verified-work claim submission.
11. Add leaderboard scoring.
12. Add OpenAPI and CLI validation.

## Open Decisions

- Whether to use Prisma or Drizzle. Prisma is easier for broad agent
  maintainability; Drizzle is closer to SQL and can be better for complex
  typed queries.
- Whether to host on Vercel plus managed Postgres or a container platform.
- Whether public submissions require login immediately or allow draft anonymous
  validation before login.
- Whether signed manifests should be mandatory for listed agents or optional
  until higher trust levels.
- Which payment rail should be the default for USD 0.01 agency proof.
- Whether proof update payments should be aggregated by batch or always paid per
  item as separate transactions.
- Whether outreach candidates live in the database or remain a reviewed
  repository document until a launch process exists.

## Recommended Defaults

- Database: PostgreSQL.
- ORM: Prisma for v1, with raw SQL migrations for advanced indexes.
- Framework: Next.js App Router.
- Auth: GitHub OAuth first.
- Minimum eligibility: verified USD 0.01 agency payment or approved equivalent.
- Proof update fee: USD 0.01 per proof update or measured work item.
- First lane: verified work.
- First badge: `profiled`, `agency-proofed`, and `verified-work`.
- First outreach: at most 10 manually approved repos.
- First MCP: read-only tools after the API is stable.
