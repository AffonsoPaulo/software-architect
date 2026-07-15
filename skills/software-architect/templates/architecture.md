# Architecture — Template

Saved at `docs/08-architecture/` in the target project (see `rules/document-locations.md`), with individual decision records under `docs/08-architecture/adr/`. Produced by `playbooks/08-architecture.md`. Defines system architecture — style, components, integrations — compatible with the approved Database Design and satisfying every non-functional requirement. Phase 09 (API Design) works from the decisions made here, not the other way around.

This category splits into an **index file** (`architecture.md`) and one **item file** per component (`arch-001.md`, `arch-002.md`, ...) — see `rules/document-locations.md`. `docs/08-architecture/adr/ADR-XXX.md` is unaffected — it already followed this one-file-per-decision shape before this convention existed.

## Index file — `architecture.md`

```markdown
# Architecture

## Architectural style
<Monolith / modular monolith / microservices / serverless, and why —
`[confirmation individual]`. In brownfield mode: the existing style,
and whether this cycle's work conforms to it or consciously diverges
(the latter needs its own ADR).>

## Architectural pattern
<Layered, hexagonal/ports-and-adapters, event-driven, CQRS,
microkernel/plugin, pipe-and-filter, MVC/MVVM for the internal
structure, etc., and why — `[confirmation individual]`. Distinct from
style above: style is the deployment/topology shape, this is how the
system (or each component) is organized internally. In brownfield
mode: the existing pattern, and whether this cycle conforms or
consciously diverges (the latter needs its own ADR).>

| ID | Component | Traces to | ADR |
|---|---|---|---|
| [ARCH-001](arch-001.md) | <name> | REQ-012 | ADR-003 |

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

## Item file — `arch-001.md`

```markdown
# ARCH-001 — <component name>
*Traces to: REQ-012 · ADR: ADR-003*

<One clear responsibility — a component with more than one unrelated
responsibility is a sign it should be split.>
```

`Traces to` is required for components that exist to satisfy a non-functional requirement — list every NFR this component addresses. `ADR` names the ADR that documents the consequential decision behind this component's existence/shape, if it's not simply implied by an already existing style/technology decision recorded in another ADR — omit the `ADR` key entirely if there isn't one yet.

## Fully Dressed additions

The index file gains:

```markdown
## Context view
<The system as a single box, with every external actor and system it
talks to around it — arc42/C4's "system context" level. A `graph TD` or
`flowchart` showing the system boundary, not its internals.>

```mermaid
graph TD
    ...
```

## Runtime view
<For each critical scenario (checkout, authentication, anything
consequential) a `sequenceDiagram` showing how the components above
actually collaborate to execute it at runtime — distinct from the
static component diagram, which shows structure, not behavior.>

```mermaid
sequenceDiagram
    ...
```

## Crosscutting concepts
<Patterns applied consistently across every component, stated once
here instead of repeated per component: infrastructure conventions
(logging approach, error-handling convention, configuration
management, caching strategy) and recurring design patterns adopted
as a project-wide convention (e.g. Repository for data access,
Strategy for pluggable behavior, Adapter for third-party integrations,
Circuit Breaker for external calls) — not a per-component or per-class
design-pattern inventory, which belongs to implementation, not this
document. "Standard framework defaults, no project-specific
convention" is valid if actually true.>

## Quality tree
<Which specific NFRs matter most and how they were prioritized relative
to each other, when they trade off against one another — e.g.
"availability was prioritized over latency for the payment path;
inverse for the search path." Distinct from the NFR coverage table
above, which shows WHAT addresses each NFR, not how conflicts between
them were resolved.>

## Risks and technical debt
<Known architectural risks or deliberately accepted debt — e.g. "the
initial monolith will need to split out the notification service before
10x current load." Each with what would trigger revisiting it. "(none)
currently identified" is valid for a genuinely fresh design.>

## Glossary
<Architecture-specific terms not already covered by the Domain Model's
ubiquitous language (Fully Dressed) — infrastructure and pattern
vocabulary, e.g. "circuit breaker," "read replica," used consistently
across this document.>
```

## Notes for whoever fills this in

- **Every consequential architectural decision gets its own ADR** (`templates/adr.md`) under `docs/08-architecture/adr/` — this document references them, it doesn't restate their reasoning inline.
- **Every non-functional requirement needs a component/decision that addresses it** — the coverage table above is the gate's primary scriptable check; an NFR with no entry is a gap, not an oversight to fix later.
- `ARCH-XXX` IDs come from `project-state.md`'s `id_sequences.ARCH`, global to the project.
- This document never designs actual API endpoints or contracts — `Interaction style guidance` is a boundary, not a preview. Phase 09 does that work.
- **This Skill targets any system in any language/architecture** — do not default to REST just because it's the most common answer. A CLI tool, an embedded system, a message-queue consumer, or a server-rendered Blade/Rails/Django-style monolith are all equally valid answers here, each with its own vocabulary in phase 09.
