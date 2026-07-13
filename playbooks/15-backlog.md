# Playbook 15 — Backlog

## Objective

Break the approved Roadmap's milestones into prioritized work items, ready to feed the sequenced Implementation Plan (phase 16). Still not implementation detail — items are units of work, not step-by-step instructions.

## When to run

Whenever `docs/project-state.md` marks phase 15 as included — in practice, whenever phase 14 (Roadmap) ran.

## When NOT to run

Skippable only alongside Roadmap, for a project too small to benefit from either.

## Inputs

- `docs/14-roadmap/roadmap.md` — approved.

## Outputs

- `docs/15-backlog/backlog.md`.

## Documents produced

- `docs/15-backlog/backlog.md` via `templates/backlog.md`.

## Mandatory questions

- For each Roadmap milestone: what backlog items compose it (can derive 1:1 from User Stories/Use Cases, or be more granular — e.g. infrastructure setup)?
- Relative priority within the milestone?
- "Ready for development" criterion (Definition of Ready) per item — `[confirmation individual]` the first time it's defined, then reused as the project's standing standard afterward.

**Fully Dressed only** (`rules/documentation-depth.md`), per item:
- What's the estimate (points or time), if one exists yet?
- Does this item depend on any other backlog item for planning purposes?
- What concrete scenario(s) confirm this item is actually done?

## Optional questions

- Whether specific items warrant splitting further at this stage, or whether that's better left to phase 16's sequencing.

## Interview flow

1. Definition of Ready first, once — `[confirmation individual]` — since every item after is measured against it.
2. Walk each milestone from the Roadmap in order, deriving backlog items for each User Story/Use Case it delivers, plus any supporting items (setup, infrastructure) needed to make those deliverable.
3. Priority within each milestone, once its items are listed.
4. A final sweep confirming every User Story in a currently-included milestone has at least one backlog item — mirrors Roadmap's own final coverage sweep, one level down.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Definition of Ready is individually confirmed the first time; once set, later phases/cycles reuse it without re-confirming from scratch unless the user wants to change it.

## How to document answers

Each confirmed item becomes a `TASK-XXX` heading grouped under its milestone, `Traces to` set to its source `US-XXX`/`UC-XXX`, tagged with its priority, status starting at `Not started`, per `rules/document-format.md`. IDs come from `project-state.md`'s `id_sequences.TASK`. At Fully Dressed depth, the additional answers map to `templates/backlog.md`'s "Fully Dressed additions" subsections.

## How to validate answers

- Every `TASK-XXX` has `traces_to` pointing to a real `US-XXX` or `UC-XXX` — no item invented without lineage.
- Every User Story belonging to a currently-included milestone has at least one corresponding backlog item.
- Definition of Ready is recorded once and applied consistently, not redefined per item.

## Special cases

- **Non-story item (infrastructure, setup, tooling)**: still needs `traces_to` — trace it to whichever User Story/Use Case it exists to support, even if the connection is enabling rather than direct (e.g. "database migration setup" traces to the first story that needs persistence).
- **Deferred milestone from the Roadmap**: its User Stories don't need backlog items yet — only items for milestones actually included in the current roadmap pass need coverage.
- **Incremental cycle**: new backlog items continue the project's global `TASK` sequence; items from prior cycles aren't reopened here.

## Common ambiguities

- An item that's really a restatement of its User Story rather than an actual unit of work — if "TASK: implement US-006" adds nothing beyond the story itself, ask whether it should just stay 1:1 with the story or actually needs decomposition.
- Priority described relative to "importance" in the abstract rather than relative order within this specific milestone — ground it in "which of these would you want done first if you could only do one this week," not an abstract importance rating.

## Frequent errors

- A backlog item with no `traces_to`, or one pointing to something that doesn't exist.
- A User Story in an included milestone left with zero backlog items.
- Re-litigating Definition of Ready per item instead of confirming it once and reusing it.

## Examples

> AI: "Milestone 1 (MVP) includes US-001 through US-005. For US-001 ('customer creates an account'), I'm proposing a single backlog item, TASK-001, since the story is small enough not to need splitting. Does that match, or would you break it down further?"
> User: "Split out email verification as its own item — we might defer it to a fast-follow if we're tight on time."
> AI: "Adding TASK-002, 'email verification flow,' tracing to US-001 as well, separate from TASK-001. Both still in Milestone 1 unless you'd rather move TASK-002 to a later milestone now."

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a backlog item without a User Story or Use Case behind it, even a plausible-sounding infrastructure task — trace it to what it actually enables.

## Checklist

`checklists/15-backlog-checklist.md`

## Quality Gate

`quality-gates/15-backlog-gate.md`. Summary: every backlog item traces to a real User Story or Use Case; every User Story in a currently-included milestone has at least one corresponding item.

## Approval criteria

This phase is done when every backlog item has a valid `traces_to`, every relevant User Story is covered, Definition of Ready is confirmed, and the user has explicitly confirmed the full backlog.
