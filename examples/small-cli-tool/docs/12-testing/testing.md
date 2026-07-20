# Testing

## Test levels
Unit tests for the parser/serializer functions in isolation, integration tests for the full CLI invocation. Tooling: Node.js built-in test runner.

## Coverage target
Not a percentage threshold for a project this size — judged by requirement coverage (every REQ has a TEST), which is 100% here.

## Test data strategy
Fixtures: small hand-crafted files per edge case, plus one generated 100MB CSV for the memory-bound test (TEST-002).

## Test plans

| ID | Title | Level | Kind | Traces to |
|---|---|---|---|---|
| [TEST-001](test-001.md) | CSV/JSON round-trip with escaping | Integration | Automated | REQ-001 |
| [TEST-002](test-002.md) | Memory bound on large files | Integration | Automated | REQ-002 |
| [TEST-003](test-003.md) | YAML round-trip and unsupported-feature error (cycle 2) | Integration | Automated | REQ-003 |
