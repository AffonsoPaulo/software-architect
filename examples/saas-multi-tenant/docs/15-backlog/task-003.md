# TASK-003 — Set up CI/CD pipeline
*Traces to: US-001 · Priority: Medium · Status: Not started · Author: Priya*

Set up CI/CD pipeline per `docs/13-deployment/deployment.md`.

**Estimate**: 3 story points.
**Dependencies**: TASK-001 (needs something to deploy to have a meaningful pipeline to validate against).
**Acceptance test scenarios**: A merge to main triggers the pipeline, runs TEST-001 through TEST-003, and deploys to staging automatically on success.
