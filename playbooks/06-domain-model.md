# Playbook 06 — Domain Model

## Objective

Extract entities, value objects, aggregates, and business invariants from the approved Use Cases — the conceptual foundation that phase 07 (Database Design) will translate into schema. This phase stays deliberately pre-technical: no tables, no columns, no database engine considerations. That boundary is the single most important thing this playbook protects.

## When to run

Whenever `docs/project-state.md` marks phase 06 as included — in practice, whenever the project has any persistent data at all.

## When NOT to run

Skippable only for projects with no meaningful data model (e.g. a stateless utility with no persistence). Calibration decides this; it is rare for this phase to be skippable if Database Design (phase 07) is not also skipped.

## Inputs

- `docs/05-use-cases/use-cases.md` — approved.

## Outputs

- `docs/06-domain-model/domain-model.md`.

## Documents produced

- `docs/06-domain-model/domain-model.md` (index: aggregates, relationships, diagram) plus one `docs/06-domain-model/ent-XXX.md` per entity/value object, via `templates/domain-model.md` (`rules/document-locations.md`).

## Mandatory questions

- What are the central entities (with their own identity) mentioned across the Use Cases?
- What are value objects (no identity, immutable)?
- Which entities form aggregates (transactional consistency boundaries)? — `[confirmation individual]`
- What invariants must each entity/aggregate always guarantee?
- What are the relationships between entities (cardinality)?

**Fully Dressed only** (`rules/documentation-depth.md`):
- What terms should everyone (user, AI, later readers) use consistently for this domain's concepts — a short glossary?
- Does this project have more than one bounded context? If so, where are the boundaries?
- Are there meaningful domain events worth naming explicitly (e.g. "OrderRefunded")?
- Walk one concrete example scenario end to end, showing the entities and invariants actually working together.

## Optional questions

- Whether a `classDiagram` should split into multiple diagrams if the model is large enough that one diagram would be unreadable.

## Interview flow

1. Scan the Use Cases together with the user for nouns that recur with real identity — that's the entity candidate list. Confirm which are entities vs. value objects.
2. For each entity: attributes (conceptual, not columns), then invariants (never skip — "no special rules" is a valid but explicit answer), then relationships to other entities.
3. Aggregates last, once individual entities and their invariants are settled — aggregate boundaries are easier to reason about once you know what each entity must protect on its own.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). Aggregate boundary decisions are always individually confirmed, regardless of mode — they directly shape transaction boundaries in phase 07 and are costly to get wrong and unwind later.

## How to document answers

Each confirmed entity/value object becomes its own `docs/06-domain-model/ent-XXX.md` item file, `Traces to` set to the Use Case(s) it appears in, with a matching row added to `domain-model.md`'s index table. Relationships are recorded in the index file (they span more than one entity), with cardinality and a plain-language description. The `classDiagram` (`rules/diagram-conventions.md`) is built from the same confirmed data — never drawn first and reverse-documented. At Fully Dressed depth, the additional answers map to `templates/domain-model.md`'s "Fully Dressed additions" section.

## How to validate answers

- Every `ENT-XXX` has `traces_to` pointing to at least one existing `UC-XXX` — an entity that doesn't appear in any use case shouldn't exist in this document.
- Every `ENT-XXX` has at least one invariant, explicitly stated — never an empty list.
- Aggregate boundaries are clear: every entity either is an aggregate root or explicitly belongs to one.
- Nothing in the document describes database structure — see "Anti-patterns."

## Special cases

- **Entity vs. value object ambiguity**: if the user isn't sure, ask whether two instances with identical attributes would be considered "the same thing" (value object) or "two different things that happen to look alike" (entity, e.g. two orders with identical line items are still different orders).
- **An entity that seems to need no invariant**: still requires an explicit entry — "must always have a valid, non-empty identifier" or similar baseline is usually true even when nothing domain-specific applies. Confirm this explicitly rather than leaving the list empty.

## Common ambiguities

- Attributes described with a database type ("a VARCHAR(255) name field") instead of a conceptual one ("a name, which must not be empty") — restate conceptually and note the type question belongs to phase 07.
- Cardinality assumed rather than asked — "an order has one customer" sounds obvious but should still be confirmed, since edge cases (shared accounts, gift orders) sometimes break the obvious assumption.

## Frequent errors

- Letting database vocabulary (tables, foreign keys, indexes) creep into entity/relationship descriptions — this is the specific anti-pattern this playbook exists to prevent; see below.
- Leaving an entity's invariants list empty instead of recording an explicit "no special rules beyond basic validity."
- Deciding aggregate boundaries without individual confirmation because the rest of the phase is running in Agile mode.

## Examples

> AI: "You mentioned 'Order' and 'Order Line' — does an Order Line have its own identity separate from the Order (e.g. can you reference 'order line #47' on its own), or is it just a component that only makes sense as part of an Order?"
> User: "Just a component — always part of an Order, never referenced alone."
> AI: "Then Order Line is a value object, not an entity, and it belongs to Order's aggregate. Order is the aggregate root. Does that match your mental model?"

## Anti-patterns

See `rules/ai-invariants.md`, and in particular: **never model this phase in terms of database tables.** If the AI catches itself thinking "this entity will need a foreign key to that one" or "this attribute should be indexed," that thought belongs to phase 07, not here — the correct move is to note the conceptual relationship/attribute now and let phase 07 make the schema-level decision later, from this document, not in parallel with it. Modeling ahead of phase 07 here is scope leakage from a later phase into this one, and it pre-empts decisions (data types, normalization, storage engine) that haven't been asked about yet.

## Checklist

`checklists/06-domain-model-checklist.md`

## Quality Gate

`quality-gates/06-domain-model-gate.md`. Summary: every entity traces to at least one Use Case; no entity without an explicit invariant; aggregate boundaries are clear.

## Approval criteria

This phase is done when every entity/value object has a valid `traces_to`, every entity has at least one explicit invariant, every aggregate boundary has been individually confirmed, and the user has explicitly confirmed the full model including the relationship diagram.
