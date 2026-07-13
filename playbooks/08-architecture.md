# Playbook 08 — Architecture

> Runs before API Design (phase 09) by design — architectural style informs API shape, not the other way around. See `plan-00-overview.md` decision from the 2nd planning revision.

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

- `docs/08-architecture/architecture.md` via `templates/architecture.md`.
- `docs/08-architecture/adr/*.md` via `templates/adr.md`.

## Mandatory questions

- Architectural style (monolith, modular monolith, microservices, serverless) and why — `[confirmation individual]`; if brownfield, confirm that new work respects the existing style (or record a conscious ADR if the user chooses to diverge)
- Main components and their responsibilities?
- External integration points (third-party services, queues, cache)?
- How does each non-functional requirement (`REQ-XXX` NFR) get addressed by the chosen architecture — explicit traceability?
- Core technologies (language, framework, infrastructure) — `[confirmation individual]`
- API style the architecture favors (REST/GraphQL/RPC, single API vs. multiple per-service APIs) — a high-level decision phase 09 will detail, not redecide

## Optional questions

- Whether a separate data-flow `flowchart` is needed in addition to the component diagram, if the component diagram alone doesn't make data flow clear.

## Interview flow

1. Check project type in `project-state.md` and Calibration's subagent findings first. If brownfield, this phase's first question changes shape — see "Special cases."
2. Architectural style — `[confirmation individual]`.
3. Components and responsibilities, one at a time.
4. Integration points.
5. Core technologies — `[confirmation individual]`.
6. NFR coverage — walk every non-functional `REQ-XXX` from phase 03 and confirm which component/decision addresses it; any NFR with no answer here is a gap to resolve before this phase closes, not something to leave implicit.
7. API style guidance — last, since it depends on everything above.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Architectural style and core technologies are always individually confirmed — Architecture is itself an always-strict category per `rules/confirmation-protocol.md`, so in practice every consequential decision in this phase gets individual confirmation, not just the two explicitly tagged questions.

## How to document answers

Each confirmed component becomes an `ARCH-XXX` entry, `traces_to` set to the NFRs it addresses. Every consequential decision (style, core technology, any decision with high reversal cost) gets its own ADR via `templates/adr.md`, referenced from `architecture.md` rather than restated inline. The NFR coverage table is built directly from step 6 of the interview — never inferred after the fact.

## How to validate answers

- Every consequential architectural decision has an associated ADR.
- Every non-functional requirement has a component/decision that addresses it — 100%, not "the obvious ones."
- No component has an unclear or overlapping responsibility.
- API style guidance is recorded specifically enough for phase 09 to consume without re-asking the high-level question.

## Special cases

- **Brownfield**: the architectural style is usually already given by the existing system — this phase becomes "describe the relevant existing architecture and decide only what's new within it," not a fresh style choice. Use Calibration's subagent findings (`rules/delegation-policy.md`) as a starting point; if they're insufficient for a specific decision, trigger a new read-only subagent here rather than asking the user something the code already answers. If the user wants to diverge from the existing style, that's a conscious, individually-confirmed decision with its own ADR — never a silent drift.
- **NFR with no natural architectural answer**: does not mean the NFR is skipped — it means more discussion is needed until a component or decision genuinely addresses it. An NFR left uncovered blocks this phase's gate.

## Common ambiguities

- "Microservices" chosen because it sounds modern rather than because the project's actual scale/team structure warrants it — if the reasoning given doesn't hold up against the project's size (from Calibration), ask again rather than accepting a style mismatched to the project's actual needs.
- A component described by its technology ("the Redis component") rather than its responsibility ("the session cache") — ask for the responsibility; the technology choice belongs in "core technologies," not the component's identity.

## Frequent errors

- Leaving a non-functional requirement without a component/decision that addresses it.
- Deciding architectural style without individual confirmation because "it's an obvious choice for this kind of project."
- Letting this phase drift into designing actual API endpoints — that's phase 09's job; this phase only sets the high-level style guidance.

## Examples

> AI: "REQ-018 requires 99.9% availability. Given the modular monolith style we confirmed, how should this be addressed — redundant deployment instances behind a load balancer, or something else?"
> User: "Yes, two instances minimum behind a load balancer, plus a health-check-based failover."
> AI: "Recording ARCH-004: 'Load-balanced deployment with a minimum of two instances and health-check failover,' addressing REQ-018. This is consequential enough for its own ADR — drafting ADR-002 now. Confirm the component and I'll show you the ADR next."

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never assume an architectural style or core technology because it's common for this kind of project — and never let this phase quietly start designing API contracts, which belongs entirely to phase 09.

## Checklist

`checklists/08-architecture-checklist.md`

## Quality Gate

`quality-gates/08-architecture-gate.md`. Summary: every consequential decision has an ADR; every non-functional requirement has architectural coverage; every component has a clear, singular responsibility; API style guidance is recorded for phase 09.

## Approval criteria

This phase is done when every non-functional requirement traces to an architectural decision, every consequential decision has an ADR, architectural style and core technologies have been individually confirmed, and the user has explicitly confirmed the full architecture including API style guidance.
