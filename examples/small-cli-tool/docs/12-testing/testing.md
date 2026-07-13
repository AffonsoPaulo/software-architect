# Testing

## Test levels
Unit tests for the parser/serializer functions in isolation, integration tests for the full CLI invocation — `[confirmation individual]`. Tooling: Node.js built-in test runner.

## Coverage target
Not a percentage threshold for a project this size — judged by requirement coverage (every REQ has a TEST), which is 100% here.

## Test data strategy
Fixtures: small hand-crafted files per edge case, plus one generated 100MB CSV for the memory-bound test (TEST-002).

## Test plans

### TEST-001 — CSV/JSON round-trip with escaping
*Traces to: REQ-001 · Level: Integration · Kind: Automated*

Round-trips a CSV fixture with commas/quotes in values through CSV→JSON→CSV and asserts the result matches the original, per REQ-001's acceptance criteria and edge cases.

### TEST-002 — Memory bound on large files
*Traces to: REQ-002 · Level: Integration · Kind: Automated*

Converts a generated 100MB CSV fixture to JSON, asserting peak memory stays under 512MB (measured via `process.memoryUsage()` sampling) and the process completes successfully.

### TEST-003 — YAML round-trip and unsupported-feature error (cycle 2)
*Traces to: REQ-003 · Level: Integration · Kind: Automated*

Round-trips a YAML fixture through YAML→JSON→YAML and asserts equivalence; separately asserts that a YAML fixture using anchors fails with the documented specific error rather than silently mis-converting.
