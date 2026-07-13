# Testing — Template

Saved at `docs/12-testing/testing.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/12-testing.md`. Defines the test strategy per level, ensuring every requirement has planned coverage before implementation starts.

## Structure

```yaml
---
levels: ["unit", "integration", "e2e"]
# whichever levels are confirmed as relevant — unit | integration | e2e |
# contract | other, `[confirmation individual]`
tooling: "<preferred tools, if already known>"
coverage_target: "<a number/threshold if applicable, or 'not applicable' — never left ambiguous>"
test_data_strategy: "<fixtures | mocks | dedicated environment | combination>"
test_plans:
  - id: TEST-001
    traces_to: ["REQ-004"]
    # REQUIRED — every REQ-XXX needs at least one TEST-XXX. Never blank.
    level: "integration"
    kind: "automated"
    # "automated" | "manual" — REQUIRED, explicit. Never left implicit which
    # a requirement's test actually is.
    description: "<what this test verifies, specific enough to know when it's failing>"
    acceptance_criterion: "<inherited from the REQ's acceptance criteria — the
      test exists to check exactly this, not a loosely related behavior>"
---
```

```markdown
# Testing

## Test levels
<Confirmed levels and tooling — `[confirmation individual]`.>

## Coverage target
...

## Test data strategy
...

## Test plans
<One subsection per TEST-XXX: level, kind (automated/manual), what it
verifies, and which REQ-XXX it traces to.>
```

## Notes for whoever fills this in

- **Every functional `REQ-XXX` needs at least one `TEST-XXX`** — this is the gate's primary scriptable check, validated against `docs/03-requirements/requirements.md` by `scripts/validate-traceability.mjs`.
- **Non-functional requirements** (performance, security) still need a validation strategy — not necessarily a classic automated test, but something explicit: a load test, a manual security review checklist item, a penetration test — never left with no plan at all just because it isn't a unit test.
- **`kind: automated` vs. `kind: manual` must be explicit and honest** — do not mark something "automated" because it should be, if what's actually planned is a manual check. The distinction matters for planning later phases (Deployment's CI gates, for one).
- `TEST-XXX` IDs come from `project-state.md`'s `id_sequences.TEST`, global to the project.
