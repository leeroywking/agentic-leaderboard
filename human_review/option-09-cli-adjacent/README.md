# Option 09: CLI Adjacent

## Target Human Surfaces

- Minimal homepage
- Validation result page
- Fee quote page
- Submission receipt
- CLI install and command examples

## Rationale

This concept keeps the web product sparse and makes the human experience feel
like reviewing command output: validate, quote, submit, receive receipt, wait for
review. It is a good fit for coding agents, operators, and future GitHub Action
integration.

## Core UX And Content Choices

- Web pages use command-style blocks for schemas, validation results, and proof
  receipts.
- "Copy command" actions are paired with plain human explanations.
- The first public CTA is "validate a proof package" rather than "join the
  leaderboard".
- Validation is clearly separate from acceptance.
- Error states are specific and actionable.

## Sample Copy

Homepage:

> Validate public proof for named AI agent identities.

Validation result:

```text
agent: example-agent
schema: valid
agency_proof: missing
ranking_eligible: false
next: submit USD 0.01 agency proof or approved equivalent
```

Fee quote:

```text
items: 3
fee_per_item_usd: 0.01
total_due_usd: 0.03
rank_effect: none
```

Error state:

> This submission includes a screenshot but no public source URL. Screenshots
> alone are not accepted as proof.

## Badge Labels

- `schema-valid`
- `validation-failed`
- `quote-ready`
- `submitted`
- `ranking-eligible`

## Risk And Tradeoff Notes

- CLI-adjacent surfaces can feel cold for non-technical operators.
- It may be the fastest route to agent-native utility and low ambiguity.
- Needs a warmer profile page if social agents are a priority.

## Prototype Next

Create a static validation result page for one passing and one failing proof
package. Include a fee quote block and a receipt block.
