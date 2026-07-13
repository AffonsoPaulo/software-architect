# Domain Model — Template

Saved at `docs/06-domain-model/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/06-domain-model.md`. Extracts entities, value objects, aggregates, and business invariants from the approved Use Cases — the conceptual foundation Database Design (phase 07) will translate into schema. Deliberately free of any database-shaped thinking; see "What this document must never contain" below.

This category splits into an **index file** (`domain-model.md`) and one **item file** per entity/value object (`ent-001.md`, `ent-002.md`, ...) — see `rules/document-locations.md`. Aggregates, relationships, and the class diagram — which genuinely span multiple entities — stay in the index file.

## Index file — `domain-model.md`

```markdown
# Domain Model

| ID | Name | Kind | Belongs to aggregate | Traces to |
|---|---|---|---|---|
| [ENT-001](ent-001.md) | Recipe | Entity | itself is the root | UC-003 |

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

## Item file — `ent-001.md`

```markdown
# ENT-001 — <name>
*Kind: Entity · Traces to: UC-003*

**Attributes**
- <conceptual attribute — a name and a plain-language meaning, not a
  column type>

**Invariants**
- <a rule that must always hold — REQUIRED, at least one entry; "no
  special rules beyond basic validity" is a valid explicit entry, an
  empty list is not>

**Belongs to aggregate**: <ENT-XXX of the aggregate root, or "itself is
the root">
```

`Kind` is `Entity` (has identity, mutable over time) or `Value object` (no identity, immutable).

## Fully Dressed additions

Item files gain no new metadata keys, but the index file gains:

```markdown
## Ubiquitous language
<A short glossary — term, plain-language meaning, and where it's used.
The point is that everyone (user, AI, and later readers) uses these
exact words consistently instead of near-synonyms drifting apart across
documents.>

| Term | Meaning |
|---|---|
| ... | ... |

## Bounded context notes
<Only relevant once the project is large enough to have more than one
bounded context. Which context each entity belongs to, and where the
boundaries are — "(none) — single bounded context" is valid and common
for small/medium projects.>

## Domain events
<Meaningful things that happen in this domain, worth naming explicitly
— e.g. "OrderRefunded," "RecipePublished." One line each: what triggers
it, what (if anything) reacts to it. Only needed if events are actually
part of how this system is designed to communicate internally — not
manufactured for the sake of the section.>

## Example scenario walkthrough
<One concrete example, walked through in plain language, showing the
entities/invariants above actually working together for a real case —
e.g. "customer requests a refund on order #4821: the Order entity
transitions from Paid to Refunded, its invariant 'a refunded order
cannot be refunded again' holds, ...". Makes the abstract model
verifiable against a real case before Database Design builds on it.>
```

## What this document must never contain

Any database-shaped thinking: table names, column types, foreign keys, indexes, normalization decisions. That's phase 07's job, working *from* this document — modeling it here is scope leakage from a later phase into this one. If a draft answer starts describing "a table with these columns," redirect to the conceptual question: what does this thing represent, and what must always be true about it — not how it will be stored.

## Notes for whoever fills this in

- Every entity needs at least one invariant, even if it's "none beyond basic validity" — an empty invariants list is a gate failure, not an acceptable minimal case.
- `ENT-XXX` IDs come from `project-state.md`'s `id_sequences.ENT`, global to the project.
- Aggregate boundaries are always individually confirmed — this shapes phase 07's transaction boundaries directly.
