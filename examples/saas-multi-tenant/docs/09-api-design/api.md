---
interaction_style: "REST"
versioning_strategy: "URL path versioning (/v1/...); breaking changes get a new version prefix."
failure_format: "JSON error body: { \"error\": { \"code\": string, \"message\": string } }, with standard HTTP status codes."
interactions:
  - id: API-001
    traces_to: ["UC-001", "ARCH-001"]
    trigger: "POST /v1/projects/{projectId}/tasks"
    input:
      description: "title (required), description (optional), assigneeId (optional). projectId from the path, referencing TBL-002; assigneeId references TBL-004."
    effect_or_output:
      description: "201, the created task (referencing TBL-003's columns), status 'to_do'."
    failure_modes:
      - condition: "projectId doesn't exist or belongs to another tenant"
        result: "404 — identical response either way, per REQ-003, no existence leak"
      - condition: "assigneeId isn't a member of the project's tenant"
        result: "422, error.code = 'invalid_assignee'"
      - condition: "title missing"
        result: "422, error.code = 'title_required'"
  - id: API-002
    traces_to: ["UC-002", "ARCH-001"]
    trigger: "GET /v1/projects/{projectId}/tasks?status=&assigneeId="
    input:
      description: "projectId from the path; status and assigneeId as optional query params."
    effect_or_output:
      description: "200, an array of tasks matching the filters, scoped to the caller's tenant (enforced by ARCH-002 regardless of what projectId is passed)."
    failure_modes:
      - condition: "projectId doesn't exist or belongs to another tenant"
        result: "404 — identical response either way, per REQ-003"
---

# API Design

## Interaction style
REST, per Architecture's guidance.

## Versioning strategy
URL path versioning (`/v1/...`).

## Failure format
JSON error body with `error.code` and `error.message`, standard HTTP status codes.

## Interactions

### API-001 — Create task
`POST /v1/projects/{projectId}/tasks` — traces to UC-001, ARCH-001.

### API-002 — List/filter tasks
`GET /v1/projects/{projectId}/tasks?status=&assigneeId=` — traces to UC-002, ARCH-001.

Authentication/authorization for both: see `docs/11-security/security.md` — both require an authenticated session; API-001 additionally requires the caller to be a member of the target project's tenant (enforced by ARCH-002, not by the endpoint itself re-checking).

```mermaid
sequenceDiagram
    participant TM as Team Member
    participant API as ARCH-001
    participant MW as ARCH-002 (Tenant Context)
    participant DB as PostgreSQL
    TM->>API: POST /v1/projects/{id}/tasks
    API->>MW: resolve tenant from session
    MW->>DB: insert task WHERE project.tenant_id = caller.tenant_id
    alt project belongs to another tenant
        DB-->>API: no rows affected
        API-->>TM: 404
    else success
        DB-->>API: task row
        API-->>TM: 201, task
    end
```
