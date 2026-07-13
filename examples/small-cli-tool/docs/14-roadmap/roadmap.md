# Roadmap

**Has real dates**: No — relative milestones, confirmed with the user.

## Milestones

### Milestone 1 — MVP (CSV/JSON conversion)
*Delivers: US-001, UC-001 · Depends on: (none) · Target date: (none)*

Done when the `convert` command works both directions between CSV and JSON, is memory-bounded per REQ-002, and is published to npm.

### Milestone 2 — YAML support (cycle 2)
*Delivers: US-002, UC-002 · Depends on: Milestone 1 · Target date: (none)*

Done when the `convert` command supports YAML as both input and output format, published as a minor version bump. Depends on Milestone 1 since it reuses its internal representation.

## Deferred

None.

```mermaid
flowchart LR
    M1["Milestone 1: MVP"] --> M2["Milestone 2: YAML support"]
```
