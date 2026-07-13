# TASK-005 — Set up load-testing infrastructure
*Traces to: US-002, UC-002 · Priority: Medium · Status: Not started · Author: Priya*

Set up load-testing infrastructure (k6, CI integration) to validate REQ-004.

**Estimate**: 5 story points.
**Dependencies**: TASK-004 (needs the listing endpoint to load-test), TASK-003 (needs the CI pipeline to integrate into).
**Acceptance test scenarios**: TEST-004 runs in CI on demand (not on every merge, given its cost) and produces a pass/fail signal against the p95 < 300ms threshold.
