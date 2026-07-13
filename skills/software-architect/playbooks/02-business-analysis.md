# Playbook 02 — Business Analysis

## Objective

Model the business processes, actors, and high-level business rules that bridge Discovery's problem statement and phase 03's formal requirements. Produces the `BR-XXX` rules that Requirements will (optionally) trace back to.

## When to run

Whenever `docs/project-state.md` marks phase 02 as included for the active cycle.

## When NOT to run

Skippable for projects with no meaningful business-process dimension — e.g. an internal developer tool or a project with no distinct business actors/policies beyond "the user wants X." Calibration decides this; if skipped, phase 03 (Requirements) draws directly from Vision instead of from Business Analysis.

## Inputs

- `docs/01-discovery/vision.md` — approved.

## Outputs

- `docs/02-business-analysis/business-analysis.md`.

## Documents produced

- `docs/02-business-analysis/business-analysis.md` via `templates/business-analysis.md`.

## Mandatory questions

- What business processes are involved? (current flow, step by step)
- Who are the business actors/roles? (not UX personas yet — business roles)
- What high-level business rules are already known (policies, legal/regulatory constraints)? — `[confirmation individual]`
- What's the value/justification (ROI, cost reduction, new market)?

**Fully Dressed only** (`rules/documentation-depth.md`):
- Does the to-be process differ from as-is? If so, how, step by step?
- What metric/KPI measures each process, and what's its current value?
- Per process step: who's Responsible, Accountable, Consulted, Informed (RACI)?
- What are the quantified pain points in the current process (time, cost, error rate)?
- Who beyond the actors already listed is organizationally affected by this project?

## Optional questions

- Future/to-be process, if it differs meaningfully from the current one.
- Secondary or edge-case actors not central to the main flow.

## Interview flow

1. Business processes first — ask for the current (as-is) flow step by step.
2. Actors — usually surface naturally while describing the process; confirm the list explicitly afterward rather than only inferring it.
3. Business rules — ask directly, since these often don't come up naturally in a process narrative (they're the "what's not allowed" or "what must always be true," not steps).
4. Justification/value — last, since it's often easier to articulate once the process and rules are laid out.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Business rules are always individually confirmed, since they tend to have direct downstream effect on Requirements.

## How to document answers

- Each process becomes its own subsection with a numbered step list and a Mermaid `flowchart` (`rules/diagram-conventions.md`).
- Each business rule gets a new `BR-XXX` (next value from `project-state.md`'s `id_sequences.BR`), declared as its own heading with a full sentence statement underneath, per `rules/document-format.md`.
- Actors are listed once, cross-referenced from whichever processes they participate in.
- At Fully Dressed depth, the additional answers map to `templates/business-analysis.md`'s "Fully Dressed additions" section.

## How to validate answers

- Every process has at least one identified actor — this is a gate criterion, not optional polish.
- Every business rule is stated as an actual policy/constraint, not a restated process step.
- The justification reflects what the user said, not a generic ROI narrative constructed by the AI.

## Special cases

- **No real business-process dimension**: if, during the interview, it becomes clear this project genuinely has none (e.g. a personal utility script), stop and confirm with the user whether this phase should be marked skipped retroactively — do not force a thin, invented process onto a project that doesn't have one.
- **Brownfield**: if Calibration's subagent research surfaced existing business logic in code, present it as a starting point for the process/rules questions, not as a substitute for asking.

## Common ambiguities

- **Business actor vs. UX persona**: a business actor is a role in the process ("Finance Approver"); a UX persona is a user-experience characterization that comes later (Frontend Planning, if that phase runs). Don't let persona-level detail creep in here.
- **Business rule vs. process step**: "the approver checks the amount" is a step; "purchases over $10,000 require dual approval" is a rule. If the user's answer is really a step, it likely belongs in the process description, not the rules list.

## Frequent errors

- Recording a process with no actor and treating "add the actor later" as acceptable — it isn't; the gate will reject it.
- Inventing a business rule that sounds plausible for this kind of project instead of asking.
- Letting "justification" become a generic AI-written business case instead of the user's actual reasoning.

## Examples

> AI: "You described the refund process — customer requests, support checks the purchase date, approves or denies. Is 'must be within 30 days of purchase' a hard rule, or is there discretion?"
> User: "Hard rule, no exceptions."
> AI: "Recording BR-001: 'Refunds are only approved for purchases made within 30 days; no exceptions.' Correct?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a business rule the user hasn't stated, even one that seems like an obvious default for this domain.

## Checklist

`checklists/02-business-analysis-checklist.md`

## Quality Gate

`quality-gates/02-business-analysis-gate.md`. Summary: every process has at least one actor; every business rule is a genuine policy/constraint with a `BR-XXX` ID; justification reflects the user's stated reasoning.

## Approval criteria

This phase is done when `docs/02-business-analysis/business-analysis.md` is fully written, every process has an identified actor, every business rule has a confirmed `BR-XXX` entry, and the user has explicitly confirmed the justification section.
