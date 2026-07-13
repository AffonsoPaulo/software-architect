---
user_stories:
  - id: US-001
    traces_to: ["REQ-001"]
    persona: "developer"
    action: "convert a CSV file to JSON (or back) with one command"
    benefit: "I don't have to write a one-off script every time"
    acceptance_criteria:
      - "Converting a valid CSV file to JSON produces a JSON array of objects, one per row."
      - "Converting a valid JSON array to CSV produces a CSV file with a matching header row."
    invest_notes: "Independent and testable on its own; small enough to ship as one unit."
  - id: US-002
    traces_to: ["REQ-003"]
    persona: "developer"
    action: "convert a YAML file to/from JSON or CSV"
    benefit: "I can use the same tool for YAML config files, not just CSV/JSON data"
    acceptance_criteria:
      - "Converting a valid YAML file to JSON or CSV produces equivalent output to the same data expressed in JSON."
    invest_notes: "Independent of US-001 — reuses the same internal representation but is a separately testable capability."
---

# User Stories

## US-001 — Convert between CSV and JSON
**As a** developer, **I want to** convert a CSV file to JSON (or back) with one command, **so that** I don't have to write a one-off script every time.

**Traces to**: REQ-001

**Acceptance criteria**:
- [ ] Converting a valid CSV file to JSON produces a JSON array of objects, one per row.
- [ ] Converting a valid JSON array to CSV produces a CSV file with a matching header row.

## US-002 — Convert YAML (cycle 2)
**As a** developer, **I want to** convert a YAML file to/from JSON or CSV, **so that** I can use the same tool for YAML config files, not just CSV/JSON data.

**Traces to**: REQ-003

**Acceptance criteria**:
- [ ] Converting a valid YAML file to JSON or CSV produces equivalent output to the same data expressed in JSON.

Note: REQ-002 (memory bound, non-functional) has no User Story — it traces directly to ARCH-001 and SEC-001, per `rules/traceability-rules.md`'s documented exception.
