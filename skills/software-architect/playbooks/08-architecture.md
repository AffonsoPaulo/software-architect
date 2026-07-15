# Playbook 08 — Architecture

> Runs before API Design (phase 09) by design — architectural style informs API shape, not the other way around. This ordering was flipped from an earlier revision of the Skill, where API Design ran first, once it became clear the API's shape should follow from the architectural style rather than decide it.

## Objective

Define system architecture — style, components, integrations — that satisfies every non-functional requirement and is compatible with the approved Database Design. Every consequential decision becomes an ADR. Phase 09 (API Design) works from the decisions made here.

## When to run

Always. Architecture is one of the four always-mandatory phases (`playbooks/00-project-calibration.md`), regardless of project size or cycle.

## When NOT to run

Never skippable.

## Inputs

- `docs/03-requirements/requirements.md` — approved, specifically the non-functional requirements.
- `docs/07-database-design/database.md` — approved.
- `docs/00-calibration/calibration.md` — project type (brownfield/greenfield) and, if brownfield, subagent research summary.

## Outputs

- `docs/08-architecture/architecture.md`.
- `docs/08-architecture/adr/ADR-XXX.md` — one per consequential decision.

## Documents produced

- `docs/08-architecture/architecture.md` (index: style, pattern, core tech, NFR coverage, diagram) plus one `docs/08-architecture/arch-XXX.md` per component, via `templates/architecture.md` (`rules/document-locations.md`).
- `docs/08-architecture/adr/*.md` via `templates/adr.md` — already one file per decision, unaffected by this convention.

## Mandatory questions

