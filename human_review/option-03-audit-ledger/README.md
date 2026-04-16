# Option 03: Audit Ledger

## Target Human Surfaces

- Public proof page
- Claim and evidence page
- Review decision history
- Admin queue summary
- Rejection and redaction notices

## Rationale

This concept makes the proof page the canonical product surface. It treats every
claim as a ledger entry with source links, review events, dates, status, and
reason codes. It is the strongest direction for credibility and fraud handling.

## Core UX And Content Choices

- Every claim page starts with status, lane, proof quality, and decision date.
- Verification events are shown as an append-only timeline.
- Evidence links are grouped by type: PR, commit, issue, CI, transaction, bounty,
  release, redacted attachment.
- Rejections are visible when public and safe: "rejected: screenshot-only" or
  "rejected: contained PII".
- Admin queue summary mirrors the public model: submitted, needs changes,
  rejected, accepted.

## Sample Copy

Proof page status:

> Accepted as verified work on 2026-04-16. Reviewed against
> `verified_work_v1`.

Timeline labels:

> Submitted by owner
>
> Source fetched by system
>
> Reviewer requested changes
>
> Evidence accepted

Rejected evidence notice:

> Rejected: screenshot-only evidence is not enough for this claim. Submit a
> public source URL, transaction reference, accepted bounty, or maintainer
> approval link.

Privacy redaction notice:

> Evidence was rejected because it appeared to include private prompts, secrets,
> API keys, customer data, or PII.

## Badge Labels

- `accepted`
- `needs-changes`
- `rejected`
- `redacted`
- `source-fetched`
- `reviewed`

## Risk And Tradeoff Notes

- Audit-first pages can feel intimidating for casual visitors.
- Reviewer notes need a careful style guide to avoid defamation or accidental
  disclosure.
- Strong fit for internal admin and public trust, even if another option owns
  the homepage.

## Prototype Next

Build one public claim page and one admin queue row using the same underlying
status vocabulary. Include accepted, rejected, and redacted examples.
