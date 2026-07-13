# Domain Model — Template

Saved at `docs/06-domain-model/domain-model.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/06-domain-model.md`. Extracts entities, value objects, aggregates, and business invariants from the approved Use Cases — the conceptual foundation Database Design (phase 07) will translate into schema. Deliberately free of any database-shaped thinking; see "What this document must never contain" below.

## Structure

```yaml
---
entities:
  - id: ENT-001
    kind: "entity"
    # "entity" (has identity, mutable over time) | "value_object" (no identity, immutable)
    traces_to: ["UC-003"]
    # REQUIRED — at least one UC-XXX. Never blank.
    attributes:
      - "<conceptual attribute — a name and a plain-language meaning, not a column type>"
    invariants:
      - "<a rule that must always hold — REQUIRED, at least one entry; 'no special
         rules' is a valid explicit entry, an empty list is not>"
    aggregate_root: true
    # true if this entity is the consistency boundary for a transaction; false
    # if it's part of another entity's aggregate — see `belongs_to_aggregate`
    belongs_to_aggregate: null
    # ENT-XXX of the aggregate root, if this entity isn't one itself
relationships:
  - from: "ENT-001"
    to: "ENT-002"
    cardinality: "1-to-many"
    description: "<what the relationship means, in plain language>"
---
```

```markdown
# Domain Model

## Entities and value objects
<One subsection per ENT-XXX: kind, attributes, invariants, which aggregate
it belongs to (or that it's a root).>

## Aggregates
<One subsection per aggregate root: which entities/value objects it
contains, and what transactional consistency boundary it defines —
`[confirmation individual]`, this decision has real downstream cost if
wrong.>

## Relationships

```mermaid
classDiagram
    ...
```
```

## What this document must never contain

Any database-shaped thinking: table names, column types, foreign keys, indexes, normalization decisions. That's phase 07's job, working *from* this document — modeling it here is scope leakage from a later phase into this one. If a draft answer starts describing "a table with these columns," redirect to the conceptual question: what does this thing represent, and what must always be true about it — not how it will be stored.

## Notes for whoever fills this in

- Every entity needs at least one invariant, even if it's "none beyond basic validity" — an empty invariants list is a gate failure, not an acceptable minimal case.
- `ENT-XXX` IDs come from `project-state.md`'s `id_sequences.ENT`, global to the project.
- Aggregate boundaries (`aggregate_root` / `belongs_to_aggregate`) are always individually confirmed — this shapes phase 07's transaction boundaries directly.
