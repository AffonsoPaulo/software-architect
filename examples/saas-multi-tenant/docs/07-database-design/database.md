---
database_type: "relational"
tables:
  - id: TBL-001
    name: "tenants"
    traces_to: ["ENT-001"]
    columns:
      - name: "id"
        type: "uuid"
        constraints: ["primary key"]
      - name: "name"
        type: "text"
        constraints: ["not null"]
      - name: "created_at"
        type: "timestamptz"
        constraints: ["not null", "default now()"]
    indexes: []
  - id: TBL-002
    name: "projects"
    traces_to: ["ENT-002"]
    columns:
      - name: "id"
        type: "uuid"
        constraints: ["primary key"]
      - name: "tenant_id"
        type: "uuid"
        constraints: ["foreign key -> tenants.id", "not null"]
      - name: "name"
        type: "text"
        constraints: ["not null"]
    indexes:
      - "index on tenant_id — every project list query is scoped by tenant"
  - id: TBL-003
    name: "tasks"
    traces_to: ["ENT-003"]
    columns:
      - name: "id"
        type: "uuid"
        constraints: ["primary key"]
      - name: "project_id"
        type: "uuid"
        constraints: ["foreign key -> projects.id", "not null"]
      - name: "title"
        type: "text"
        constraints: ["not null"]
      - name: "description"
        type: "text"
        constraints: []
      - name: "status"
        type: "text"
        constraints: ["not null", "check in ('to_do','in_progress','done','deleted')"]
      - name: "assignee_id"
        type: "uuid"
        constraints: ["foreign key -> users.id", "nullable"]
    indexes:
      - "composite index on (project_id, status) — the task board query filters by both"
      - "index on assignee_id — the 'my tasks' filter"
  - id: TBL-004
    name: "users"
    traces_to: ["ENT-004"]
    columns:
      - name: "id"
        type: "uuid"
        constraints: ["primary key"]
      - name: "tenant_id"
        type: "uuid"
        constraints: ["foreign key -> tenants.id", "not null"]
      - name: "email"
        type: "text"
        constraints: ["not null", "unique per tenant_id"]
      - name: "role"
        type: "text"
        constraints: ["not null", "check in ('project_admin','team_member')"]
migration_strategy: "Versioned SQL migrations, applied automatically in CI before deploy — `[confirmation individual]`."
---

# Database Design

## Database type
Relational (PostgreSQL) — `[confirmation individual]`, confirmed for strong relational integrity across tenants/projects/tasks and mature row-level security support, which Architecture's tenant-isolation approach relies on (see `docs/08-architecture/architecture.md`).

## Tables

See front-matter for full column/constraint detail. Every table traces to its Domain Model entity: `tenants`→ENT-001, `projects`→ENT-002, `tasks`→ENT-003, `users`→ENT-004.

## Migration strategy
Versioned SQL migrations, applied automatically in CI before deploy — `[confirmation individual]`.

```mermaid
erDiagram
    TENANTS ||--o{ PROJECTS : has
    PROJECTS ||--o{ TASKS : has
    USERS ||--o{ TASKS : "assigned to"
    TENANTS ||--o{ USERS : has
```
