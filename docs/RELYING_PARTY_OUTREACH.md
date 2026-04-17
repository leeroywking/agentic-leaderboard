# Relying-Party Outreach Drafts

Last updated: 2026-04-16.

Purpose: identify and sequence the first paying relying-party design partners
for Agentic Leaderboard. Relying parties are the side with real budget
($299/month pilot tier and up) and consequence (they rely on our data to make
a decision). Getting one signed is the single most load-bearing commercial
milestone.

This file contains message drafts the operator can send. Drafts are written
to be pasted into email; the sender line, signature, and any final
personalization are the operator's to add before sending.

## Prioritization rationale

Shortlist criteria (in order):
1. **Has pain today.** The target platform already handles inbound agent work
   and has a maintainer-visible noise problem.
2. **Small enough to decide quickly.** A 2-10 person team can commit to a
   pilot in one meeting. Enterprise deals take quarters.
3. **Public enough to pursue cold.** Active GitHub, blog, or conference
   presence so the outreach can reference something real rather than being
   generic.
4. **Low integration cost.** They already have a place to render badges or
   an API surface where our score fits naturally.

Categories, in descending priority:

- **A. AI code review platforms.** CodeRabbit, Graphite Reviewer, Greptile.
  They all triage AI-generated PRs as a core product; our score is a
  natural pre-filter.
- **B. Agent directories with paid tiers.** AI Agents Directory, AI Agent
  Store, Glama, Credo AI, TrueFoundry. They already monetize listings; our
  verified-agent badge is a differentiator on their tier ladder.
- **C. MCP-adjacent registries.** Glama MCP registry (21K+ servers), MCP
  Gateway Registry (agentic-community), official MCP registry. Agents
  registered on an MCP server need a trust signal; we fit inline.
- **D. OSS projects with high agent-PR volume.** django/django,
  facebook/react, vercel/next.js, microsoft/vscode, astral-sh/ruff.
  Lower-revenue target, but the reference logos are disproportionate for
  credibility.
- **E. Agent-hiring / bounty platforms.** Replit Bounties, ClawFreelance,
  any platform routing paid work to agents.

Targets in categories A–C are Tier 1 for immediate outreach. D is Tier 2
(pursue after the first pilot signs). E is Tier 3 (they are closer to
subject-side candidates but pay if they route real work).

## Tier 1 — Send this week

### CodeRabbit (code review AI)

Likely contact: support@coderabbit.ai or founder on LinkedIn (verify before
sending).

Subject: `Agent reputation layer for the PRs you review`

```
Hi CodeRabbit team,

I'm building Agentic Leaderboard — a reputation layer for named AI agents
backed by evidence, not self-report. The acceptance axis in our scoring
(https://agenticleaderboard.org/agent-skoal-reviewer.html) is computed from
external-maintainer merge rates, which maps directly to what CodeRabbit
already knows about an agent's track record.

The wedge: ~17M AI-generated PRs a month on GitHub as of March 2026, ~90%
noise. Your reviewers see the noise first. If a submission comes from an
agent with a verifiable 90%+ acceptance score and 200+ external merges, that
should change how fast it gets through review.

Three ways we could work together:
1. Display our verified-agent badge in your review UI when the submitter
   has a passport (free pilot API, shipped).
2. You become our first evidence issuer — your review outcomes feed the
   Acceptance axis with "verified" confidence.
3. Joint pilot: $299/mo locked for 12 months, unlimited pilot support,
   public listing as a pilot partner.

15 minutes next week to see if the shape fits?

— [name]
https://agenticleaderboard.org/for-relying-parties.html
```

### Graphite (PR review / stacked diffs)

Likely contact: founders@graphite.dev (verify). They are vocal about code
review and have a strong AI code review surface.

Subject: `Verified-agent signal for Graphite reviewers`

```
Hey Graphite team,

Agentic Leaderboard is a reputation layer for named AI agents — shape
across four evidence-backed axes (Reach, Depth, Autonomy, Acceptance) with
a versioned composite. Proof trail is public, rejection rate is public,
and acceptance is only credited when the merger is external to the
submitter's org.

For Graphite specifically: your reviewers are already scoring agents
implicitly every time they accept or reject an AI PR. If you surfaced a
versioned reputation score inline with the PR, reviewers could concentrate
on submissions where the reputation doesn't already do the work.

Pilot tier is $299/mo, 5K lookups, locked for 12 months, badge widget with
integrity attestation, public listing as a pilot partner. We're taking
three pilot slots in H1 2026.

Worth a call?

— [name]
https://agenticleaderboard.org/for-relying-parties.html
```

### Greptile (code intelligence + agent review)

Contact: team@greptile.com (verify).

Subject: `Agenticness score for Greptile's review layer`

Same shape as Graphite draft; swap the two middle paragraphs to reference
Greptile's focus on repo-wide context and how our Depth axis maps to
agent durability inside a codebase.

### AI Agents Directory (aiagentsdirectory.com)

Contact: form on site or listed founder. They already run paid agent
tiers and an interactive landscape.

Subject: `Evidence-backed score for your 600+ listings`

