---
requirements:
  - id: REQ-001
    type: "functional"
    description: "Users can convert a file between CSV and JSON formats in either direction using a single command."
    acceptance_criteria:
      - "Converting a valid CSV file to JSON produces a JSON array of objects, one per row, keyed by header column names."
      - "Converting a valid JSON array of flat objects to CSV produces a CSV file with a header row matching the union of object keys."
    traces_to: []
    priority: "must"
    edge_cases:
      - "CSV with a column value containing a comma or quote — must be correctly escaped per RFC 4180."
      - "JSON objects with nested objects/arrays — must be flattened using dot-notation keys, or rejected with a clear error if flattening is ambiguous."
  - id: REQ-002
    type: "non-functional"
    description: "The tool must convert files up to 100MB without exceeding 512MB of memory usage."
    acceptance_criteria:
      - "A 100MB CSV file converts to JSON using a streaming approach, peak memory under 512MB, measured on the target CI runner."
    traces_to: []
    priority: "should"
    edge_cases:
      - "A file larger than 100MB — must fail with a clear error rather than silently exhausting memory."
  - id: REQ-003
    type: "functional"
    description: "Users can convert a file between YAML and the tool's existing internal representation (and therefore to/from CSV and JSON as well), added in cycle 2."
    acceptance_criteria:
      - "Converting a valid YAML file to JSON or CSV produces equivalent output to converting the same data expressed directly in JSON."
      - "Converting JSON or CSV to YAML produces valid YAML that round-trips back to equivalent data."
    traces_to: []
    priority: "must"
    edge_cases:
      - "YAML-specific features with no CSV/JSON equivalent (anchors, multi-document files) — must fail with a clear error naming the unsupported feature, not silently drop data."
---

# Requirements

## Functional requirements

### REQ-001 — CSV/JSON conversion
**Description**: Users can convert a file between CSV and JSON formats in either direction using a single command.
**Acceptance criteria**:
- [ ] Converting a valid CSV file to JSON produces a JSON array of objects, one per row, keyed by header column names.
- [ ] Converting a valid JSON array of flat objects to CSV produces a CSV file with a header row matching the union of object keys.
**Priority**: must
**Edge cases**:
- CSV with a column value containing a comma or quote — must be correctly escaped per RFC 4180.
- JSON objects with nested objects/arrays — must be flattened using dot-notation keys, or rejected with a clear error if flattening is ambiguous.

### REQ-003 — YAML conversion (cycle 2)
**Description**: Users can convert a file between YAML and the tool's existing internal representation.
**Acceptance criteria**:
- [ ] Converting a valid YAML file to JSON or CSV produces equivalent output to converting the same data expressed directly in JSON.
- [ ] Converting JSON or CSV to YAML produces valid YAML that round-trips back to equivalent data.
**Priority**: must
**Edge cases**:
- YAML-specific features with no CSV/JSON equivalent (anchors, multi-document files) — must fail with a clear error naming the unsupported feature.

## Non-functional requirements

### REQ-002 — Memory bound on large files
**Description**: The tool must convert files up to 100MB without exceeding 512MB of memory usage.
**Acceptance criteria**:
- [ ] A 100MB CSV file converts to JSON using a streaming approach, peak memory under 512MB, measured on the target CI runner.
**Priority**: should
**Edge cases**:
- A file larger than 100MB — must fail with a clear error rather than silently exhausting memory.