- Architectural style (monolith, modular monolith, microservices, serverless) and why — `[confirmation individual]`; if brownfield, confirm that new work respects the existing style (or record a conscious ADR if the user chooses to diverge)
- Architectural pattern (layered, hexagonal/ports-and-adapters, event-driven, CQRS, microkernel/plugin, pipe-and-filter, MVC/MVVM for the system's internal structure, etc.) and why — `[confirmation individual]`, distinct from style: style is the deployment/topology shape, pattern is how the system (or each component) is organized internally. If brownfield, confirm the existing pattern the same way as style — conform by default, diverge only via a conscious ADR.
- Main components and their responsibilities?
- External integration points (third-party services, queues, cache)?
- How does each non-functional requirement (`REQ-XXX` NFR) get addressed by the chosen architecture — explicit traceability?
- Core technologies (language, framework, infrastructure) — `[confirmation individual]`
- Interaction style this architecture uses — not limited to REST/GraphQL/RPC: could be server-rendered MVC, a CLI command surface, an event/message handler, a library/SDK interface, or something else entirely; name what the project actually is rather than defaulting to the most common answer — a high-level decision phase 09 will detail, not redecide

**Fully Dressed only** (`rules/documentation-depth.md`):
- What does the system boundary look like — every external actor/system it talks to, as a single "box" view?
- For each critical scenario (checkout, authentication, anything consequential): how do the components actually collaborate at runtime?
- What patterns apply consistently across every component — both infrastructure conventions (logging, error handling, configuration, caching) and recurring design patterns (e.g. Repository for data access, Strategy for pluggable behavior, Adapter for third-party integrations, Circuit Breaker for external calls) the project commits to as a convention, not a one-off choice inside a single component?
- Which NFRs matter most relative to each other, and how were conflicts between them resolved?
- What architectural risks or deliberately accepted technical debt exist right now?

## Optional questions

- Whether a separate data-flow `flowchart` is needed in addition to the component diagram, if the component diagram alone doesn't make data flow clear.

## Interview flow

1. Check project type in `project-state.md` and Calibration's subagent findings first. If brownfield, this phase's first question changes shape — see "Special cases."
2. Architectural style — `[confirmation individual]`.
3. Architectural pattern — `[confirmation individual]`, right after style since the two are easy to conflate; confirm it as its own decision even when the style answer made it feel implied.
4. Components and responsibilities, one at a time.
5. Integration points.
6. Core technologies — `[confirmation individual]`.
7. NFR coverage — walk every non-functional `REQ-XXX` from phase 03 and confirm which component/decision addresses it; any NFR with no answer here is a gap to resolve before this phase closes, not something to leave implicit.
8. Interaction style guidance — last, since it depends on everything above. Ask openly ("how is this system actually invoked/used?") before offering REST/GraphQL/RPC as examples — offering those first biases the answer toward them even when the project is something else entirely (a CLI tool, a server-rendered monolith, an event consumer).

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Architectural style, architectural pattern, and core technologies are always individually confirmed — Architecture is itself an always-strict category per `rules/confirmation-protocol.md`, so in practice every consequential decision in this phase gets individual confirmation, not just the three explicitly tagged questions.

## How to document answers

Each confirmed component becomes its own `docs/08-architecture/arch-XXX.md` item file, `Traces to` set to the NFRs it addresses, with a matching row added to `architecture.md`'s index table. Every consequential decision (style, architectural pattern, core technology, any decision with high reversal cost) gets its own ADR via `templates/adr.md`, referenced from `architecture.md` rather than restated inline. The NFR coverage table is built directly from step 7 of the interview — never inferred after the fact. At Fully Dressed depth, the additional answers map to `templates/architecture.md`'s "Fully Dressed additions" section (context view, runtime view, crosscutting concepts, quality tree, risks/debt).

## How to validate answers

- Architectural style and architectural pattern are recorded as two distinct, individually confirmed decisions — never inferred from one another.
- Every consequential architectural decision has an associated ADR.
- Every non-functional requirement has a component/decision that addresses it — 100%, not "the obvious ones."
- No component has an unclear or overlapping responsibility.
- Interaction style guidance is recorded specifically enough for phase 09 to consume without re-asking the high-level question, and it names what the project actually is rather than defaulting to REST because that's the common case.

## Special cases

- **Brownfield**: the architectural style is usually already given by the existing system — this phase becomes "describe the relevant existing architecture and decide only what's new within it," not a fresh style choice. Use Calibration's subagent findings (`rules/delegation-policy.md`) as a starting point; if they're insufficient for a specific decision, trigger a new read-only subagent here rather than asking the user something the code already answers. If the user wants to diverge from the existing style, that's a conscious, individually-confirmed decision with its own ADR — never a silent drift.
- **NFR with no natural architectural answer**: does not mean the NFR is skipped — it means more discussion is needed until a component or decision genuinely addresses it. An NFR left uncovered blocks this phase's gate.

## Common ambiguities

- Style and pattern collapsed into one answer — e.g. the user says "modular monolith" and treats that as also settling the internal organization. Style (monolith/microservices/serverless) and pattern (layered, hexagonal, event-driven, CQRS, ...) are orthogonal: a modular monolith can be layered or hexagonal; microservices can each be layered internally or event-driven between them. Ask pattern explicitly even when style felt like it implied one.
- "Microservices" chosen because it sounds modern rather than because the project's actual scale/team structure warrants it — if the reasoning given doesn't hold up against the project's size (from Calibration), ask again rather than accepting a style mismatched to the project's actual needs.
- A component described by its technology ("the Redis component") rather than its responsibility ("the session cache") — ask for the responsibility; the technology choice belongs in "core technologies," not the component's identity.
- Assuming "API" means a JSON REST API by default — this Skill covers any system in any language, and a server-rendered monolith (Laravel Blade, Rails views, Django templates), a CLI tool, or an embedded system are equally valid, common answers. Ask what the project actually is rather than presenting REST/GraphQL/RPC as the only options.

## Frequent errors

- Leaving a non-functional requirement without a component/decision that addresses it.
- Deciding architectural style without individual confirmation because "it's an obvious choice for this kind of project."
- Skipping the architectural pattern question because the style answer felt like it already covered it, or defaulting to layered/MVC without asking because it's the most common answer.
- Turning the "patterns across every component" question into a class-by-class design-pattern inventory — this phase records only patterns that are a project-wide convention (e.g. "Repository for all data access"), never a per-component or per-class choice; that level of detail belongs to actual implementation, not this phase.
- Letting this phase drift into designing actual API endpoints — that's phase 09's job; this phase only sets the high-level style guidance.

## Examples

> AI: "REQ-018 requires 99.9% availability. Given the modular monolith style we confirmed, how should this be addressed — redundant deployment instances behind a load balancer, or something else?"
> User: "Yes, two instances minimum behind a load balancer, plus a health-check-based failover."
> AI: "Recording ARCH-004: 'Load-balanced deployment with a minimum of two instances and health-check failover,' addressing REQ-018. This is consequential enough for its own ADR — drafting ADR-002 now. Confirm the component and I'll show you the ADR next."

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never assume an architectural style, architectural pattern, or core technology because it's common for this kind of project — never let this phase quietly start designing API contracts, which belongs entirely to phase 09 — and never default interaction style guidance to REST/GraphQL/RPC without asking; this Skill must work for any system in any language, including server-rendered monoliths, CLI tools, and everything that isn't a JSON API.

## Checklist

`checklists/08-architecture-checklist.md`

## Quality Gate

`quality-gates/08-architecture-gate.md`. Summary: every consequential decision has an ADR; every non-functional requirement has architectural coverage; every component has a clear, singular responsibility; interaction style guidance is recorded for phase 09.

## Approval criteria

This phase is done when every non-functional requirement traces to an architectural decision, every consequential decision has an ADR, architectural style, architectural pattern, and core technologies have been individually confirmed, and the user has explicitly confirmed the full architecture including interaction style guidance.
