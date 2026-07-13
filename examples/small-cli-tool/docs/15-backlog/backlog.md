---
definition_of_ready: "Requirement and use case approved, technical dependencies (if any) identified, no open questions blocking a developer from starting."
items:
  - id: TASK-001
    traces_to: ["US-001"]
    milestone: "milestone-mvp"
    priority: "high"
    status: "not_started"
  - id: TASK-002
    traces_to: ["US-001"]
    milestone: "milestone-mvp"
    priority: "high"
    status: "not_started"
    # CI/publish setup — infra item, traces to the story it enables shipping
  - id: TASK-003
    traces_to: ["US-002"]
    milestone: "milestone-yaml"
    priority: "high"
    status: "not_started"
---

# Backlog

## Definition of Ready
Confirmed once: requirement and use case approved, technical dependencies identified, no open blocking questions.

## Items by milestone

### Milestone 1 — MVP
- TASK-001 — Implement the Conversion Engine (ARCH-001) with streaming CSV/JSON parse+serialize, satisfying REQ-001 and REQ-002. Traces to US-001.
- TASK-002 — Set up CI (test + publish pipeline) per `docs/13-deployment/deployment.md`. Traces to US-001 (nothing ships without it).

### Milestone 2 — YAML support
- TASK-003 — Implement the YAML Parser Adapter (ARCH-002) and wire it into the existing `convert` command. Traces to US-002.
