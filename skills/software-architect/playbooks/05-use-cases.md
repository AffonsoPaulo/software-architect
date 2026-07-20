# Playbook 05 — Use Cases

## Objective

Detail the interaction flows — main, alternative, and exception — behind each User Story or closely related group of stories. This is where "what can go wrong at each step" gets asked explicitly, not left implicit, and where the entities that will become the Domain Model (phase 06) first become visible in concrete flows.

## When to run

Whenever `docs/project-state.md` marks phase 05 as included. Runs for any User Story complex enough to have more than one meaningful path through it.

## When NOT to run

Skippable for trivial stories where the main flow has no realistic alternative/exception path worth documenting (rare, but possible for very simple internal tools). Calibration decides this at the project level; a specific simple story can still get a short use case even if the phase overall runs.

## Inputs

- `docs/04-user-stories/user-stories.md` — approved.

## Outputs

- `docs/05-use-cases/use-cases.md`.

## Documents produced

- `docs/05-use-cases/use-cases.md` (index) plus one `docs/05-use-cases/uc-XXX.md` per use case, via `templates/use-cases.md` (`rules/document-locations.md`).

## Mandatory questions

- Primary actor, and secondary actors (other systems/actors involved)?
- Preconditions and postconditions?
- Main flow, step by step?
- Alternative and exception flows — what can go wrong at each step? — `[confirmation individual]` when it involves critical error handling (payment, sensitive data)

*Fully Dressed only* (`rules/documentation-depth.md`):
- What's the actor's goal in context, stated in business terms — not the mechanics, the purpose?
- What specific event triggers this use case?
- What's guaranteed no matter how the use case ends (minimal guarantees), beyond what's guaranteed only on success?
- Does this use case have special requirements (NFRs) beyond the project's general ones?
- Does this use case vary by technology or data source (e.g. mobile vs. desktop)?
- Roughly how often does this use case occur?

## Optional questions

- Whether a `stateDiagram` is warranted in addition to the `sequenceDiagram`, for use cases centered on an entity with meaningful state transitions.

## Interview flow

1. Actor(s) and pre/postconditions first — this frames what "success" and "who's involved" mean before walking the flow.
2. Main flow, step by step, in order.
3. For each step in the main flow: ask explicitly what could go wrong there, not just at the end of the interview — asking per-step surfaces exception flows the user wouldn't think to volunteer if just asked "any exceptions?" at the end.
4. Postcondition, confirmed last, once the flow (including exceptions) is settled — it needs to reflect what "done" actually means given everything that can happen.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Any alternative/exception flow touching payment or sensitive data is always individually confirmed, regardless of mode — this is called out explicitly in `templates/use-cases.md` as well, so the rule is visible at the point of documentation, not just in this playbook.

## How to document answers

Each confirmed use case becomes its own `docs/05-use-cases/uc-XXX.md` item file, `Traces to` set to its source `US-XXX` (or multiple, if consolidating related stories), with a matching row added to `use-cases.md`'s index table. Main flow and alternative flows are numbered/linked per step. Diagrams follow `rules/diagram-conventions.md`: `sequenceDiagram` for multi-actor main flows, `stateDiagram` added when the use case concerns a stateful entity. At Fully Dressed depth, the additional answers map to `templates/use-cases.md`'s "Fully Dressed additions" subsections — including "Success guarantees," which is the same content as Casual's "Postconditions," renamed to match Cockburn's convention.

## How to validate answers

- `traces_to` is set and points to an existing `US-XXX`.
- At least one postcondition is present — a use case with no stated postcondition is incomplete, not minimal.
- Every main-flow step carrying real failure risk has a corresponding alternative/exception flow — not necessarily every step (trivial steps don't need one), but every risky one does.

## Special cases

- **Use case consolidating multiple stories**: when several `US-XXX` describe the same interaction from different angles (e.g. customer-initiated vs. support-initiated refund), one `UC-XXX` may cover both if the flows are genuinely the same shape — list every story it traces to. If the flows actually differ meaningfully, keep them as separate use cases even if they share a `traces_to` target.
- **Trivial story, thin use case**: still needs at least a main flow and a postcondition — "thin" is fine, "missing" is not.

## Common ambiguities

- User describes only the happy path and says "that's it, nothing else can go wrong" — probe specifically: what if the input is invalid, what if a dependency is unavailable, what if the user cancels partway through. Don't accept "nothing else happens" without at least checking these categories.
- Confusing a precondition with a main-flow step — a precondition is true *before* the use case starts (e.g. "user is authenticated"), not something that happens during it.

## Frequent errors

- Accepting a use case with a happy path but no postcondition.
- Skipping the individual confirmation for a payment/sensitive-data exception flow because the project is running in Agile mode — this category is always-strict regardless of mode.
- Treating "what could go wrong" as a single end-of-interview question instead of asking it at each risky step.

## Examples

> AI: "Main flow so far: (1) customer selects order to refund, (2) system checks eligibility against BR-001's 30-day window, (3) system processes the refund. At step 2 — what happens if the order is outside the 30-day window?"
> User: "Show an error explaining why, and offer a support contact link."
> AI: "Recording that as an alternative flow at step 2: 'If outside the 30-day window, display an error explaining the policy and a link to contact support; do not proceed to step 3.' Since step 3 involves a monetary transaction, I'll also confirm this one individually rather than batching it — correct so far?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent an alternative/exception flow that sounds plausible without asking — and never skip the individual-confirmation requirement for payment/sensitive-data exception handling just because the rest of the phase is running in Agile mode.

## Checklist

`checklists/05-use-cases-checklist.md`

## Quality Gate

`quality-gates/05-use-cases-gate.md`. Summary: every `UC-XXX` traces to an existing `US-XXX`; every use case has at least one postcondition; every failure-risk step has a corresponding exception flow.

## Approval criteria

This phase is done when every use case has a valid `traces_to`, at least one postcondition, exception flows for every real failure-risk step, and the user has explicitly confirmed each use case — including individual confirmation for any payment/sensitive-data exception flow.
