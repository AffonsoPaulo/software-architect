# API Design — Template

Saved at `docs/09-api-design/api.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/09-api-design.md`. Defines the interaction contracts — however this system is actually invoked — from the approved Use Cases, Database Design, and Architecture. No interaction unit exists without a Use Case behind it, and its style follows Architecture's guidance rather than being redecided here.

**This template is deliberately not JSON-API-shaped.** "API Design" is this phase's name, but the concept covers any interaction surface: an HTTP REST/GraphQL endpoint, a server-rendered MVC route (Laravel Blade, Rails views, Django templates — the route renders a view and redirects, there's no separate JSON contract), a CLI command, an event/message handler, or a public library/SDK function. Use whichever vocabulary actually fits this project; do not force a server-rendered route into REST-style request/response thinking just because the fields below default-read that way.

## Structure

```yaml
---
interaction_style: "REST"
# Confirmed in phase 08 (Architecture); only redecided here — as a new,
# consequential, `[confirmation individual]` decision — if it genuinely
# diverges from that guidance. Not limited to REST/GraphQL/RPC — see
# templates/architecture.md's interaction_style_guidance for the full
# range of examples.
versioning_strategy: "<how this interaction surface is versioned, if it is at all>"
failure_format: "<the standard shape a failure takes — an HTTP error body,
  a redirect with a flash message, a non-zero exit code with a stderr
  message, a rejected/dead-lettered event — used consistently by every
  interaction unit>"
interactions:
  - id: API-001
    traces_to: ["UC-003", "ARCH-002"]
    # REQUIRED — both a UC-XXX (the flow this implements) and an ARCH-XXX
    # (the component that hosts it). Neither is optional.
    trigger: "POST /orders/{id}/refund"
    # However this unit is invoked: an HTTP method + route, a CLI command
    # with its flags, an event/topic name, a function signature — whatever
    # is native to the confirmed interaction_style.
    input:
      description: "<what goes in — fields/types for a JSON body, form
        fields for a server-rendered form, args/flags for a CLI command,
        a message payload shape for an event handler — referencing
        TBL-XXX where a field maps directly to a stored column>"
    effect_or_output:
      description: "<what happens / what comes back — a JSON response, a
        rendered view + redirect, stdout + exit code, a published event>"
    failure_modes:
      - condition: "Order not found"
        result: "<HTTP 404 / a 'not found' rendered page / CLI exit code 1
          with a stderr message / whatever this interaction_style's
          failure_format actually looks like>"
      - condition: "Refund window expired (BR-001)"
        result: "..."
---
```

```markdown
# API Design

## Interaction style
<Confirmed style, referencing the Architecture guidance it follows — or,
if it diverges, the ADR that documents why. Name it plainly: "server-
rendered MVC," "CLI command surface," etc. — never force-fit into REST
vocabulary if that's not what this project is.>

## Versioning strategy
...

## Failure format
<The single standard shape every interaction unit's failures follow, in
whatever form is native to this interaction style.>

## Interactions
<One subsection per API-XXX: trigger, input, effect/output, failure
modes, and which Use Case + Architecture component it traces to.>

```mermaid
sequenceDiagram
    ...
```
<One per critical flow — checkout, authentication, anything with real
consequence if it goes wrong — per rules/diagram-conventions.md. For a
CLI or single-process system where a sequence diagram adds no real
information, a `flowchart` of the logic is a valid substitute — use
judgment, per rules/diagram-conventions.md.>
```

## Notes for whoever fills this in

- **Every interaction unit needs both `traces_to` targets** — a Use Case (what flow this serves) and an Architecture component (what implements it). A unit with only one is incomplete.
- **Every Use Case with a real interaction surface needs at least one unit**, unless it's explicitly a frontend-only flow with no backend involvement at all — documented as such, not silently absent.
- **Server-rendered / MVC style**: a "screen" in `templates/frontend.md` and an "interaction unit" here are often the same route. Don't manufacture a synthetic API call just to satisfy Frontend Planning's `api_calls` field — see `templates/frontend.md`'s notes for how the two documents reference each other without duplicating the same route twice.
- **Brownfield**: if there's an existing interaction surface being extended, `interaction_style`, `versioning_strategy`, and `failure_format` record what's already in production, gathered as fact — new units conform to it rather than introducing a second convention.
- `API-XXX` IDs come from `project-state.md`'s `id_sequences.API`, global to the project, regardless of interaction style.
