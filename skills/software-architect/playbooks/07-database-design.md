# Playbook 07 — Database Design

## Objective

Translate the approved Domain Model into a physical/logical database schema. The first phase where storage-shaped decisions — tables, columns, types, indexes — are actually appropriate; everything before this deliberately avoided them (see `playbooks/06-domain-model.md`'s anti-pattern section).

## When to run

Whenever `docs/project-state.md` marks phase 07 as included — in practice, whenever the Domain Model phase ran.

## When NOT to run

Skippable only alongside Domain Model, for projects with no persistence layer at all.

## Inputs

- `docs/06-domain-model/domain-model.md` — approved.
- `docs/00-calibration/calibration.md` — specifically the project type (greenfield vs. brownfield/migration) and, if brownfield, the subagent's research summary.

## Outputs

- `docs/07-database-design/database.md`.

## Documents produced

- `docs/07-database-design/database.md` (index: database type, migration strategy, diagram) plus one `docs/07-database-design/tbl-XXX.md` per table/collection, via `templates/database.md` (`rules/document-locations.md`).

## Mandatory questions

- Database type (relational/document/graph/mixed) and why — `[confirmation individual]`; in brownfield mode, this becomes "what database is already in use and non-negotiable?"
- For each Domain Model entity: which attributes become columns/fields, their data types, and whether they're required?
- Primary/foreign keys, uniqueness constraints, expected indexes (grounded in known access patterns, not speculative)?
- Migration and schema versioning strategy — `[confirmation individual]`

**Fully Dressed only** (`rules/documentation-depth.md`):
- For columns whose meaning isn't obvious from name/type alone: what does this column actually mean to the business?
- Is this table's shape normalized, or deliberately denormalized for a stated reason?
- How long is this data retained, and what happens after (archived, deleted, anonymized)?
- What are the backup frequency and recovery point/time objectives this schema needs to support?
- Does this project need seed/sample data for development and testing? What, and where will it live?

## Optional questions

- Partitioning/sharding strategy, only if the project's scale (from Calibration) makes it relevant now rather than a later optimization.

## Interview flow

1. Check project type in `project-state.md` first. If brownfield/migration, this phase's opening question changes shape entirely — see "Special cases."
2. Database type — greenfield: ask and confirm with reasoning; brownfield: confirm what's already there.
3. Walk the Domain Model entity by entity — for each, derive columns from its confirmed attributes, then ask about keys/constraints/indexes specific to it.
4. Migration strategy, once the schema shape is settled.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Database type and migration strategy are always individually confirmed — both are expensive to reverse once other phases (API, Architecture) start depending on them.

## How to document answers

Each confirmed table/collection becomes its own `docs/07-database-design/tbl-XXX.md` item file, `Traces to` set to the Domain Model entity (or entities) it persists, with a matching row added to `database.md`'s index table. Columns, constraints, and indexes are recorded per the confirmed answers — never inferred beyond what was actually asked and confirmed. The `erDiagram` (`rules/diagram-conventions.md`) is built from this confirmed data. At Fully Dressed depth, the additional answers map to `templates/database.md`'s "Fully Dressed additions" section.

## How to validate answers

- Every `ENT-XXX` from the Domain Model has a corresponding `TBL-XXX`, or an explicit, stated reason it doesn't (e.g. embedded value object).
- Every `TBL-XXX` has `traces_to` pointing to a real entity.
- Foreign keys are consistent with the Domain Model's relationships — no FK implying a relationship the Domain Model never established.
- Indexes are tied to a stated access pattern, not added speculatively "just in case."

## Special cases

- **Brownfield/migration**: database type is a fact-gathering question ("what's already there"), not a free design choice — use Calibration's subagent research if available (`rules/delegation-policy.md`) as a starting point, but still confirm explicitly with the user, especially for what is and isn't allowed to change. New tables for this increment still get proper `traces_to` links like any other phase.
- **Value object embedded in its parent's table**: a legitimate reason for an entity to have no standalone `TBL-XXX` — record this explicitly rather than leaving the entity unaddressed.
- **Domain Model relationship with no matching FK, or vice versa**: a real inconsistency, not something to silently resolve in this phase by picking one side — flag it and, if the Domain Model itself needs to change, that goes through `rules/change-management.md` rather than being patched here.

## Common ambiguities

- "We'll add an index for performance" without a stated access pattern — ask what query this index actually serves; if there isn't one yet, it's speculative and should wait.
- Assuming a data type without confirming it — e.g. defaulting to a generic string type for something that's actually an enum or a bounded set of values worth constraining at the schema level.

## Frequent errors

- Leaving a Domain Model entity without a table and without a stated reason.
- Assuming the database type instead of asking — never-default here even when a type seems "obviously" appropriate for the project, the same invariant `rules/ai-invariants.md` states generally, applied to the one decision this phase is most tempted to skip confirming.
- Diverging from the Domain Model's relationships without flagging it as an inconsistency requiring resolution.

## Examples

> AI: "For the Order entity: 'id' — should this be a UUID or an auto-incrementing integer?"
> User: "UUID, we need these to be unguessable since they appear in customer-facing URLs."
> AI: "Got it — id: uuid, primary key. And for 'customer_id' on Order, since the Domain Model has Order referencing exactly one Customer: foreign key to customers.id, not null. Does that match?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never assume a database engine or type without explicit confirmation, even one that seems like the obvious default for this kind of project — and never invent a schema detail (a column, a constraint, an index) that wasn't actually asked about and confirmed.

## Checklist

`checklists/07-database-design-checklist.md`

## Quality Gate

`quality-gates/07-database-design-gate.md`. Summary: every table traces to a Domain Model entity; every Domain Model entity has a table or an explicit reason it doesn't; foreign keys are consistent with the Domain Model's relationships.

## Approval criteria

This phase is done when 100% of Domain Model entities are accounted for (table or explicit exception), every table has a valid `traces_to`, database type and migration strategy have been individually confirmed, and the user has explicitly confirmed the full schema.
