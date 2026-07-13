# How It Works

A guide for humans to the Skill as actually built — not the plan, the result. If you're extending or debugging the Skill, start here.

## The shape of a project

Every project the Skill helps plan goes through up to 18 phases, in order, before any code is written:

| # | Phase | Playbook |
|---|---|---|
| 00 | Project Calibration | `playbooks/00-project-calibration.md` |
| 01 | Discovery | `playbooks/01-discovery.md` |
| 02 | Business Analysis | `playbooks/02-business-analysis.md` |
| 03 | Requirements Engineering | `playbooks/03-requirements-engineering.md` |
| 04 | User Stories | `playbooks/04-user-stories.md` |
| 05 | Use Cases | `playbooks/05-use-cases.md` |
| 06 | Domain Model | `playbooks/06-domain-model.md` |
| 07 | Database Design | `playbooks/07-database-design.md` |
| 08 | Architecture | `playbooks/08-architecture.md` |
| 09 | API Design | `playbooks/09-api-design.md` |
| 10 | Frontend Planning | `playbooks/10-frontend-planning.md` |
| 11 | Security | `playbooks/11-security.md` |
| 12 | Testing | `playbooks/12-testing.md` |
| 13 | Deployment | `playbooks/13-deployment.md` |
| 14 | Roadmap | `playbooks/14-roadmap.md` |
| 15 | Backlog | `playbooks/15-backlog.md` |
| 16 | Implementation Plan | `playbooks/16-implementation-plan.md` |
| 17 | Architecture Review | `playbooks/17-review.md` |

Four phases — 03, 08, 11, 17 — are always mandatory, regardless of project size. Every other phase can be skipped, but only with an explicit reason recorded during phase 00, never silently. Architecture (08) intentionally runs before API Design (09): the architectural style decided there shapes the API contracts designed here, not the other way around — see `playbooks/08-architecture.md`'s and `playbooks/09-api-design.md`'s opening notes if you're wondering why the numbering isn't in the order you might expect from the original brief.

## SKILL.md as orchestrator

`SKILL.md` is the only file always loaded. It doesn't contain phase-specific logic — it decides which of three entry states applies (new project, project in progress, or a fully-implemented project asking for something new), points at the phase table above, and enforces that a phase only advances once its `quality-gates/<phase>-gate.md` passes. Everything about *how* a phase actually runs lives in that phase's own playbook, loaded on demand — not in `SKILL.md`.

## `project-state.md` — the mechanism that makes resuming possible

Every project has exactly one `docs/project-state.md` in its own repository (not inside this Skill package — see `rules/document-locations.md`). It tracks:

- **`cycles`**: not a single flat list of phases, but an array. The first cycle is the original end-to-end build. A project that's already reached `ready_for_implementation: true` and gets a new feature request doesn't start over — `playbooks/00-project-calibration.md` opens a new cycle in **incremental mode**, reusing every existing document and ID as a confirmed baseline. See `examples/small-cli-tool/` for this happening for real, across two cycles.
- **`id_sequences`**: a single flat map, outside `cycles`, tracking the last-used number per ID prefix. This is what makes "IDs never reset between cycles" mechanically true rather than a rule someone has to remember to follow.
- **`confirmation_mode`** and **`language`**: set once in phase 00, project-wide, reused every phase and every cycle without being re-asked.
- Per-phase status (`pending` / `in_progress` / `completed` / `skipped`) and, for an in-progress phase, the exact `next_pending_question` needed to resume without repeating anything already confirmed.

## The confirmation loop

Every question, in every phase, follows the same loop, defined once in `rules/confirmation-protocol.md`: ask → interpret → rewrite the understanding back → show exactly how it'll be documented → "is this what you meant?" → confirm → document → next question. There are two modes:

- **Strict**: every question goes through this loop individually, one at a time.
- **Agile**: answers can be confirmed in batches — except any question tagged `[confirmation individual]` in a playbook, which always uses the full individual loop regardless of mode. Architecture decisions, authentication mechanisms, database type, and anything with a high cost of reversal are tagged this way.

`examples/small-cli-tool/docs/transcript.md` and `examples/saas-multi-tenant/docs/transcript.md` show the same kind of question handled in both modes, side by side.

## Traceability

Every artifact the Skill produces gets a permanent ID (`REQ-001`, `US-014`, `ARCH-003`, ...) with a `traces_to` field pointing to what it's derived from. The chain everyone thinks of first — Requirement → Story → Use Case → API → Database → Test → Task → Implementation — is the *intuition*, not the *specification*. The actual specification is the artifact-by-artifact table in `rules/traceability-rules.md`, which is a graph anchored at Requirement/Business Rule, not a straight line — a database table traces to a domain entity, not to "the database phase," and a test traces directly to a requirement, never through the database at all.

`scripts/validate-ids.mjs` and `scripts/validate-traceability.mjs` check this mechanically. They respect phases marked skipped in `project-state.md` (an orphan that only exists because its origin phase was legitimately skipped isn't a violation) and the documented exceptions (a purely non-functional requirement never gets a User Story, for instance).

## The final gate

Phase 17 (Review) is not an interview — it's an audit. It delegates the mechanical validation (`validate-ids.mjs`, `validate-traceability.mjs`) to a subagent that only executes and reports, per `rules/delegation-policy.md`; the semantic conflict scan (do any two approved documents actually contradict each other?) stays with the main thread, since it needs the full history of confirmed decisions a subagent doesn't have. This is the only gate in the Skill with no escape valve anywhere, and the only one that sets `ready_for_implementation: true` on the active cycle — which is the one thing `SKILL.md` checks before it will help generate any code.

## Where to look next

- `rules/` — the 12 cross-cutting rules every playbook references instead of restating.
- `playbooks/` — one file per phase, all following the same 20-section structure defined in `rules/playbook-structure.md`.
- `scripts/` — the Node.js validators, zero npm dependencies (see the module docstrings for why).
- `examples/` — two fully worked, validated projects; read these before reading any single playbook in isolation if you want to see the whole thing hang together.
