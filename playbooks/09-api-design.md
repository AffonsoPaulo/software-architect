# Playbook 09 — API Design

> Runs after Architecture (phase 08) by design — API contracts detail the style orientation (REST/GraphQL/RPC, single vs. multiple APIs) already decided there. See `plan-00-overview.md` decision from the 2nd planning revision.

## Objective

Define API contracts from the approved Use Cases, Database Design, and Architecture — no endpoint exists without a Use Case behind it, and the API style follows Architecture's guidance rather than being redecided from zero.

## When to run

Whenever `docs/project-state.md` marks phase 09 as included — in practice, whenever the project exposes any API surface at all.

## When NOT to run

Skippable only for projects with genuinely no API (e.g. a purely local tool with no client/server boundary). Calibration decides this.

## Inputs

- `docs/05-use-cases/use-cases.md` — approved.
- `docs/07-database-design/database.md` — approved.
- `docs/08-architecture/architecture.md` — approved, specifically its `api_style_guidance`.
- `docs/00-calibration/calibration.md` — project type and, if brownfield, subagent research.

## Outputs

- `docs/09-api-design/api.md`.

## Documents produced

- `docs/09-api-design/api.md` via `templates/api.md`.

## Mandatory questions

- Confirm the API style already oriented in Architecture (phase 08), and detail it: REST/GraphQL/RPC, reasoning — `[confirmation individual]` only if it diverges from phase 08's orientation (in which case it's a new, consequential decision); if brownfield, confirm new endpoints follow the style already in production
- For each Use Case: which endpoint(s) implement the flow?
- Authentication/authorization strategy at the API level (fine detail belongs to phase 11-Security; here, only the mechanism decision) — `[confirmation individual]`
- Versioning strategy and standard error format?

## Optional questions

- Whether specific endpoints warrant a dedicated `sequenceDiagram` beyond the critical-flow ones that always get one.

## Interview flow

1. Confirm API style against Architecture's guidance first — this is usually a quick confirmation, not a fresh decision; only escalate to a full individually-confirmed decision if the user wants to diverge.
2. Versioning strategy and error format next — these apply globally, so settling them before individual endpoints keeps every endpoint consistent from the start rather than retrofitted later.
3. Authentication/authorization mechanism — `[confirmation individual]`.
4. Walk the Use Cases one at a time, deriving endpoint(s) for each, with request/response schema and error codes.
5. Identify critical flows (checkout, authentication, anything consequential) and build their `sequenceDiagram`s once the relevant endpoints are settled.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Authentication/authorization mechanism is always individually confirmed. API style is individually confirmed only if it diverges from Architecture's guidance — a straightforward confirmation of what Architecture already decided doesn't need the full individual treatment, but any new divergent decision does.

## How to document answers

Each confirmed endpoint becomes an `API-XXX` entry with `traces_to` set to both its source `UC-XXX` and its hosting `ARCH-XXX`. Request/response schemas reference `TBL-XXX` columns where a field maps directly to stored data. Error codes and format follow the single confirmed standard — never a one-off shape for a specific endpoint.

## How to validate answers

- Every endpoint has both `traces_to` targets (Use Case and Architecture component) — never just one.
- Every Use Case with a real API surface has at least one corresponding endpoint, or an explicit note that it's frontend-only.
- Error format is consistent across every endpoint — no ad hoc exceptions.
- No unexplained divergence from phase 08's API style guidance.

## Special cases

- **Brownfield, existing API being extended**: style, versioning, and error format are fact-gathering questions about what's already in production, not fresh design choices. Use Calibration's subagent findings; if the existing API's conventions aren't clear from that context, trigger a new read-only subagent here rather than asking the user something the code already answers.
- **Use Case with no natural endpoint**: valid when the flow is entirely client-side (e.g. a purely local UI interaction with no backend call) — record this explicitly rather than leaving the Use Case silently uncovered.
- **API style diverges from Architecture's guidance**: treat as a new consequential decision — individually confirmed, and probably warrants its own ADR back in `docs/08-architecture/adr/` if it's significant enough (via `rules/change-management.md` if Architecture was already approved).

## Common ambiguities

- A Use Case that seems to need multiple endpoints when it's actually one endpoint with different parameters — ask whether these are really distinct operations or variations of the same one before creating separate `API-XXX` entries.
- "We'll figure out error codes as we go" — push for the standard format now; retrofitting consistency later is exactly the kind of undocumented drift this phase exists to prevent.

## Frequent errors

- An endpoint with a Use Case link but no Architecture component link, or vice versa.
- Silently redesigning the API style instead of confirming Architecture's guidance or flagging a genuine divergence.
- Skipping the sequence diagram for a genuinely critical flow because it feels obvious.

## Examples

> AI: "Architecture oriented us toward a single REST API. For the refund Use Case (UC-014), I'm proposing: POST /orders/{id}/refund, hosted by the Order Service component (ARCH-003). Request: none beyond the order id in the path. Response: updated order status. Error codes: 404 if the order doesn't exist, 422 if outside the refund window (BR-001). Does this match the flow?"
> User: "Yes, but add a reason field to the request — support needs to log why a manual refund was issued."
> AI: "Updating the request schema to include an optional `reason` string field, used when support initiates the refund. Confirm?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent an endpoint without a Use Case behind it, and never redesign the API style Architecture already oriented without treating it as the new, individually-confirmed decision it actually is.

## Checklist

`checklists/09-api-design-checklist.md`

## Quality Gate

`quality-gates/09-api-design-gate.md`. Summary: every endpoint traces to a Use Case and an Architecture component; no relevant Use Case left without an endpoint (or justification); error format consistent; no unjustified divergence from phase 08's API style.

## Approval criteria

This phase is done when every endpoint has both required `traces_to` links, every Use Case with an API surface is covered, error format and versioning are confirmed, authentication/authorization mechanism is individually confirmed, and the user has explicitly confirmed the full API design.
