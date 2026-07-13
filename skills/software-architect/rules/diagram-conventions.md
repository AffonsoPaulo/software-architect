# Diagram Conventions

Every Mermaid diagram used by any playbook comes from this table. No playbook chooses a diagram type ad hoc.

## Diagram type by phase/document

| Phase / document | Mermaid type |
|---|---|
| 02 — Business Analysis (business process, as-is/to-be) | `flowchart` |
| 05 — Use Cases (main flow, multi-actor) | `sequenceDiagram` |
| 05 — Use Cases (stateful entities, e.g. order lifecycle) | `stateDiagram` |
| 06 — Domain Model | `classDiagram` |
| 07 — Database Design | `erDiagram` |
| 08 — Architecture (components, data flow) | `graph` (component-style) / `flowchart` |
| 09 — API Design (critical flow, e.g. checkout, auth) | `sequenceDiagram` |
| 10 — Frontend Planning (screen navigation) | `flowchart` |
| 13 — Deployment (environments, infrastructure) | `flowchart` or `graph TD` |
| 14 — Roadmap (with real dates) | `gantt` |
| 14 — Roadmap (relative, dependency-only) | `flowchart` |
| 16 — Implementation Plan (task dependencies) | `flowchart` or `gantt` |

## The original brief's 9 diagram types, mapped

The original specification calls for 9 diagram categories: Flowchart, ERD, Sequence, Activity, State, Component, Deployment, Class, Package. Mermaid has no native **Activity** or **Package** diagram type — rather than silently dropping these two, they map explicitly:

- **Activity** → `flowchart` (decision/activity-oriented layout) or `stateDiagram`, whichever fits the specific flow being described.
- **Package** → `classDiagram` using `namespace` blocks, or `graph` using `subgraph` per module/package.

Flowchart, ERD, Sequence, State, Component (via `graph`/`flowchart`), Deployment (via `flowchart`/`graph TD`), and Class all have direct Mermaid equivalents already reflected in the table above.

## Rule

If a playbook needs a diagram for a document/phase not listed above, the diagram type is added to this table first — not decided inside the playbook.