```
Hi AI Agents Directory team,

Quick pitch: we publish an evidence-backed reputation score for named AI
agents. Four axes (Reach, Depth, Autonomy, Acceptance), versioned composite,
public proof trail. Every agent on your directory could carry our badge
inline, and the score updates automatically when the underlying evidence
changes.

Why this matters for you: your "featured" and "verified" tiers right now
are platform-assigned. Ours are evidence-assigned, with a public rejection
rate, and your listings get a differentiator against directories that use
self-declared quality signals.

Three pilot slots available, $299/mo locked for 12 months, public
pilot-partner listing. If you'd rather integrate at Standard tier, that's
$999/mo for 25K lookups with bulk endpoint.

20 minutes to look at the shape?

— [name]
https://agenticleaderboard.org/for-relying-parties.html
```

### Glama (MCP registry, 21K+ servers)

Contact: founder on X or Twitter account listed on glama.ai.

Subject: `Trust signal for the 21K MCP servers`

```
Hi [founder],

Congrats on passing 21K MCP servers on the registry — that's a scale where
signal-vs-noise becomes a first-class problem.

I'm building Agentic Leaderboard, a reputation layer for named agents and
MCP servers. Four-axis evidence shape, versioned composite, proof trail,
public rejection rate. Badges are embeddable, and the API lets any registry
display a verification badge next to a server listing.

For Glama, I'd suggest the simplest integration first: a badge widget next
to each MCP server listing, rendering the shape and linking to the
passport. Sandbox tier is free (100 lookups/mo) — enough to prototype the
integration end-to-end before any paid commitment.

Want a working example embed you can drop into a test listing?

— [name]
https://agenticleaderboard.org/for-relying-parties.html
```

### MCP Gateway Registry (agentic-community on GitHub)

Contact: open a GitHub issue or discussion in the repo; this is an
open-source project so public-issue-first is fine.

Subject: `Optional: plug Agentic Leaderboard badges into the registry UI`

```
Opening this as a discussion rather than an issue since it's a question,
not a bug.

We (Agentic Leaderboard) are building an evidence-backed reputation layer
for named AI agents. For the MCP Gateway Registry specifically, our score
could be displayed inline with registered agents/servers so operators can
see a verification shape before granting access.

Integration would be:
- Free sandbox tier, no API key required for unauthenticated read access.
- SVG badge endpoint with an optional integrity attribute.
- Passport URL for each rated agent the registry already hosts.

Happy to submit a PR if there's interest. Not otherwise. Want to make
sure this aligns with the registry's governance philosophy before
opening code changes.
```

### Credo AI (AI Agent Registry product)

Contact: hello@credo.ai.

Subject: `Evidence-backed scoring complements your Agent Registry`

They already have "AI Agent Registry" in their product. This is a partnership
pitch, not a pilot — Credo sells enterprise governance; we sell a public
reputation score. The ask is co-marketing plus an evidence feed.

```
Hi Credo team,

Your AI Agent Registry governs agents inside an enterprise. Agentic
Leaderboard publishes a public reputation score for named agents across
the public ecosystem. The two surfaces don't overlap, but they complement:
an enterprise Credo customer could pull our public shape into their
registry's view, giving governance teams outside-the-walls signal on an
agent before it's approved for internal use.

We'd like to:
1. Offer Credo customers a free lookup tier for any agent in our registry.
2. Propose a joint case study with a design partner who uses both.
3. Invite Credo to our charter-sponsor tier ($2,500/mo) for roadmap input.

Happy to send a 2-page brief before any call if that's easier.

— [name]
https://agenticleaderboard.org/for-relying-parties.html
```

## Tier 2 — Send after first Tier 1 commit

- TrueFoundry (AI agent infrastructure)
- aiagentstore.ai
- Replit (Bounties + Agents, if identifiable decision-maker)
- Devin / Cognition (agent-builder, not marketplace — pitch is evidence
  feed for their agents' track record)
- Cursor / Windsurf / Claude Code harness teams (evidence-issuer angle)

## Tier 3 — OSS reference logos

OSS projects to approach after first two pilots sign, with a "free
forever" offer in exchange for a logo:

- django/django (core team via triagers mailing list)
- facebook/react
- vercel/next.js
- microsoft/vscode
- astral-sh/ruff
- openssf — supply-chain angle, not agent-specific but credibility-adjacent

Template for OSS:

```
Maintainers,

[Project] gets X thousand AI-generated PRs a year. Agentic Leaderboard
publishes a public reputation score for named agents. I'd like to offer
[project] a free-forever Pilot tier (normally $299/mo) in exchange for
displaying our agent score inline with PR listings — either in a bot
comment or a GitHub Action that annotates the PR with the submitter's
composite and evidence link.

No contract. No lock-in. If the signal doesn't help your triagers, you
remove the comment and we go away.

Happy to draft the GitHub Action as a PR if it's easier to evaluate.

— [name]
```

## Outreach Discipline

- No more than 10 cold emails per week. Quality over throughput.
- Every outreach is logged in `WORK_HISTORY.md` with date, target, and
  channel so the follow-up cadence is visible and nothing gets contacted
  twice.
- If a target declines, add them to a suppression section in this file
  and do not re-approach for 12 months.
- Do not mass-cc or use mail-merge. Each message is personalized.
- If a target agrees to a pilot, their name is added to
  `/for-relying-parties.html` as a public pilot partner within the same
  week.

## Follow-up cadence

- Day 0: initial message.
- Day 4: light follow-up ("bumping this, no pressure") once.
- Day 14: final follow-up with a single-sentence product update and a soft
  close ("circling back — happy to revisit when your timing is better").
- After day 14 with no response: move to suppression for 6 months.

## Suppression

None yet.
