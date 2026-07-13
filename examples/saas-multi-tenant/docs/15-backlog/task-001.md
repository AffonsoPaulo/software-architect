# TASK-001 — Implement task creation
*Traces to: US-001, UC-001 · Priority: High · Status: Not started · Author: Priya*

Implement task creation (API-001, ENT-003/TBL-003).

**Estimate**: 5 story points.
**Dependencies**: TASK-002 (Tenant Context Middleware must exist first — task creation is built tenant-safe from the start, not retrofitted).
**Acceptance test scenarios**: Given a valid title and project, creating a task returns 201 and the task appears in that project's list. Given a project belonging to another tenant, creating a task returns 404 with no distinguishable difference from a genuinely nonexistent project.
