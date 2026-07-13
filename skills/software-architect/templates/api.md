# API Design — Template

Saved at `docs/09-api-design/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/09-api-design.md`. Defines the interaction contracts — however this system is actually invoked — from the approved Use Cases, Database Design, and Architecture. No interaction unit exists without a Use Case behind it, and its style follows Architecture's guidance rather than being redecided here.

**This template is deliberately not JSON-API-shaped.** "API Design" is this phase's name, but the concept covers any interaction surface: an HTTP REST/GraphQL endpoint, a server-rendered MVC route (Laravel Blade, Rails views, Django templates — the route renders a view and redirects, there's no separate JSON contract), a CLI command, an event/message handler, or a public library/SDK function. Use whichever vocabulary actually fits this project; do not force a server-rendered route into REST-style request/response thinking just because the fields below default-read that way.

This category splits into an **index file** (`api.md`) and one **item file** per interaction unit (`api-001.md`, `api-002.md`, ...) — see `rules/document-locations.md`.

## Index file — `api.md`

```markdown
# API Design

## Interaction style
<Confirmed style, referencing the Architecture guidance it follows — or,
if it diverges, the ADR that documents why. Name it plainly: "server-
rendered MVC," "CLI command surface," etc. — never force-fit into REST
vocabulary if that's not what this project is.>

## Versioning strategy
<How this interaction surface is versioned, if it is at all.>

## Failure format
<The standard shape a failure takes — an HTTP error body, a redirect
with a flash message, a non-zero exit code with a stderr message, a
rejected/dead-lettered event — used consistently by every interaction
unit.>

| ID | Trigger | Traces to |
|---|---|---|
| [API-001](api-001.md) | `POST /orders/{id}/refund` | UC-003, ARCH-002 |
```

## Item file — `api-001.md`

```markdown
# API-001 — <short title>
*Traces to: UC-003, ARCH-002*

| Field | Value |
|---|---|
| Trigger | `POST /orders/{id}/refund` <however this unit is invoked: an HTTP method + route, a CLI command with its flags, an event/topic name, a function signature — whatever is native to the confirmed interaction style> |
| Input | <what goes in — fields/types for a JSON body, form fields for a server-rendered form, args/flags for a CLI command, a message payload shape for an event handler — referencing TBL-XXX where a field maps directly to a stored column> |
| Effect/output | <what happens / what comes back — a JSON response, a rendered view + redirect, stdout + exit code, a published event> |

**Failure modes**
| Condition | Response |
|---|---|
| Order not found | <the standard failure_format's shape for this case> |
| Refund window expired (BR-001) | ... |

```mermaid
sequenceDiagram
    ...
```
<One per critical flow — checkout, authentication, anything with real
consequence if it goes wrong — per rules/diagram-conventions.md. For a
CLI or single-process system where a sequence diagram adds no real
information, a `flowchart` of the logic is a valid substitute.>
```

## Fully Dressed additions

Item files gain four more rows in the `Field | Value` table, plus a new `Example` subsection. Full item file at this depth:

```markdown
# API-001 — <short title>
*Traces to: UC-003, ARCH-002*

| Field | Value |
|---|---|
| Trigger | `POST /orders/{id}/refund` <however this unit is invoked: an HTTP method + route, a CLI command with its flags, an event/topic name, a function signature — whatever is native to the confirmed interaction style> |
| Input | <what goes in — fields/types for a JSON body, form fields for a server-rendered form, args/flags for a CLI command, a message payload shape for an event handler — referencing TBL-XXX where a field maps directly to a stored column> |
| Effect/output | <what happens / what comes back — a JSON response, a rendered view + redirect, stdout + exit code, a published event> |
| Rate limiting | <Whether/how this unit is rate-limited, and the failure behavior when the limit is hit. "No rate limiting" is valid for an internal-only or low-traffic unit, if confirmed as such.> |
| Pagination | <Only for units that return a list — convention used (offset, cursor, page-based), and default/max page size. "(n/a) — not a list-returning unit" otherwise.> |
| Deprecation policy | <How this unit would be deprecated if it ever needs to be — notice period, sunset header, redirect. Can point to a project-wide policy stated once instead of repeating it per unit.> |
| Idempotency | <Whether calling this twice with the same input is safe, and if so how that's achieved (idempotency key, natural idempotency of the operation itself). Important for any unit with a real-world side effect (payments, sending messages) — "N/A, read-only" is valid for a pure query.> |

**Failure modes**
| Condition | Response |
|---|---|
| Order not found | <the standard failure_format's shape for this case> |
| Refund window expired (BR-001) | ... |

**Example**
<A concrete, filled-in example of one real request/invocation and its
successful response — not the abstract field list above, an actual
instance a reader can compare their own integration against.>

```
POST /orders/4821/refund
{ "reason": "damaged in transit" }

200 OK
{ "order_id": "4821", "status": "refunded", "refund_id": "rf_9182" }
```

```mermaid
sequenceDiagram
    ...
```
```

## Notes for whoever fills this in

- **Every interaction unit needs both `traces_to` targets** — a Use Case (what flow this serves) and an Architecture component (what implements it). A unit with only one is incomplete.
- **Every Use Case with a real interaction surface needs at least one unit**, unless it's explicitly a frontend-only flow with no backend involvement at all — documented as such, not silently absent.
- **Server-rendered / MVC style**: a "screen" in `templates/frontend.md` and an "interaction unit" here are often the same route. Don't manufacture a synthetic API call just to satisfy Frontend Planning's screen field — see `templates/frontend.md`'s notes for how the two documents reference each other without duplicating the same route twice.
- **Brownfield**: if there's an existing interaction surface being extended, interaction style, versioning strategy, and failure format record what's already in production, gathered as fact — new units conform to it rather than introducing a second convention.
- `API-XXX` IDs come from `project-state.md`'s `id_sequences.API`, global to the project, regardless of interaction style.
