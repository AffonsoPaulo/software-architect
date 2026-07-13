# Playbook 12 — Testing

## Objective

Define the test strategy per level, ensuring every requirement has planned coverage before implementation starts — not writing the tests themselves, but deciding what will be tested, how, and at what level.

## When to run

Whenever `docs/project-state.md` marks phase 12 as included — in practice, always, for any project expecting to be maintained past its first release. Calibration may scope this down for a throwaway prototype, but the phase itself is rarely fully skipped.

## When NOT to run

Skippable only for genuinely disposable prototypes explicitly confirmed as such in Calibration, where no test coverage is expected to outlive the prototype.

## Inputs

- `docs/03-requirements/requirements.md` — approved.
- `docs/05-use-cases/use-cases.md` — approved.

## Outputs

- `docs/12-testing/testing.md`.

## Documents produced

- `docs/12-testing/testing.md` via `templates/testing.md`.

## Mandatory questions

- Test levels to adopt (unit, integration, e2e, contract) and preferred tooling, if already known — `[confirmation individual]`
- Coverage target (if applicable) and "done" criterion per test kind?
- Test data strategy (fixtures, mocks, dedicated environment)?
- Which requirements need manual/exploratory testing vs. which are automatable?

## Optional questions

- Whether specific Use Cases warrant their own end-to-end test scenario beyond the requirement-level coverage.

## Interview flow

1. Test levels and tooling first — `[confirmation individual]` — this frames what's even possible for the rest of the interview.
2. Coverage target and "done" criterion.
3. Test data strategy.
4. Walk the functional requirements from phase 03 one at a time, assigning at least one `TEST-XXX` each, deciding level and automated-vs-manual explicitly per one.
5. For non-functional requirements: a validation strategy, not necessarily a classic test — ask specifically what would demonstrate this NFR is actually met.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Test levels/tooling is individually confirmed since it shapes significant downstream tooling decisions; individual test plan entries can be confirmed in batch in Agile mode unless a specific one involves an always-strict concern (e.g. testing a payment flow).

## How to document answers

Each confirmed test plan becomes a `TEST-XXX` entry, `traces_to` set to its source `REQ-XXX`. `kind` (automated/manual) is recorded exactly as confirmed — never assumed to be automated by default.

## How to validate answers

- 100% of functional `REQ-XXX` entries have at least one `TEST-XXX`.
- Every non-functional requirement (performance, security) has a stated validation strategy, even if it isn't a classic automated test.
- `kind` is explicit and honest for every test plan — not defaulted.

## Special cases

- **A requirement needing multiple test levels**: valid — e.g. a unit test for the logic plus an e2e test for the full flow. Both get their own `TEST-XXX`, both trace to the same `REQ-XXX`.
- **Non-functional requirement with no obvious "test"**: still needs an explicit validation strategy — a load test, a manual checklist item, a scheduled security review. Never left with no plan because it doesn't fit the classic unit/integration/e2e mold.

## Common ambiguities

- "We'll test it manually for now, automate later" treated as equivalent to no plan — it's a valid `kind: manual` answer if that's genuinely the plan, but it needs to be recorded as such, not left implicit or silently assumed to become automated later without anyone deciding when.
- A single `TEST-XXX` that vaguely covers "the whole feature" — push for enough specificity that it's possible to tell whether the test is passing or failing, tied to the requirement's actual acceptance criterion.

## Frequent errors

- A functional requirement with no test plan at all.
- Marking a test `kind: automated` when what's actually been decided is a manual check.
- Non-functional requirements silently skipped because they don't map neatly to a unit/integration/e2e test.

## Examples

> AI: "REQ-004 (refund within 30 days) — I'm proposing TEST-004, an integration test verifying a refund request outside the window is rejected with the correct error, and TEST-005, a unit test on the date-boundary logic itself. Both automated. Does that split make sense, or would you rather cover this with just one test?"
> User: "That's fine, but also add a manual test case for the support-initiated refund path — we don't have automated coverage for the admin panel yet."
> AI: "Adding TEST-006, kind: manual, tracing to REQ-004 as well, covering the support-initiated path specifically. Confirm?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a test plan that sounds reasonable without confirming its actual acceptance criterion against the source requirement, and never default a test's `kind` to "automated" when manual is what was actually decided.

## Checklist

`checklists/12-testing-checklist.md`

## Quality Gate

`quality-gates/12-testing-gate.md`. Summary: 100% of functional requirements have at least one test plan; every non-functional requirement has a stated validation strategy; `kind` is explicit for every test plan.

## Approval criteria

This phase is done when every functional requirement has at least one confirmed test plan, every non-functional requirement has a validation strategy, and the user has explicitly confirmed the full testing approach.
