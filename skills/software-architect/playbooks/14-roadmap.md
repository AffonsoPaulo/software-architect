# Playbook 14 — Roadmap

## Objective

Organize everything defined in phases 00 through 13 into delivery milestones with dependencies — a synthesis of the project so far, not a new source of requirements. Stops short of individual tasks, which is phase 15 (Backlog)'s job, working from this document.

## When to run

Whenever `docs/project-state.md` marks phase 14 as included — in practice, almost always, since even a small project benefits from an explicit "what ships first" decision.

## When NOT to run

Skippable for a project so small that "everything ships as one milestone" is the entire answer, if Calibration determined a full roadmap adds no value at that scale. Even then, phase 15 (Backlog) still needs *something* to work from — a single implicit milestone covering everything, confirmed as such.

## Inputs

- Every approved document from phases 00–13 — this phase is a synthesis, not a fresh interview about new content. Its questions are about sequencing and grouping what's already confirmed, not about what the project does.

## Outputs

- `docs/14-roadmap/roadmap.md`.

## Documents produced

- `docs/14-roadmap/roadmap.md` via `templates/roadmap.md`.

## Mandatory questions

- What milestones/deliveries make sense (MVP, subsequent increments)?
- Is there a real deadline (a date), or is the roadmap relative (Milestone 1, Milestone 2...)? — never assume a date if the user hasn't provided one
- Dependencies between milestones (what blocks what)?
- "Done" criterion per milestone?

*Fully Dressed only* (`rules/documentation-depth.md`), per milestone:
- Does this milestone depend on anything outside the team's own control (a partner's API, a legal review, a third-party credential)?
- What business-level metric tells you this milestone actually worked once shipped?
- Are there risks specific to delivering this milestone, beyond the project-wide risk register?
- Who needs to know about progress/delays on this roadmap, how often, and through what channel?

## Optional questions

- Whether specific milestones warrant their own more detailed breakdown diagram, if the dependency graph is large enough that one diagram would be unreadable.

## Interview flow

1. Ask directly whether there's a real deadline before proposing any milestone structure — this determines whether the whole document uses relative or dated milestones, and asking it first avoids drafting dated milestones that then need to be walked back.
2. Propose a milestone grouping of the approved User Stories/Use Cases, starting with what looks like a natural MVP — the user confirms or restructures it, the AI never finalizes this alone.
3. Dependencies between milestones, once the grouping is settled.
4. Done criterion per milestone, concretely — not "it's finished" but what specifically must be true.
5. Walk the full list of approved `US-XXX`/`UC-XXX` at the end and confirm every single one is either in a milestone's `delivers` list or explicitly in `deferred` — this final sweep is what the gate checks mechanically, so it needs to actually happen in the interview, not be assumed complete.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). No question here is individually-confirmation-mandatory by default, but the final coverage sweep (step 5 above) is presented as a single list for the user to confirm as a whole, similar to Calibration's phase-inclusion list.

## How to document answers

Each confirmed milestone gets a stable name (no formal ID prefix reserved for milestones, per `rules/document-format.md`), its `Delivers` list of `US-XXX`/`UC-XXX`, dependencies on other milestones, and a done criterion. Anything confirmed as deferred goes in the "Deferred" section with its stated reason — never silently dropped from the document. At Fully Dressed depth, the additional answers map to `templates/roadmap.md`'s "Fully Dressed additions" section.

## How to validate answers

- "Has real dates" is set explicitly and accurately — `gantt` diagrams only appear if it's true.
- Every approved `US-XXX`/`UC-XXX` appears in exactly one milestone's `Delivers` list, or in "Deferred" with a reason — never in neither.
- Every milestone has a concrete, checkable done criterion.
- Milestone dependencies form a valid order (no cycles).

## Special cases

- **No real deadline provided**: milestones stay relative, and the diagram is a dependency `flowchart`, not a `gantt` — confirm this explicitly with the user rather than defaulting either way.
- **A Use Case/Story that doesn't fit any milestone yet**: goes to `deferred` with a reason — never quietly omitted because it didn't fit neatly into the grouping being discussed.
- **Small project, one implicit milestone**: still gets a real entry in `milestones` (even if it's the only one, covering everything) — phase 15 needs something concrete to reference, not an implied "just build it all."

## Common ambiguities

- The user gives a date that's actually a hope ("we'd like this by Q2") rather than a firm deadline — ask which it is; a soft target and a real constraint should be recorded differently, and "Has real dates" should reflect an actual commitment, not an aspiration.
- A milestone described only by feature names rather than by the actual `US-XXX`/`UC-XXX` it delivers — always resolve to the underlying approved IDs, not a restated feature list that could drift from what was actually approved.

## Frequent errors

- A User Story or Use Case left out of both `delivers` and `deferred` — this is exactly what the gate exists to catch, but it shouldn't need catching if the final sweep (interview step 5) actually happens.
- Assigning a real date because the user mentioned a general timeframe in passing, without confirming it as an actual commitment.
- Letting milestone scope creep into task-level detail that belongs in phase 15.

## Examples

> AI: "Before I propose milestones — is there a real deadline for any of this, or should the roadmap just be relative (Milestone 1, 2, 3...)?"
> User: "No hard deadline, just want to see it sequenced sensibly."
> AI: "Got it, relative milestones then, no gantt chart — I'll use a dependency flowchart instead. Proposing Milestone 1 (MVP): US-001 through US-005, covering account creation and basic order placement. Milestone 2: US-006 through US-009, covering refunds. Does this grouping make sense, or would you sequence it differently?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never assign a calendar date the user didn't actually confirm as real, and never let a User Story or Use Case go unaddressed by both `delivers` and `deferred` — that silent gap is exactly the kind of undocumented state this Skill exists to prevent.

## Checklist

`checklists/14-roadmap-checklist.md`

## Quality Gate

`quality-gates/14-roadmap-gate.md`. Summary: every milestone has a clear done criterion; 100% of approved User Stories are either delivered by a milestone or explicitly deferred with a reason.

## Approval criteria

This phase is done when every milestone has a done criterion and its `Delivers`/dependencies, every approved User Story/Use Case is accounted for (delivered or deferred), "Has real dates" accurately reflects what the user confirmed, and the user has explicitly confirmed the full roadmap.
