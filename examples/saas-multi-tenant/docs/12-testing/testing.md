---
levels: ["unit", "integration", "e2e", "load"]
tooling: "Jest for unit/integration, Playwright for e2e, k6 for load testing — `[confirmation individual]`."
coverage_target: "90% line coverage on the Application Server's business logic modules"
test_data_strategy: "Seeded multi-tenant fixtures (at least 2 distinct tenants in every integration test run) so cross-tenant bugs surface in normal test runs, not only in a dedicated security test."
test_plans:
  - id: TEST-001
    traces_to: ["REQ-001"]
    level: "integration"
    kind: "automated"
    description: "Creates a task via API-001 with valid and invalid inputs (missing title, invalid assignee), asserts correct status codes and that a valid creation starts in 'to_do'."
  - id: TEST-002
    traces_to: ["REQ-002"]
    level: "integration"
    kind: "automated"
    description: "Seeds a project with tasks in varied statuses/assignees, asserts API-002's filtering returns the correct subset for every filter combination, and an empty list for a task-free project."
  - id: TEST-003
    traces_to: ["REQ-003"]
    level: "e2e"
    kind: "automated"
    description: "Authenticates as a user in Tenant A, attempts to access/create tasks under a Tenant B project ID (both direct guesses and IDs harvested from Tenant A's own valid responses), asserts every attempt returns 404 with no distinguishable difference from a genuinely nonexistent project."
  - id: TEST-004
    traces_to: ["REQ-004"]
    level: "load"
    kind: "automated"
    description: "k6 script simulating 500 concurrent users hitting API-001 and API-002 across multiple tenants, asserting p95 latency stays under 300ms and no tenant's latency degrades disproportionately (the REQ-004 noisy-neighbor edge case)."
---

# Testing

## Test levels
Unit, integration, e2e, and load — `[confirmation individual]`, given the real consequence of getting REQ-003/REQ-004 wrong.

## Coverage target
90% line coverage on business logic — `[confirmation individual]`.

## Test data strategy
Every integration test run seeds at least 2 distinct tenants, so cross-tenant bugs are likely to surface even outside TEST-003 specifically.

## Test plans
See front-matter — TEST-001 through TEST-004, covering all four requirements including both non-functional ones with real automated verification, not just a manual checklist.
