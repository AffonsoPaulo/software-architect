# Playbook 09 — API Design

> Runs after Architecture (phase 08) by design — interaction contracts detail the style orientation already decided there. See `plan-00-overview.md` decision from the 2nd planning revision.
>
> **"API Design" is this phase's name, not a constraint on what it covers.** This Skill targets any system in any language — a REST/GraphQL/RPC API is one possible shape, but so is a server-rendered MVC monolith (Laravel Blade, Rails views, Django templates), a CLI command surface, an event/message handler, or a library/SDK's public interface. Every question and template field below is written to be answered in whatever vocabulary actually fits the project — never force a server-rendered route into JSON request/response thinking just because that's the common case.

## Objective

Define the interaction contracts — however this system is actually invoked — from the approved Use Cases, Database Design, and Architecture. No interaction unit exists without a Use Case behind it, and its style follows Architecture's guidance rather than being redecided from zero.

## When to run

Whenever `docs/project-state.md` marks phase 09 as included — in practice, whenever the project has any interaction surface at all, of any kind.

## When NOT to run

Skippable only for projects with genuinely no interaction surface to design (e.g. a script with no invocation contract beyond "run it," or a project where this is fully covered by Domain Model + Database Design alone). Calibration decides this.

## Inputs

- `docs/05-use-cases/use-cases.md` — approved.
- `docs/07-database-design/database.md` — approved.
- `docs/08-architecture/architecture.md` — approved, specifically its `interaction_style_guidance`.
- `docs/00-calibration/calibration.md` — project type and, if brownfield, subagent research.

## Outputs

- `docs/09-api-design/api.md`.

## Documents produced

- `docs/09-api-design/api.md` (index: interaction style, versioning, failure format) plus one `docs/09-api-design/api-XXX.md` per interaction unit, via `templates/api.md` (`rules/document-locations.md`).

## Mandatory questions

