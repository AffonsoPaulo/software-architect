# API Design — Template

Saved at `docs/09-api-design/api.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/09-api-design.md`. Defines API contracts from the approved Use Cases, Database Design, and Architecture — no endpoint exists without a Use Case behind it, and the API style follows Architecture's guidance rather than being redecided here.

## Structure

```yaml
---
api_style: "REST"
# Confirmed in phase 08 (Architecture); only redecided here — as a new,
# consequential, `[confirmation individual]` decision — if it genuinely
# diverges from that guidance.
versioning_strategy: "<how the API is versioned>"
error_format: "<the standard error response shape, used by every endpoint>"
endpoints:
  - id: API-001
    traces_to: ["UC-003", "ARCH-002"]
    # REQUIRED — both a UC-XXX (the flow this implements) and an ARCH-XXX
    # (the component that hosts it). Neither is optional.
    method: "POST"
    route: "/orders/{id}/refund"
    request_schema:
      description: "<fields, types, required/optional — referencing TBL-XXX where a field maps directly to a stored column>"
    response_schema:
      description: "<same, for the response>"
    error_codes:
      - code: 404
        meaning: "Order not found"
      - code: 422
        meaning: "Refund window expired (BR-001)"
---
```

```markdown
# API Design

## API style
<Confirmed style, referencing the Architecture guidance it follows — or,
if it diverges, the ADR that documents why.>

## Versioning strategy
...

## Error format
<The single standard shape every endpoint's errors follow.>

## Endpoints
<One subsection per API-XXX: method, route, request/response schema, error
codes, and which Use Case + Architecture component it traces to.>

```mermaid
sequenceDiagram
    ...
```
<One per critical flow — checkout, authentication, anything with real
consequence if it goes wrong — per rules/diagram-conventions.md.>
```

## Notes for whoever fills this in

- **Every endpoint needs both `traces_to` targets** — a Use Case (what flow this serves) and an Architecture component (what implements it). An endpoint with only one is incomplete.
- **Every Use Case with a real API surface needs at least one endpoint**, unless it's explicitly a frontend-only flow (no backend API call involved) — documented as such, not silently absent.
- **Brownfield**: if there's an existing API being extended, `api_style`, `versioning_strategy`, and `error_format` record what's already in production, gathered as fact — new endpoints conform to it rather than introducing a second convention.
- `API-XXX` IDs come from `project-state.md`'s `id_sequences.API`, global to the project.
