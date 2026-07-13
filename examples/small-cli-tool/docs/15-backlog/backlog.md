# Backlog

## Definition of Ready
Confirmed once: requirement and use case approved, technical dependencies identified, no open blocking questions.

## Items by milestone

### Milestone 1 — MVP

#### TASK-001 — Implement the Conversion Engine
*Traces to: US-001, UC-001 · Priority: High · Status: Not started*

Implement the Conversion Engine (ARCH-001) with streaming CSV/JSON parse+serialize, satisfying REQ-001 and REQ-002.

#### TASK-002 — Set up CI (test + publish pipeline)
*Traces to: US-001 · Priority: High · Status: Not started*

Set up CI (test + publish pipeline) per `docs/13-deployment/deployment.md`. Traces to US-001 since nothing ships without it.

### Milestone 2 — YAML support

#### TASK-003 — Implement the YAML Parser Adapter
*Traces to: US-002, UC-002 · Priority: High · Status: Not started*

Implement the YAML Parser Adapter (ARCH-002) and wire it into the existing `convert` command.
