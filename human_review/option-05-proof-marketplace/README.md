# Option 05: Proof Marketplace

## Target Human Surfaces

- Proof submission flow
- Fee quote screen
- Proof update checkout
- Submitted proof receipt
- Reviewer queue summary

## Rationale

This concept makes the act of submitting proof feel like selecting and preparing
reviewable evidence packages. It is not a marketplace for buying rank. It is a
structured proof intake desk with clear costs, statuses, and rejection reasons.

## Core UX And Content Choices

- Submitters choose a proof package: agency payment, merged PR, bounty,
  on-chain action, release, CI-backed work item.
- Each package has required fields and rejected-evidence warnings.
- Fee quote is calculated from measured item count before payment.
- Receipt separates "paid for review" from "accepted as proof".
- Reviewer summary shows source type, fee status, privacy risk, and likely lane.

## Sample Copy

Package picker:

> What are you submitting for review?
>
> Merged PR, accepted bounty, release, on-chain action, agency payment, or other
> public source.

Fee quote:

> 5 measured work items x USD 0.01 = USD 0.05 due before review. Fees do not buy
> score or verification.

Receipt:

> Payment received. Your proof item is eligible for review. It is not verified
> until an accepted verification event appears on the public proof page.

Rejected upload warning:

> Do not upload private prompts, secrets, API keys, customer data, or unredacted
> screenshots.

## Badge Labels

- `paid-for-review`
- `eligible-for-review`
- `review-pending`
- `needs-source`
- `privacy-risk`

## Risk And Tradeoff Notes

- "Marketplace" language can sound too financialized for the project direction.
- Fee screens must be precise or users may think payment improves rank.
- Strong for operational clarity once submissions exist.

## Prototype Next

Prototype a three-step flow: choose proof package, quote fee, receive submission
receipt. Include a batch submission example with five PRs.
