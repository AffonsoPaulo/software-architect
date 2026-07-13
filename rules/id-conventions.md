# ID Conventions

Every artifact the Skill produces gets a unique, permanent ID. This file is the single source of truth for the prefix table — no playbook or template invents a new prefix on its own.

## Prefix table

| Prefix | Artifact | Produced in phase |
|---|---|---|
| `BR` | Business Rule | 02 — Business Analysis |
| `REQ` | Requirement (functional or non-functional) | 03 — Requirements Engineering |
| `US` | User Story | 04 — User Stories |
| `UC` | Use Case | 05 — Use Cases |
| `ENT` | Domain entity / value object | 06 — Domain Model |
| `TBL` | Database table / collection | 07 — Database Design |
| `ARCH` | Architecture decision / component | 08 — Architecture |
| `API` | API endpoint | 09 — API Design |
| `SEC` | Security control / decision | 11 — Security |
| `TEST` | Test plan item | 12 — Testing |
| `TASK` | Backlog / implementation item | 15 — Backlog, 16 — Implementation Plan |
| `ADR` | Architecture Decision Record | any phase (shared template) |
| `RISK` | Risk register entry | any phase (shared template) |
| `CR` | Change Request | any phase, post-approval (shared template) |

## Format

- `<PREFIX>-NNN`, zero-padded to 3 digits: `REQ-001`, `US-014`, `ARCH-002`.
- Sequential per project, per prefix. Never reset, never reused — not even by later `cycles` (see `document-locations.md` and `project-state.md`'s `cycles` structure). If `REQ-001` through `REQ-044` exist and the project starts a second cycle, the next new requirement is `REQ-045`, not `REQ-001` of a new sequence.
- An ID is never deleted. A removed/superseded artifact is marked `[DEPRECATED]` in place (in its own document, and anywhere it's referenced) — the ID itself stays reserved and visible, so no other artifact can reuse it and no historical reference silently breaks.

## Where an ID must appear

- In the front-matter of the document where the artifact is defined (its "home" document).
- In the front-matter `traces_to` field of every other document that references it (see `traceability-rules.md` for which artifacts must reference which).
- Optionally inline in prose, but the front-matter declaration is the one `scripts/validate-ids.mjs` and `scripts/validate-traceability.mjs` actually parse — prose mentions are not load-bearing.

## Adding a new artifact type

If a future phase genuinely needs a new artifact type not in the table above, the new prefix is added **here first**, not invented ad hoc inside a playbook. This has already happened once during planning (`BR` was added retroactively) — it should never happen again during implementation.
