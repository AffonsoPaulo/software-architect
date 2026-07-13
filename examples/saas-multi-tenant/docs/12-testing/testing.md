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

### TEST-001 — Task creation validation
*Traces to: REQ-001 · Level: Integration · Kind: Automated*

Creates a task via API-001 with valid and invalid inputs (missing title, invalid assignee), asserts correct status codes and that a valid creation starts in 'to_do'.

### TEST-002 — Task listing and filtering
*Traces to: REQ-002 · Level: Integration · Kind: Automated*

Seeds a project with tasks in varied statuses/assignees, asserts API-002's filtering returns the correct subset for every filter combination, and an empty list for a task-free project.

### TEST-003 — Cross-tenant access rejection
*Traces to: REQ-003 · Level: E2e · Kind: Automated*

Authenticates as a user in Tenant A, attempts to access/create tasks under a Tenant B project ID (both direct guesses and IDs harvested from Tenant A's own valid responses), asserts every attempt returns 404 with no distinguishable difference from a genuinely nonexistent project.

**Non-functional test detail**
Threshold: zero successful cross-tenant reads or writes across the full attack matrix tested (direct ID guess, ID reuse, parameter tampering). Any single success fails the build.

### TEST-004 — Load test at 500 concurrent users
*Traces to: REQ-004 · Level: Load · Kind: Automated*

k6 script simulating 500 concurrent users hitting API-001 and API-002 across multiple tenants, asserting p95 latency stays under 300ms and no tenant's latency degrades disproportionately (the REQ-004 noisy-neighbor edge case).

**Non-functional test detail**
Threshold: p95 < 300ms sustained over a 10-minute run at 500 concurrent simulated users; per-tenant p95 must not exceed the aggregate p95 by more than 20%, to catch noisy-neighbor effects.
