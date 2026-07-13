# Database Design — Template

Saved at `docs/07-database-design/database.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/07-database-design.md`. Translates the approved Domain Model into a physical/logical database schema — the first phase where storage-shaped decisions are actually allowed.

## Structure

```yaml
---
database_type: "relational"
# "relational" | "document" | "graph" | "mixed" — `[confirmation individual]`,
# and never assumed by default. In brownfield mode, this records what's
# already in production and non-negotiable rather than a fresh choice.
tables:
  - id: TBL-001
    name: "orders"
    traces_to: ["ENT-001"]
    # REQUIRED — at least one ENT-XXX. Every table exists because an entity
    # (or part of one) needs to be persisted.
    columns:
      - name: "id"
        type: "uuid"
        constraints: ["primary key"]
      - name: "customer_id"
        type: "uuid"
        constraints: ["foreign key -> customers.id", "not null"]
    indexes:
      - "<index description and the access pattern it serves>"
migration_strategy: "<how schema changes are versioned and applied — `[confirmation individual]`>"
---
```

```markdown
# Database Design

## Database type
<Confirmed type and the reason — or, in brownfield mode, what's already
in production.>

## Tables / collections
<One subsection per TBL-XXX: columns with type and constraints, indexes
tied to a stated access pattern (not "just in case"), relationships.>

## Migration strategy
<How schema changes will be versioned and applied.>

```mermaid
erDiagram
    ...
```
```

## Notes for whoever fills this in

- **Every `ENT-XXX` from the Domain Model needs a corresponding `TBL-XXX`**, unless there's an explicit, stated reason it doesn't (e.g. a value object embedded directly into its parent entity's row rather than getting its own table). The reason is recorded, not just implied by absence.
- **Brownfield**: if the project type recorded in `project-state.md` is "feature on existing product" or "legacy migration," `database_type` records what's already in production — this is a fact-gathering question, not a free design choice. New tables for this increment still get fresh `TBL-XXX` entries and still need their own `traces_to`.
- `TBL-XXX` IDs come from `project-state.md`'s `id_sequences.TBL`, global to the project.
- Foreign keys must be consistent with the Domain Model's relationships (`docs/06-domain-model/domain-model.md`) — a foreign key implying a relationship the Domain Model doesn't have is a sign the Domain Model needs revisiting via `rules/change-management.md`, not that the Database Design should silently diverge from it.
