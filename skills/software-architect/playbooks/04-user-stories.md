# Playbook 04 — User Stories

## Objective

Convert approved functional requirements into User Stories in the standard "As a / I want to / so that" format, checked against INVEST criteria, ready to become Use Cases in phase 05. Every story exists because a requirement exists — this phase never introduces new capability, only reframes confirmed ones from the user's perspective.

## When to run

Whenever `docs/project-state.md` marks phase 04 as included. In practice this phase runs whenever phase 03 produced at least one functional requirement — see "When NOT to run."

## When NOT to run

Skippable only in the degenerate case where every requirement in this cycle is purely non-functional (no functional requirement exists to convert). Calibration decides this, but it's rare — most projects have at least one functional requirement.

## Inputs

- `docs/03-requirements/requirements.md` — approved, specifically its functional requirements.

## Outputs

- `docs/04-user-stories/user-stories.md`.

## Documents produced

- `docs/04-user-stories/user-stories.md` (index) plus one `docs/04-user-stories/us-XXX.md` per story, via `templates/user-stories.md` (`rules/document-locations.md`).

## Mandatory questions

- For each functional `REQ-XXX`: who is the persona/actor, what's the action, what's the benefit? ("As a [persona], I want to [action], so that [benefit]")
- What are the story's acceptance criteria (can inherit from the REQ, or be more granular)?
- Is the story independent and testable on its own (INVEST)?

*Fully Dressed only* (`rules/documentation-depth.md`), per story:
- What's the business-value reasoning behind this story's priority?
- Does this story have any non-functional consideration beyond the project's general NFRs?
- Is anything a reader might assume this story covers explicitly out of scope for it?
- Are there open questions about this story that don't block moving forward but should be tracked?

## Optional questions

- Preferred acceptance-criteria format (plain prose vs. Gherkin Given/When/Then) — ask once, at the start of this phase if not already settled during Calibration, and stay consistent for the rest of the document.

## Interview flow

1. Confirm acceptance-criteria format preference first, if not already known.
2. Walk through each functional `REQ-XXX` in order. For each: persona → action → benefit → acceptance criteria → a quick INVEST check.
3. If a requirement clearly serves more than one actor or is too large to deliver/test as one unit, split it into multiple stories here (see "Special cases") rather than forcing an oversized single story.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). No question here is individually-confirmation-mandatory by default (User Stories is not an always-strict category), but if a story implies a security- or architecture-relevant persona (e.g. an admin/privileged actor), treat that story's confirmation as individual regardless of mode, since it's downstream of an always-strict concern.

## How to document answers

Each confirmed story becomes its own `docs/04-user-stories/us-XXX.md` item file, `Traces to` set to its source `REQ-XXX` (or multiple, if it consolidates more than one requirement — rare, but valid), with a matching row added to `user-stories.md`'s index table. IDs come from `project-state.md`'s `id_sequences.US`. At Fully Dressed depth, the additional answers map to `templates/user-stories.md`'s "Fully Dressed additions" subsections.

## How to validate answers

- `traces_to` is set and points to a `REQ-XXX` that actually exists — never blank, never a dangling reference.
- The story is phrased as a capability from the actor's perspective, not restated implementation detail.
- INVEST holds well enough to proceed: in particular, Independent (doesn't hard-depend on another story to be testable) and Testable (the acceptance criteria are checkable).

## Special cases

- **Splitting a requirement into multiple stories**: split when the requirement serves multiple distinct actors, or when a single story covers more than one independently testable unit of value. Every resulting story keeps `traces_to` pointing to the same source `REQ-XXX`.
- **Non-functional requirements**: skipped entirely in this phase — they never get a `US-XXX` (see `rules/traceability-rules.md`). Do not manufacture a story for one just to give it traceability; that would be exactly the kind of invented artifact `rules/ai-invariants.md` prohibits.
- **Incremental cycle**: new stories continue the project's global `US` sequence; existing stories from prior cycles aren't reopened here — a change goes through `rules/change-management.md`.

## Common ambiguities

- A vague persona ("the user") when the project actually has multiple distinct actor types (e.g. "customer" vs. "support agent") — ask which specific actor this story is about rather than defaulting to a generic one.
- A "benefit" that just restates the action ("I want to log in, so that I can log in") — push for the actual value underneath.

## Frequent errors

- Leaving `traces_to` implicit instead of explicit — every story must show its source requirement, not just be adjacent to it in the document.
- Copying a requirement's acceptance criteria verbatim without checking whether the story-level framing needs its own, more specific criteria.
- Manufacturing a story for a non-functional requirement to avoid an apparent "gap" — the gap is expected, not an error (see `rules/traceability-rules.md`).

## Examples

> AI: "REQ-004 covers refund requests. Who's the actor here — is it only the customer, or does support also initiate refunds on a customer's behalf?"
> User: "Both, actually — customers self-serve, and support can do it manually for edge cases."
> AI: "That's two distinct stories then: US-006, 'As a customer, I want to request a refund for my order, so that I get my money back without contacting support,' and US-007, 'As a support agent, I want to issue a refund on a customer's behalf, so that I can resolve cases the self-serve flow doesn't cover.' Both trace to REQ-004. Does that split match what you meant?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a persona, action, or benefit not grounded in what the user confirmed for the source requirement.

## Checklist

`checklists/04-user-stories-checklist.md`

## Quality Gate

`quality-gates/04-user-stories-gate.md`. Summary: every `US-XXX` has a valid `traces_to` pointing to an existing `REQ-XXX`; no orphan stories; INVEST checked.

## Approval criteria

This phase is done when every functional requirement that needs a story has at least one, every story has a valid `traces_to`, and the user has explicitly confirmed the full list of stories.
