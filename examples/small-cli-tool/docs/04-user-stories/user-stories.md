# User Stories

### US-001 — Convert between CSV and JSON
*Traces to: REQ-001*

**As a** developer, **I want to** convert a CSV file to JSON (or back) with one command, **so that** I don't have to write a one-off script every time.

**Acceptance criteria**
- [ ] Converting a valid CSV file to JSON produces a JSON array of objects, one per row.
- [ ] Converting a valid JSON array to CSV produces a CSV file with a matching header row.

**INVEST notes**
Independent and testable on its own; small enough to ship as one unit.

### US-002 — Convert YAML (cycle 2)
*Traces to: REQ-003*

**As a** developer, **I want to** convert a YAML file to/from JSON or CSV, **so that** I can use the same tool for YAML config files, not just CSV/JSON data.

**Acceptance criteria**
- [ ] Converting a valid YAML file to JSON or CSV produces equivalent output to the same data expressed in JSON.

**INVEST notes**
Independent of US-001 — reuses the same internal representation but is a separately testable capability.

Note: REQ-002 (memory bound, non-functional) has no User Story — it traces directly to ARCH-001 and SEC-001, per `rules/traceability-rules.md`'s documented exception.