- Confirm the interaction style already oriented in Architecture (phase 08), and detail it in whatever vocabulary actually fits — REST/GraphQL/RPC, server-rendered MVC routes, CLI commands, event handlers, a library's public functions — `[confirmation individual]` only if it diverges from phase 08's orientation (in which case it's a new, consequential decision); if brownfield, confirm new units follow the convention already in production
- For each Use Case: which interaction unit(s) implement the flow?
- Authentication/authorization strategy at this level (fine detail belongs to phase 11-Security; here, only the mechanism decision) — `[confirmation individual]`
- Versioning strategy (if applicable to this style) and standard failure format?

**Fully Dressed only** (`rules/documentation-depth.md`), per interaction unit:
- What does one concrete, filled-in example request/invocation and its successful response look like?
- Is this unit rate-limited? If so, how, and what's the failure behavior when the limit is hit?
- For list-returning units: what pagination convention is used?
- How would this unit be deprecated if it ever needs to be?
- Is calling this unit twice with the same input safe (idempotent)? If so, how is that achieved?

## Optional questions

- Whether specific flows warrant a dedicated `sequenceDiagram` beyond the critical-flow ones that always get one, or whether a `flowchart` fits better for a single-process/CLI-style project (`rules/diagram-conventions.md`).

## Interview flow

1. Confirm interaction style against Architecture's guidance first — this is usually a quick confirmation, not a fresh decision; only escalate to a full individually-confirmed decision if the user wants to diverge. If Architecture's guidance was vague, ask openly what the project actually is before offering REST as an example — offering it first biases the answer.
2. Versioning strategy and failure format next — these apply globally, so settling them before individual units keeps every one of them consistent from the start rather than retrofitted later.
3. Authentication/authorization mechanism — `[confirmation individual]`.
4. Walk the Use Cases one at a time, deriving interaction unit(s) for each, with input, effect/output, and failure modes in whatever shape this style actually takes.
5. Identify critical flows (checkout, authentication, anything consequential) and build their diagrams once the relevant units are settled.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Authentication/authorization mechanism is always individually confirmed. Interaction style is individually confirmed only if it diverges from Architecture's guidance — a straightforward confirmation of what Architecture already decided doesn't need the full individual treatment, but any new divergent decision does.

## How to document answers

Each confirmed interaction unit becomes its own `docs/09-api-design/api-XXX.md` item file with `Traces to` set to both its source `UC-XXX` and its hosting `ARCH-XXX`, with a matching row added to `api.md`'s index table. Input/output fields reference `TBL-XXX` columns where a field maps directly to stored data. Failure modes follow the single confirmed format — never a one-off shape for a specific unit. For server-rendered/MVC projects, document each unit once here rather than duplicating it as a separate "screen" in `docs/10-frontend-planning/frontend.md` — see that phase's notes on referencing rather than restating. At Fully Dressed depth, the additional answers map to `templates/api.md`'s "Fully Dressed additions" subsections.

## How to validate answers

- Every interaction unit has both `traces_to` targets (Use Case and Architecture component) — never just one.
- Every Use Case with a real interaction surface has at least one corresponding unit, or an explicit note that it's frontend-only with no backend involvement.
- Failure format is consistent across every unit — no ad hoc exceptions.
- No unexplained divergence from phase 08's interaction style guidance.
- The vocabulary used actually fits the confirmed style — a CLI project's units aren't awkwardly described as HTTP routes, a server-rendered project's units aren't described as if they return JSON.

## Special cases

- **Brownfield, existing interaction surface being extended**: style, versioning, and failure format are fact-gathering questions about what's already in production, not fresh design choices. Use Calibration's subagent findings; if the existing conventions aren't clear from that context, trigger a new read-only subagent here rather than asking the user something the code already answers.
- **Server-rendered / MVC style**: a "screen" (phase 10) and an interaction unit (this phase) are frequently the same route. Document the route once, here, and have phase 10 reference it rather than re-describing it.
- **Use Case with no natural interaction unit**: valid when the flow is entirely client-side (e.g. a purely local UI interaction with no backend call) — record this explicitly rather than leaving the Use Case silently uncovered.
- **Interaction style diverges from Architecture's guidance**: treat as a new consequential decision — individually confirmed, and probably warrants its own ADR back in `docs/08-architecture/adr/` if it's significant enough (via `rules/change-management.md` if Architecture was already approved).

## Common ambiguities

- A Use Case that seems to need multiple interaction units when it's actually one unit with different parameters — ask whether these are really distinct operations or variations of the same one before creating separate `API-XXX` entries.
- "We'll figure out error handling as we go" — push for the standard failure format now; retrofitting consistency later is exactly the kind of undocumented drift this phase exists to prevent.
- Assuming "API" means "JSON over HTTP" without checking — always confirm the actual interaction style before drafting anything, especially when Architecture's guidance was high-level enough to leave this ambiguous.
- Whether a plain, display-only route (a GET that just renders a page, with no meaningful input or effect beyond that) needs its own `API-XXX` entry: it doesn't, if `docs/10-frontend-planning/frontend.md`'s corresponding screen already carries `traces_to` back to the same Use Case — documenting both would be the same redundancy the server-rendered special case above already warns against. Give a route its own `API-XXX` when there's an actual input/effect/failure mode worth specifying (a mutation, a filtered/parameterized query); leave a purely-rendering route implicit in its screen otherwise.

## Frequent errors

- An interaction unit with a Use Case link but no Architecture component link, or vice versa.
- Silently redesigning the interaction style instead of confirming Architecture's guidance or flagging a genuine divergence.
- Forcing a server-rendered route, CLI command, or event handler into REST-shaped request/response vocabulary because the template's fields default-read that way — the fields are meant to hold whatever shape actually fits, not to imply JSON.
- Skipping the flow diagram for a genuinely critical flow because it feels obvious.

## Examples

> AI: "Architecture oriented us toward a single REST API. For the refund Use Case (UC-014), I'm proposing: POST /orders/{id}/refund, hosted by the Order Service component (ARCH-003). Input: none beyond the order id in the path. Effect/output: updated order status, returned as JSON. Failure modes: 404 if the order doesn't exist, 422 if outside the refund window (BR-001). Does this match the flow?"
> User: "Yes, but add a reason field to the request — support needs to log why a manual refund was issued."
> AI: "Updating the input to include an optional `reason` string field, used when support initiates the refund. Confirm?"

> AI (server-rendered project): "For the refund Use Case (UC-014), I'm proposing: POST /orders/{id}/refund, a Blade route handled by the Order Controller (ARCH-003). Input: the order id from the URL, no request body beyond a CSRF token. Effect/output: on success, redirects to the order page with a flash message confirming the refund; on failure, redirects back with a flash error. This is also the same route Frontend Planning will reference as the 'Order Details' screen's refund action, not a separate call. Does this match?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent an interaction unit without a Use Case behind it, never redesign the interaction style Architecture already oriented without treating it as the new, individually-confirmed decision it actually is, and never default to REST/JSON vocabulary without confirming that's actually what this project is — this Skill must work equally well for a Laravel Blade CRUD, a Python CLI, or a Node REST API.

## Checklist

`checklists/09-api-design-checklist.md`

## Quality Gate

`quality-gates/09-api-design-gate.md`. Summary: every interaction unit traces to a Use Case and an Architecture component; no relevant Use Case left without one (or justification); failure format consistent; no unjustified divergence from phase 08's interaction style.

## Approval criteria

This phase is done when every interaction unit has both required `traces_to` links, every Use Case with an interaction surface is covered, failure format and versioning are confirmed, authentication/authorization mechanism is individually confirmed, and the user has explicitly confirmed the full design in vocabulary that actually matches the project's real interaction style.
