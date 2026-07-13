# Playbook 16 — Implementation Plan

## Objective

Sequence the approved Backlog into an actual build order, with technical dependencies between tasks and a Definition of Done per task. **This is the last document produced before the final Review gate (phase 17).** After this phase, nothing about the project's plan changes except what Review's audit catches and routes through a Change Request — this playbook is the last point where new planning content is written under normal flow.

## When to run

Whenever `docs/project-state.md` marks phase 16 as included — in practice, whenever phase 15 (Backlog) ran.

## When NOT to run

Skippable only alongside Backlog, for a project too small to benefit from either — even then, Review (phase 17) still needs *something* to audit, so an implicit single-task plan should exist if Backlog produced anything at all.

## Inputs

- `docs/15-backlog/backlog.md` — approved.
- `docs/07-database-design/database.md`, `docs/08-architecture/architecture.md`, `docs/09-api-design/api.md` — approved, as the source of technical dependencies (e.g. schema must exist before an endpoint that uses it).

## Outputs

- `docs/16-implementation-plan/implementation-plan.md`.

## Documents produced

- `docs/16-implementation-plan/implementation-plan.md` via `templates/implementation-plan.md`.

## Mandatory questions

- Technical build order of the `TASK-XXX` items (what needs to exist before what — e.g. database schema before the endpoint that uses it)?
- Definition of Done per task (tests passing, code review, documentation updated) — `[confirmation individual]` the first time it's defined.
- Which tasks can be parallelized vs. must be sequential?

**Fully Dressed only** (`rules/documentation-depth.md`):
- Who owns each task, and what's its estimate?
- For tasks with a real execution risk: what could go wrong during implementation, and how is it mitigated?
- Which sequence of tasks forms the critical path — the chain where any delay directly delays the whole plan?

## Optional questions

- Whether specific tasks warrant splitting further at this stage if their technical dependencies turn out to be more granular than the Backlog captured.

## Interview flow

1. Definition of Done first, once — `[confirmation individual]` — since every task after is measured against it.
2. Walk the Backlog's tasks and derive technical dependencies from the already-approved Database Design, Architecture, and API Design — schema before the endpoints that use it, a shared component before the tasks that depend on it, and so on. Propose an order, the user confirms or corrects it.
3. Identify which tasks can run in parallel, once the dependency structure is settled.
4. A final check for cycles — if the proposed dependencies create one, resolve it with the user before finalizing (see "Special cases").

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Definition of Done is individually confirmed the first time; once set, reused without re-confirming from scratch. The proposed sequence as a whole is confirmed similarly to Roadmap's milestone list — the AI proposes a full ordering, the user confirms or edits it, rather than confirming each dependency edge in isolation.

## How to document answers

Each task's row in the "## Sequence" table (`rules/document-format.md`) gets its `Depends on` and, where relevant, `Parallelizable with` — derived from the already-approved technical documents, not invented. `TASK-XXX` is never repeated as a heading here — it's already declared once in `docs/15-backlog/backlog.md` (see `templates/implementation-plan.md`'s notes). Definition of Done is recorded once at the top level. At Fully Dressed depth, the additional answers map to `templates/implementation-plan.md`'s "Fully Dressed additions" section (Owner/Estimate columns, Risk mitigation, Critical path).

## How to validate answers

- Every task referenced actually exists in the Backlog — no new work introduced here.
- No dependency cycles, direct or transitive.
- Every task has a Definition of Done (inherited from the standard, or an explicitly stated addition).

## Special cases

- **A proposed dependency creates a cycle**: this usually means two tasks are actually one task artificially split, or a dependency was stated backwards — resolve with the user which is actually true rather than recording a plan that can't execute.
- **A task with no clear technical dependency**: valid — not everything blocks or is blocked by something else. Leave `depends_on` empty rather than inventing a dependency to make the document look more structured than the reality.

## Common ambiguities

- "These should probably happen in this order" without a concrete technical reason — ask what specifically would break if the order were reversed; if nothing would, it's not a real dependency, just a preference, and doesn't need to be recorded as `depends_on`.
- Definition of Done treated as equivalent to the Testing phase's test plans — DoD is broader (review, docs, deployment readiness), not just "tests exist"; make sure it isn't collapsed into just that.

## Frequent errors

- A task depending on one that doesn't exist in the Backlog.
- An undetected dependency cycle.
- Treating Definition of Done as a formality and accepting a vague answer ("code is good") instead of a concrete, checkable one.

## Examples

> AI: "TASK-003 (refund endpoint) needs the orders table from Database Design, which is TASK-001's job (schema setup). So TASK-003 depends_on TASK-001. Does TASK-003 also need the Order Service component from Architecture set up first, or is that bundled into TASK-001?"
> User: "Separate task — TASK-002 sets up the Order Service scaffold, TASK-003 depends on both TASK-001 and TASK-002."
> AI: "Got it, recording TASK-003 with depends_on: [TASK-001, TASK-002]. Those two can run in parallel with each other since neither depends on the other — confirm?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a technical dependency that sounds plausible without grounding it in the actual approved Database/Architecture/API documents, and never introduce a task here that doesn't already exist in the Backlog.

## Checklist

`checklists/16-implementation-plan-checklist.md`

## Quality Gate

`quality-gates/16-implementation-plan-gate.md`. Summary: no task depends on one that doesn't exist in the Backlog; no dependency cycle; every task has a Definition of Done.

## Approval criteria

This phase is done when every task's dependencies are grounded in real, existing Backlog items with no cycles, every task has a Definition of Done, and the user has explicitly confirmed the full sequence — after which the project moves to the final Review gate (phase 17), the last checkpoint before implementation may begin.
