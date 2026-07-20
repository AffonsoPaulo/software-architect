# Project Calibration

| Field | Value |
|---|---|
| Project type | New product — a multi-tenant SaaS for project/task management ("TaskFlow"). |
| Size | Large: multiple teams will build on this, multi-tenant data isolation is a hard requirement, and the product is expected to scale to hundreds of concurrent users across many customer organizations. |
| Stakeholders | Product lead, engineering lead, and a design partner customer (an early adopter organization providing requirements input) — beyond the requesting developer. |
| Prior artifacts | A rough internal pitch deck exists but contains no technical detail — treated as informal context, not a source of confirmed requirements. |
| Confirmation mode | Strict — every question confirmed individually, one at a time. Chosen because of the project's size and the real cost of getting multi-tenancy or security decisions wrong. |
| Documentation depth | Fully Dressed — chosen because this product has external stakeholders (a design-partner customer, an engineering lead who wasn't in every conversation), handles PII and multi-tenant data, and needs documentation thorough enough for someone who joins later to trust without re-deriving it. |
| Language | English. |

## Phase inclusion

All 18 phases run — no phase is skipped for this project, given its size and the number of stakeholders involved.

| Phase | Status | Reason |
|---|---|---|
| 01 — Discovery | included | |
| 02 — Business Analysis | included | Real business processes (task lifecycle) and distinct actor roles (Project Admin vs. Team Member) exist and matter. |
| 03 — Requirements | included | The core task-management behavior and multi-tenant isolation rules need to be stated explicitly and verifiably before any design work starts. |
| 04 — User Stories | included | |
| 05 — Use Cases | included | |
| 06 — Domain Model | included | Real persistent entities (Tenant, Project, Task, User) with non-trivial invariants. |
| 07 — Database Design | included | |
| 08 — Architecture | included | A multi-tenant system needs its isolation model (tenant scoping, data separation) decided deliberately before any component or schema work proceeds. |
| 09 — API Design | included | |
| 10 — Frontend Planning | included | Real UI (task board, task detail). |
| 11 — Security | included | Especially consequential here — tenant data isolation is a security property, not just a data-modeling one. |
| 12 — Testing | included | |
| 13 — Deployment | included | |
| 14 — Roadmap | included | |
| 15 — Backlog | included | |
| 16 — Implementation Plan | included | |
| 17 — Review | included | The full cross-tenant traceability graph needs a final consistency pass before implementation, given the project's size and number of stakeholders. |
