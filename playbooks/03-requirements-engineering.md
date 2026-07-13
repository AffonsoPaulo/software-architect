# Playbook 03 — Requirements Engineering

## Objective

Formalize functional and non-functional requirements, testable acceptance criteria, business rule links, priorities, and edge cases. This is the phase most directly named in the Skill's founding brief, with a specific Quality Gate example that this playbook's gate reproduces literally, not as a paraphrase. Requirements is the first document in the formal traceability graph — everything from User Stories onward ultimately traces back to a `REQ-XXX` here.

## When to run

Always. This phase is never skippable — see `playbooks/00-project-calibration.md`, which lists Requirements as one of the four always-mandatory phases regardless of project size.

## When NOT to run

Never. Even a small or incremental cycle still runs this phase, though the number of requirements it produces may be small.

## Inputs

- `docs/01-discovery/vision.md` — approved.
- `docs/02-business-analysis/business-analysis.md` — approved, if this phase ran (its `BR-XXX` rules feed requirements here). If Business Analysis was skipped, requirements are derived directly from Vision instead.

## Outputs

- `docs/03-requirements/requirements.md`.

## Documents produced

- `docs/03-requirements/requirements.md` (index) plus one `docs/03-requirements/req-XXX.md` per requirement, via `templates/requirements.md` (`rules/document-locations.md`).

## Mandatory questions

- For each capability identified in Discovery/Business Analysis: what is the exact functional requirement, with a testable acceptance criterion?
- Non-functional requirements: performance, availability, scalability, usability, compliance — `[confirmation individual]`
- Edge cases and error scenarios for each functional requirement.
- Priority of each requirement (must/should/could, MoSCoW, or an equivalent scheme confirmed with the user).

**Fully Dressed only** (`rules/documentation-depth.md`), per requirement:
- Why does this requirement exist — what's the rationale behind it, beyond the business rule it may trace to?
- What's the source — a named stakeholder, a regulation, a prior incident, an existing system's behavior being preserved?
- What concretely goes wrong if this requirement isn't met, and how severe is that?
- How will this requirement actually be verified — automated test, manual review, external audit?
- Does this requirement depend on or conflict with any other requirement?

## Optional questions

- Whether the user wants acceptance criteria in Gherkin (Given/When/Then) format or plain prose — either is fine, but ask once and stay consistent for the rest of this document.

## Interview flow

1. Walk through each capability surfaced in Vision/Business Analysis one at a time — for each, get the functional requirement statement, then its acceptance criteria, then its edge cases, then its priority, before moving to the next capability. Asking all four in sequence per requirement produces a more complete requirement than batching all descriptions first and circling back for criteria later.
2. Once functional requirements are done, move to non-functional requirements as their own pass — these usually don't map 1:1 to a single capability.
3. Link each functional requirement to a `BR-XXX` where one applies — ask, don't infer, even when the link seems obvious.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Non-functional requirements are always individually confirmed. A functional requirement's core statement and acceptance criteria are effectively one unit for confirmation purposes — confirm them together once both are drafted, rather than confirming a bare statement before criteria exist to evaluate it against.

## How to document answers

Each confirmed requirement becomes its own `docs/03-requirements/req-XXX.md` item file, per `templates/requirements.md` and `rules/document-locations.md`, with a matching row added to `requirements.md`'s index table. `REQ-XXX` numbers come from `project-state.md`'s `id_sequences.REQ`. At Fully Dressed depth, the additional answers map to that template's "Fully Dressed additions" subsections (Rationale, Source, Risk if not met, Verification method, Dependencies) and `Status` starts at `Approved` once confirmed.

## How to validate answers

Per requirement, exactly the five checks from this Skill's founding brief — not a paraphrase:

1. **Complete** — the requirement statement is a full, self-contained capability, not a fragment.
2. **Acceptance criteria** — at least one, and each is genuinely testable (pass/fail determinable), not aspirational.
3. **Business rules** — linked to a `BR-XXX` where one applies; explicitly noted as "no applicable business rule" when none does, not silently left blank.
4. **Edge cases** — at least one scenario where the requirement's normal behavior doesn't straightforwardly apply.
5. **Ambiguities** — the wording has no reasonable second interpretation; if the AI can construct two different valid readings, it isn't done.

## Special cases

- **Non-functional requirement with no natural User Story**: this is expected, not an error. It traces directly to `ARCH-XXX` (phase 08) and/or `SEC-XXX` (phase 11) instead of a `US-XXX` (phase 04) — see `rules/traceability-rules.md`. Note this explicitly next to the requirement so phase 04 doesn't treat it as a missed link.
- **Business Analysis was skipped**: requirements still need testable acceptance criteria and edge cases; they simply won't have a `BR-XXX` link, which is a documented exception, not a gap.
- **Incremental cycle**: new requirements in this cycle get new `REQ-XXX` IDs continuing the project's global sequence; existing requirements from prior cycles are not re-opened here — a change to one goes through `rules/change-management.md`.

## Common ambiguities

- A requirement phrased as a UI detail ("there should be a button that...") often hides the actual capability — ask what the button does, and state the requirement in terms of the capability, not the widget (which belongs to Frontend Planning, phase 10, if it runs).
- "The system should be fast/secure/reliable" as a non-functional requirement — always push for a specific, measurable threshold before accepting it.

## Frequent errors

- Accepting a requirement with only one acceptance criterion when the described behavior clearly has more than one condition worth checking.
- Leaving a requirement's business-rule link blank instead of explicitly confirming "no applicable rule."
- Treating a requirement as unambiguous because the AI has a confident interpretation — ambiguity is about whether a *different* reasonable reading exists, not about the AI's own confidence.

## Examples

> AI: "For the refund capability: REQ-004 — 'Users can request a refund for an order within 30 days of purchase, tied to BR-001.' Acceptance criteria: (1) a refund request outside 30 days is rejected with a clear reason shown to the user; (2) an approved refund updates the order status within 5 seconds. Edge case: what happens if the order was already partially refunded? Is a second partial refund allowed up to the remaining balance, or is any further refund blocked?"
> User: "Blocked — one refund per order, full or partial, no exceptions."
> AI: "Updating edge case: 'A second refund attempt on an order with an existing refund is blocked, regardless of whether the first was full or partial.' Confirm?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent an acceptance criterion or edge case that sounds reasonable for this kind of requirement instead of asking — a plausible-sounding edge case the user never confirmed is exactly the kind of undocumented assumption this Skill exists to prevent.

## Checklist

`checklists/03-requirements-engineering-checklist.md`

## Quality Gate

`quality-gates/03-requirements-engineering-gate.md`. Summary, per requirement: complete, has acceptance criteria, business rule link resolved (present or explicitly none), has edge cases, no unresolved ambiguity. If any of the five fails for a given requirement, the gate fails for that requirement specifically — it reopens that requirement's question, not the whole phase.

## Approval criteria

This phase is done when every requirement in `docs/03-requirements/requirements.md` passes all five checks, every non-functional requirement has been individually confirmed, and the user has given final confirmation of the complete requirements list.
