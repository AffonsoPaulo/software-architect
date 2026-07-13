# TASK-002 — Implement Tenant Context Middleware and RLS policies
*Traces to: US-001 · Priority: High · Status: Not started*

Implement Tenant Context Middleware (ARCH-002) and RLS policies (ADR-002).

**Estimate**: 8 story points.
**Dependencies**: None — this is the foundational item every tenant-scoped feature depends on.
**Acceptance test scenarios**: Given a request authenticated to Tenant A, any query attempting to touch Tenant B's rows returns zero rows at the database layer, independent of application-level logic.
