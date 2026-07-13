# Testing

## Test levels
Unit, integration, e2e, and load — `[confirmation individual]`, given the real consequence of getting REQ-003/REQ-004 wrong. Tooling: Jest for unit/integration, Playwright for e2e, k6 for load testing.

## Coverage target
90% line coverage on the Application Server's business logic modules — `[confirmation individual]`.

## Test data strategy
Seeded multi-tenant fixtures (at least 2 distinct tenants in every integration test run) so cross-tenant bugs surface in normal test runs, not only in a dedicated security test.

## Entry/exit criteria
**Entry**: staging environment provisioned and matching production's topology (per Deployment); latest migrations applied.
**Exit**: 100% of Must-have REQs have a passing automated test in CI; TEST-004 (load test) has run against staging at least once before any production deploy of a change touching ARCH-001 or ARCH-003.

## Test environment
Staging, provisioned to mirror production's topology at smaller scale (`docs/13-deployment/deployment.md`) — chosen specifically so REQ-004's load characteristics are representative before hitting production.

## Defect management
Tracked in the team's existing GitHub Issues workflow; severity levels Sev1 (data leak/cross-tenant issue, blocks release) through Sev3 (cosmetic). Triaged by the engineering lead within one business day.

## Risk-based prioritization
Tenant isolation (REQ-003) receives the deepest test investment — an e2e test specifically, not just unit coverage of the middleware — because its failure mode is catastrophic and hard to detect after the fact. Task creation/listing (REQ-001, REQ-002) get standard integration coverage, matched to their "important but recoverable if buggy" risk profile.

## Test plans

| ID | Title | Level | Kind | Traces to |
|---|---|---|---|---|
| [TEST-001](test-001.md) | Task creation validation | Integration | Automated | REQ-001 |
| [TEST-002](test-002.md) | Task listing and filtering | Integration | Automated | REQ-002 |
| [TEST-003](test-003.md) | Cross-tenant access rejection | E2e | Automated | REQ-003 |
| [TEST-004](test-004.md) | Load test at 500 concurrent users | Load | Automated | REQ-004 |
