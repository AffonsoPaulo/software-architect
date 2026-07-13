# ARCH-002 — Tenant Context Middleware
*Traces to: REQ-003 · ADR: ADR-002 · Author: Priya*

Resolves the caller's tenant from their authenticated session on every request and injects it into every database query, so no query can accidentally cross tenant boundaries.
