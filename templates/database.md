# Database Design — Template

Saved at `docs/07-database-design/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/07-database-design.md`. Translates the approved Domain Model into a physical/logical database schema — the first phase where storage-shaped decisions are actually allowed.

This category splits into an **index file** (`database.md`) and one **item file** per table/collection (`tbl-001.md`, `tbl-002.md`, ...) — see `rules/document-locations.md`. Column detail is a plain markdown table inside each item file (not a metadata line — see `rules/document-format.md`'s "Tables for structured, non-traceability data").

## Index file — `database.md`

```markdown
# Database Design

## Database type
<Confirmed type — relational / document / graph / mixed,
`[confirmation individual]`, never assumed by default — and the reason.
In brownfield mode, this records what's already in production and
non-negotiable rather than a fresh choice.>

| ID | Table | Traces to |
|---|---|---|
| [TBL-001](tbl-001.md) | orders | ENT-001 |

## Migration strategy
<How schema changes will be versioned and applied — `[confirmation individual]`.>

```mermaid
erDiagram
    ...
```
```

## Item file — `tbl-001.md`

```markdown
# TBL-001 — orders
*Traces to: ENT-001*

| Column | Type | Constraints |
|---|---|---|
| id | uuid | primary key |
| customer_id | uuid | foreign key -> customers.id, not null |

**Indexes**
- <index description and the access pattern it serves>
```

## Fully Dressed additions

Item files gain:

```markdown
# TBL-001 — orders
*Traces to: ENT-001*

| Column | Type | Constraints |
|---|---|---|
| ... | ... | ... |

**Indexes**
- ...

**Normalization notes**
<Why this table is shaped the way it is — normalized to reduce
duplication, or deliberately denormalized for a stated performance
reason. "Standard 3NF, no deviations" is valid and often the whole
answer.>

**Retention and archival**
<How long this data is kept, and what happens after — archived,
deleted, anonymized. "Kept indefinitely, no archival policy" is a valid
explicit answer, not a gap, as long as it was actually confirmed.>
```

The index file gains:

```markdown
## Data dictionary
<Business-meaning definitions, distinct from the column tables in each
item file — what each column actually MEANS to the business, not just
its SQL type.>

| Table.Column | Business meaning |
|---|---|
| orders.status | Where the order is in its lifecycle: draft, paid,
  shipped, refunded, cancelled — see ENT-001's invariants for valid
  transitions |

## Backup and recovery expectations
<Backup frequency, retention, and the recovery point/time objective this
schema needs to support — detailed disaster-recovery planning belongs to
Deployment (phase 13), this is just what the schema itself needs to
accommodate (e.g. point-in-time recovery requires certain write patterns).>

## Sample / seed data
<What seed/sample data this project needs for development and testing —
e.g. "a fixture set of 20 orders across every status" — and where it
will live (migration scripts, a fixtures file). "None beyond empty
tables" is valid for a project with no such need.>
```

## Notes for whoever fills this in

- **Every `ENT-XXX` from the Domain Model needs a corresponding `TBL-XXX`**, unless there's an explicit, stated reason it doesn't (e.g. a value object embedded directly into its parent entity's row rather than getting its own table). The reason is recorded, not just implied by absence.
- **Brownfield**: if the project type recorded in `project-state.md` is "feature on existing product" or "legacy migration," database type records what's already in production — this is a fact-gathering question, not a free design choice. New tables for this increment still get fresh `TBL-XXX` entries and still need their own `traces_to`.
- `TBL-XXX` IDs come from `project-state.md`'s `id_sequences.TBL`, global to the project.
- Foreign keys must be consistent with the Domain Model's relationships (`docs/06-domain-model/domain-model.md`) — a foreign key implying a relationship the Domain Model doesn't have is a sign the Domain Model needs revisiting via `rules/change-management.md`, not that the Database Design should silently diverge from it.
