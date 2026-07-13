# Architecture — Template

Saved at `docs/08-architecture/architecture.md` in the target project (see `rules/document-locations.md`), with individual decision records under `docs/08-architecture/adr/`. Produced by `playbooks/08-architecture.md`. Defines system architecture — style, components, integrations — compatible with the approved Database Design and satisfying every non-functional requirement. Phase 09 (API Design) works from the decisions made here, not the other way around.

## Structure

```yaml
---
components:
  - id: ARCH-001
    name: "<component name>"
    responsibility: "<one clear responsibility — a component with more than
      one unrelated responsibility is a sign it should be split>"
    traces_to: ["REQ-012"]
    # REQUIRED for components that exist to satisfy a non-functional
    # requirement — list every NFR this component addresses.
    adr: "ADR-003"
    # the ADR that documents the consequential decision behind this
    # component's existence/shape, if it's not simply implied by an already
    # existing style/technology decision recorded in another ADR
interaction_style_guidance: "<the high-level shape of how this system is
  invoked/consumed — not limited to REST/GraphQL/RPC. Examples: REST API,
  GraphQL API, RPC, server-rendered MVC (routes render views directly, no
  separate JSON contract), CLI command surface, event/message handler,
  public library/SDK interface, or a description in the user's own words
  if none of these fit. Single vs. multiple interaction surfaces, if
  relevant. High-level orientation for phase 09, not the detailed
  contract design.>"
---
```

```markdown
# Architecture

## Architectural style
<Monolith / modular monolith / microservices / serverless, and why —
`[confirmation individual]`. In brownfield mode: the existing style,
and whether this cycle's work conforms to it or consciously diverges
(the latter needs its own ADR).>

## Components
<One subsection per ARCH-XXX: responsibility, external integration points
if any, which NFRs it addresses.>

## Core technologies
<Language, framework, infrastructure — `[confirmation individual]`.>

## Non-functional requirement coverage
| REQ-XXX (NFR) | Addressed by |
|---|---|
| ... | ARCH-XXX / ADR-XXX |

## Interaction style guidance
<The high-level orientation phase 09 will work from — not a full design,
just the shape: REST, GraphQL, RPC, server-rendered MVC, CLI command
surface, event/message handler, library/SDK interface, or something else
entirely if this project doesn't fit any of those. Never forced into
REST/GraphQL/RPC vocabulary if the project is genuinely none of those —
name what it actually is.>

```mermaid
graph TD
    ...
```
<Component diagram, plus a `flowchart` for data flow between components
where that's not obvious from the component diagram alone —
`rules/diagram-conventions.md`.>
```

## Notes for whoever fills this in

- **Every consequential architectural decision gets its own ADR** (`templates/adr.md`) under `docs/08-architecture/adr/` — this document references them, it doesn't restate their reasoning inline.
- **Every non-functional requirement needs a component/decision that addresses it** — the coverage table above is the gate's primary scriptable check; an NFR with no entry is a gap, not an oversight to fix later.
- `ARCH-XXX` IDs come from `project-state.md`'s `id_sequences.ARCH`, global to the project.
- This document never designs actual API endpoints or contracts — `interaction_style_guidance` is a boundary, not a preview. Phase 09 does that work.
- **This Skill targets any system in any language/architecture** — do not default to REST just because it's the most common answer. A CLI tool, an embedded system, a message-queue consumer, or a server-rendered Blade/Rails/Django-style monolith are all equally valid answers here, each with its own vocabulary in phase 09.
