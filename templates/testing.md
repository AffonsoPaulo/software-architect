# Testing — Template

Saved at `docs/12-testing/testing.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/12-testing.md`. Defines the test strategy per level, ensuring every requirement has planned coverage before implementation starts. Each test plan item is a heading followed by an italic metadata line, per `rules/document-format.md`.

## Structure (Casual)

```markdown
# Testing

## Test levels
<Confirmed levels — unit / integration / e2e / contract / other,
`[confirmation individual]` — and preferred tooling, if already known.>

## Coverage target
<A number/threshold if applicable, or "not applicable" — never left
ambiguous.>

## Test data strategy
<Fixtures / mocks / dedicated environment / combination.>

## Test plans

### TEST-001 — <short title>
*Traces to: REQ-004 · Level: Integration · Kind: Automated*

<What this test verifies, specific enough to know when it's failing —
inherited from the REQ's acceptance criteria; the test exists to check
exactly this, not a loosely related behavior.>
```

`Kind` is `Automated` or `Manual` — required, explicit. Never left implicit which a requirement's test actually is.

## Fully Dressed additions

```markdown
## Entry/exit criteria
<What must be true before testing for a given level/milestone can start
(entry), and what must be true for it to be considered done (exit) —
e.g. "entry: staging environment matches production config; exit: 100%
of Must-have REQs have a passing TEST-XXX.">

## Test environment
<What environment(s) tests run against — dedicated test env, ephemeral
per-branch environments, production with feature flags — and how it's
kept representative of production.>

## Defect management
<How a failing test/found bug is tracked, triaged, and prioritized —
tool used, severity levels, who triages. Can point to an existing
org-wide process instead of inventing one.>

## Risk-based prioritization
<Which areas get the most testing investment and why — tied to the
Risk-based reasoning, not just "test everything equally." E.g. "payment
flow gets the deepest coverage; the about page gets a single smoke
test.">

### TEST-001 — <short title>
*Traces to: REQ-004 · Level: Integration · Kind: Automated*

<description, as in Casual>

**Non-functional test detail**
<Only for TEST-XXX items covering NFRs — the actual threshold being
tested and how, e.g. "load test: 500 concurrent users, assert p95 <
300ms, using k6." "(n/a) — functional test" for the rest.>
```

## Notes for whoever fills this in

- **Every functional `REQ-XXX` needs at least one `TEST-XXX`** — this is the gate's primary scriptable check, validated against `docs/03-requirements/requirements.md` by `scripts/validate-traceability.mjs`.
- **Non-functional requirements** (performance, security) still need a validation strategy — not necessarily a classic automated test, but something explicit: a load test, a manual security review checklist item, a penetration test — never left with no plan at all just because it isn't a unit test.
- **`Kind: Automated` vs. `Kind: Manual` must be explicit and honest** — do not mark something automated because it should be, if what's actually planned is a manual check. The distinction matters for planning later phases (Deployment's CI gates, for one).
- `TEST-XXX` IDs come from `project-state.md`'s `id_sequences.TEST`, global to the project.
