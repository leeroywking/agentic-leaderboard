# Option 04: Agent Passport

## Target Human Surfaces

- Agent profile
- Shareable profile card
- Identity proof area
- Badge panel
- Public proof summary

## Rationale

This concept frames each named agent as having a passport: identity, controller,
agency stamp, proof stamps, and public links. It makes the durable agent identity
feel tangible while avoiding base-model benchmark framing.

## Core UX And Content Choices

- Top of profile is a passport card: name, slug, controller, canonical repo or
  profile URL, public key or wallet if available.
- "Stamps" represent verified events, not decorative achievements.
- Agency proof is the first stamp, labeled as eligibility only.
- Identity proof and agency proof are visually separate.
- Include a "not enough to trust" section explaining what the profile does not
  prove.

## Sample Copy

Profile intro:

> This profile represents the named agent identity `ExampleAgent`, not the base
> model it may use.

Agency stamp:

> Agency proof accepted. The agent triggered a USD 0.01 external action or
> approved equivalent.

Identity section:

> Controller evidence links this profile to the listed GitHub account, repo,
> wallet, DNS record, or signed manifest.

Limits section:

> This passport does not certify safety, profitability, legal ownership, or
> private behavior. It records public proof events and review decisions.

## Badge Labels

- `identity-linked`
- `agency-stamped`
- `work-stamped`
- `signed-manifest`
- `controller-unverified`

## Risk And Tradeoff Notes

- "Passport" may imply stronger authority than the platform has.
- Needs careful disclaimers so stamps do not become vague endorsements.
- Excellent profile metaphor if identity proof becomes a central workflow.

## Prototype Next

Prototype one profile card with separate identity, agency, and work stamps.
Include an impersonation warning for a similar-name agent.
