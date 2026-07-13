# Traceability Rules

## Illustrative chain vs. actual graph

The Skill's guiding intuition is often summarized as a linear chain:

```
Requirement → Story → Use Case → API → Database → Test → Task → Implementation
```

This is useful for explaining *why* traceability matters to a user, but it is **not** what gets validated. In practice — and as reflected in every phase's Quality Gate — traceability is a **graph anchored at Requirement/Business Rule**, not a sequential pipeline. For example, `TBL-XXX` (a database table) traces to `ENT-XXX` (a Domain Model entity), not to "Database" as a stage; `TEST-XXX` traces directly to `REQ-XXX`, never passing "through" Database. This file is the definitive, authoritative table — `scripts/validate-traceability.mjs` implements exactly this table, not the illustrative chain above.

Every `traces_to` in the table below is written as the `Traces to` key of an artifact's metadata line — see `rules/document-format.md` for the exact heading + metadata-line convention every template uses.

## The definitive table

| Artifact | `traces_to` | Required? | Notes |
|---|---|---|---|
| `BR` (Business Rule) | — (root) | — | No upstream link; may be referenced by `REQ`. |
| `REQ` (Requirement) | `BR-XXX` (optional) | Conditional | Not every requirement has a business rule behind it — pure technical/NFR requirements may have none. |
| `US` (User Story) | `REQ-XXX` | Always | Exception: purely non-functional requirements never get a User Story — they trace directly to `ARCH`/`SEC` instead (see below). |
| `UC` (Use Case) | `US-XXX` | Always | |
| `ENT` (Domain entity) | `UC-XXX` | Always | |
| `TBL` (Database table) | `ENT-XXX` | Always | Or an explicit documented exception (e.g. a value object embedded in a parent table, never its own row). |
| `ARCH` (Architecture decision/component) | `REQ-XXX` (NFR) | Always for NFR-driven decisions | A component may also exist to satisfy multiple NFRs — list all. |
| `API` (Endpoint) | `UC-XXX` **and** `ARCH-XXX` | Always both | The Use Case it implements, and the Architecture component that hosts it. |
| `SEC` (Security control) | `ARCH-XXX` **and/or** `API-XXX` | Always at least one | A control protects a component, an endpoint, or both. |
| `TEST` (Test plan item) | `REQ-XXX` | Always | Every functional `REQ` must have at least one `TEST`. |
| `TASK` (Backlog/implementation item) | `US-XXX` **or** `UC-XXX` | Always | |

## Documented exceptions

- **NFR requirements without a User Story**: a purely non-functional requirement (e.g. "the system must respond in under 200ms") does not need a `US`. It traces directly to the `ARCH` decision(s) and/or `SEC` control(s) that address it. `scripts/validate-traceability.mjs` must not flag these as orphans.
- **Skipped phases**: if `project-state.md` records a phase as skipped (via `playbooks/00-project-calibration.md`), any elo that would have originated in that phase is exempt from orphan detection. Example: Frontend Planning skipped → a `UC` with no corresponding screen is not a violation.

## What counts as a validation failure

- An artifact missing a required `traces_to` (per the table above), with no documented exception.
- A `traces_to` pointing to an ID that does not exist anywhere in the project's documents.
- An ID declared twice (see `id-conventions.md` for uniqueness rules — enforced by `scripts/validate-ids.mjs`, a separate concern from graph validity).

## What this file does not cover

Semantic conflicts between documents (e.g. two requirements that contradict each other) are a distinct concern from traceability — see `plan-00-overview.md` decision #12 and `playbooks/17-review.md`. A document can be perfectly traceable and still be internally contradictory; this file only catches the former.
