# Playbook 01 — Discovery

## Objective

Understand the problem, context, stakeholders, business objective, and initial constraints — without formalizing requirements yet (that's phase 03). Produces the Vision document that every later phase, especially Requirements, traces back to in prose.

## When to run

Whenever `docs/project-state.md` marks phase 01 as included for the active cycle (set in `playbooks/00-project-calibration.md`).

## When NOT to run

Skippable when Calibration determined the project context is already clear enough — most commonly in incremental mode, where the increment's context comes from the existing Vision plus the increment scope already captured in `calibration.md`. Never skippable for a brand-new project (cycle 1) — there is no Vision to skip in that case.

## Inputs

- `docs/00-calibration/calibration.md` — project type, size, and (if brownfield) the subagent's research summary, which may already answer part of "what exists today."

## Outputs

- `docs/01-discovery/vision.md`.

## Documents produced

- `docs/01-discovery/vision.md` via `templates/vision.md`.

## Mandatory questions

- What problem motivates this project? Who has this problem?
- Who are the primary users/stakeholders?
- What exists today (current system, competitors, manual process being replaced)?
- Known constraints (deadline, budget, mandated technology, regulatory) — `[confirmation individual]`
- How will success be measured?

## Optional questions

- Market context.
- History of prior attempts at solving this.
- Organizational constraints beyond the technical/regulatory ones already asked.

## Interview flow

1. Problem, and who has it — first, because everything else is easier to ask once this is grounded.
2. Target audience / stakeholders.
3. Current state (what exists today) — if brownfield research already ran in Calibration, propose what it found and confirm rather than asking from scratch.
4. Business objective and success criteria together — a vague objective is usually fixed by asking for the success criterion first ("how would you know in six months this worked?"), then restating the objective in those terms.
5. Constraints — `[confirmation individual]`.
6. Out of scope — explicitly asked, never left implicit.

## How to confirm answers

Standard loop, per `rules/confirmation-protocol.md`. No phase-specific nuance beyond the constraints question always being individually confirmed.

## How to document answers

Each confirmed answer maps directly to its `templates/vision.md` section. If an answer touches multiple sections (common for business objective / success criteria), split it across them rather than forcing one section to carry everything.

## How to validate answers

- The problem statement doesn't secretly describe a solution (see "Common ambiguities").
- The business objective is specific enough to be falsifiable, not just aspirational.
- At least one success criterion is genuinely measurable.
- "Out of scope" is not empty by omission — it was explicitly asked about, even if the answer is "nothing specific."

## Special cases

- **Brownfield project**: "current state" and part of "constraints" may already be partially answered by Calibration's subagent research (`rules/delegation-policy.md`). Present those findings and confirm rather than re-asking from zero — but still confirm, since subagent findings are facts to present, not decisions.
- **Incremental mode, phase included anyway**: if Calibration decided this increment does need a Discovery pass (e.g. the increment serves a materially different audience), scope the questions to the delta only — do not re-litigate the original Vision.

## Common ambiguities

- **Problem vs. solution**: if the user's answer to "what problem" is actually a feature description ("we need a dashboard that shows X"), separate the two — ask "what problem does having that solve?" and document the problem, not the dashboard. Note the solution idea for phase 03, don't lose it, but don't let it stand in for the problem statement here.
- **Vague business objectives**: "grow the business," "improve the product" — ask what specifically would change, and how it would be measured, before accepting the objective as stated.

## Frequent errors

- Accepting a success criterion that isn't actually measurable ("users will be happier").
- Letting requirements-level detail (specific features, flows, screens) creep into the Vision document instead of parking it for phase 03.
- Treating "out of scope" as optional to ask about.

## Examples

> AI: "You mentioned wanting 'a dashboard that shows order status in real time' — that's helpful, I'll carry it forward to Requirements. But first: what's the actual problem that not having this causes today? Is it that support staff can't answer 'where's my order' without checking three systems?"
> User: "Yes, exactly — support takes 10 minutes per ticket just to find the order status."
> AI: "Got it. Here's how I'll document the problem: 'Support staff cannot quickly determine order status, requiring an average of 10 minutes across three systems per ticket.' Is that accurate?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a business objective or success criterion the user hasn't stated, and never let an unconfirmed assumption about "what exists today" stand in for an actual answer.

## Checklist

`checklists/01-discovery-checklist.md`

## Quality Gate

`quality-gates/01-discovery-gate.md`. Summary: problem stated without ambiguity, target audience identified, at least one measurable success criterion, out-of-scope explicitly addressed.

## Approval criteria

This phase is done when `docs/01-discovery/vision.md` is fully written, contains no functional-requirement-level content, and the user has explicitly confirmed every section — including a measurable success criterion and an explicit out-of-scope statement.
