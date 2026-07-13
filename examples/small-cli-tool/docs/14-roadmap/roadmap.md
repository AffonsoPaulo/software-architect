---
has_real_dates: false
milestones:
  - id: "milestone-mvp"
    name: "MVP — CSV/JSON conversion"
    delivers: ["US-001"]
    done_criterion: "convert command works both directions between CSV and JSON, memory-bounded per REQ-002, published to npm."
    depends_on: []
    target_date: null
  - id: "milestone-yaml"
    name: "YAML support (cycle 2)"
    delivers: ["US-002"]
    done_criterion: "convert command supports YAML as both input and output format, published as a minor version bump."
    depends_on: ["milestone-mvp"]
    target_date: null
deferred: []
---

# Roadmap

## Milestones
No real deadline — relative milestones, confirmed with the user (`has_real_dates: false`).

### Milestone 1 — MVP (CSV/JSON conversion)
Delivers US-001. Done when the `convert` command works both directions, satisfies REQ-002's memory bound, and is published.

### Milestone 2 — YAML support (cycle 2)
Delivers US-002. Depends on Milestone 1 (reuses its internal representation). Done when YAML is a fully supported format.

```mermaid
flowchart LR
    M1["Milestone 1: MVP"] --> M2["Milestone 2: YAML support"]
```
