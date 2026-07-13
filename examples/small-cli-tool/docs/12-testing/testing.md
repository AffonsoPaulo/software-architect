---
levels: ["unit", "integration"]
tooling: "Node.js built-in test runner"
coverage_target: "not applicable — small project, coverage judged by requirement coverage, not a percentage threshold"
test_data_strategy: "fixtures — small hand-crafted CSV/JSON/YAML files covering the documented edge cases, plus one generated 100MB CSV fixture for the memory-bound test"
test_plans:
  - id: TEST-001
    traces_to: ["REQ-001"]
    level: "integration"
    kind: "automated"
    description: "Round-trips a CSV fixture with commas/quotes in values through CSV->JSON->CSV and asserts the result matches the original, per REQ-001's acceptance criteria and edge cases."
  - id: TEST-002
    traces_to: ["REQ-002"]
    level: "integration"
    kind: "automated"
    description: "Converts a generated 100MB CSV fixture to JSON, asserting peak memory stays under 512MB (measured via process.memoryUsage() sampling) and the process completes successfully."
  - id: TEST-003
    traces_to: ["REQ-003"]
    level: "integration"
    kind: "automated"
    description: "Round-trips a YAML fixture through YAML->JSON->YAML and asserts equivalence; separately asserts that a YAML fixture using anchors fails with the documented specific error rather than silently mis-converting."
---

# Testing

## Test levels
Unit tests for the parser/serializer functions in isolation, integration tests for the full CLI invocation — `[confirmation individual]`.

## Coverage target
Not a percentage threshold for a project this size — judged by requirement coverage (every REQ has a TEST), which is 100% here.

## Test data strategy
Fixtures: small hand-crafted files per edge case, plus one generated 100MB CSV for the memory-bound test (TEST-002).

## Test plans
See front-matter — TEST-001 (REQ-001), TEST-002 (REQ-002, the memory bound), TEST-003 (REQ-003, cycle 2).
