# Document Locations

Where the Skill reads and writes files — in the target user's project, not inside this Skill package.

## Index files vs. item files

A phase whose main payload is a list of independently-meaningful, ID-bearing artifacts (a requirement, a use case, a database table...) splits into a **hybrid** layout: one short **index file** at the category's usual path, holding only the narrative/overview content that genuinely spans every item (intro, category-wide decisions, diagrams, a summary table linking to each item) — plus one **item file** per artifact, in the same directory, holding that artifact's full content per `rules/document-format.md`.

This mirrors the ADR/Change Request pattern already in place before this convention existed — `architecture.md` (index) references `adr/ADR-XXX.md` (items) rather than restating them, and this rule generalizes that same shape to every category where it fits.

**Item filename convention**: `<lowercase-prefix>-<NNN>.md`, matching the artifact's ID exactly except lowercased and hyphenated (`REQ-001` → `req-001.md`). The ID as written *inside* the file's heading stays uppercase (`# REQ-001 — ...`), per `rules/id-conventions.md` — only the filename is lowercased. `adr/ADR-XXX.md` and `change-requests/CR-XXX.md` predate this convention and keep their existing uppercase filenames; not renamed, since there's no functional reason to churn something already working.

**Which categories split, and which stay single-file:**

| Splits (index + item files) | Stays single-file |
|---|---|
| Requirements (`req-XXX.md`) | Calibration — no items |
| User Stories (`us-XXX.md`) | Vision — no items |
| Use Cases (`uc-XXX.md`) | Business Analysis — `BR-XXX` *is* ID-bearing (it's not exempt the way screens/milestones/environments are), but it stays inline: a business rule is read together with the process it constrains, not consulted standalone the way a REQ/US/UC is. Projects tend to have few of them too, but that's supporting evidence for this being the right call, not the reason itself — it isn't a "split once you have enough" threshold. |
| Domain Model (`ent-XXX.md`) | Frontend Planning — screens have no reserved ID prefix |
| Database Design (`tbl-XXX.md`) | Deployment — environments aren't ID-bearing |
| Architecture (`arch-XXX.md`), plus its existing `adr/` | Roadmap — milestones have no reserved ID prefix |
| API Design (`api-XXX.md`) | Implementation Plan — sequences existing Backlog tasks, never declares new artifacts |
| Security (`sec-XXX.md`), plus its Risk Register (`risk-XXX.md`) | Review — a report, not an artifact list |
| Testing (`test-XXX.md`) | |
| Backlog (`task-XXX.md`) | |

The rule of thumb: split when the category's items are the whole point and the category-level content is thin (a couple of intro sentences, maybe a diagram); stay single-file when there's real connective narrative binding the items together, or when the "items" don't have a reserved ID prefix at all (`rules/id-conventions.md`).

## In the target project (the repository the Skill is helping to plan)

```
<user's repo root>/
  docs/
    project-state.md              # single source of truth for progress, cycles, mode, language
    CHANGELOG.md                  # project-wide log of significant documentation events, see rules/versioning.md
    00-calibration/
      calibration.md
    01-discovery/
      vision.md
    02-business-analysis/
      business-analysis.md
    03-requirements/
      requirements.md              # index: intro + summary table
      req-001.md, req-002.md, ...  # one file per REQ-XXX
    04-user-stories/
      user-stories.md              # index
      us-001.md, ...
    05-use-cases/
      use-cases.md                 # index
      uc-001.md, ...
    06-domain-model/
      domain-model.md              # index: aggregates, ubiquitous language, diagram
      ent-001.md, ...
    07-database-design/
      database.md                  # index: database type, migration strategy, diagram
      tbl-001.md, ...
    08-architecture/
      architecture.md              # index: style, core tech, NFR coverage, diagram
      arch-001.md, ...
      adr/                         # ADR-XXX.md files, one per consequential decision (predates this convention)
    09-api-design/
      api.md                       # index: interaction style, versioning, failure format
      api-001.md, ...
    10-frontend-planning/
      frontend.md                  # single file — screens aren't ID-bearing
    11-security/
      security.md                  # index: threat model summary, auth/authz, compliance
      sec-001.md, ...
      risk-register.md             # index
      risk-001.md, ...
    12-testing/
      testing.md                   # index: levels, coverage target, test data strategy
      test-001.md, ...
    13-deployment/
      deployment.md
    14-roadmap/
      roadmap.md
    15-backlog/
      backlog.md                   # index: Definition of Ready, grouped-by-milestone summary
      task-001.md, ...
    16-implementation-plan/
      implementation-plan.md
    17-review/
      review-report.md
    change-requests/
      CR-XXX.md                   # one file per Change Request, any phase (predates this convention)
```

- `project-state.md` lives at the root of `docs/`, not inside any phase subfolder — it's project-wide, not phase-specific.
- `CHANGELOG.md` lives at the root of `docs/`, not inside any phase subfolder, for the same reason — it logs events from any phase, or from a Change Request touching any category (`rules/versioning.md`, `templates/changelog.md`).
- `risk-register.md` lives under `11-security/` because Security is where risk tracking becomes formal, but any phase can add entries to it (e.g. an "I don't know" pending item from an earlier phase, per `confirmation-protocol.md`).
- `project-state.md`'s `documents[]` array tracks one entry per **index file** for a split category (e.g. `docs/03-requirements/requirements.md`), not one per item file — `status` (draft/approved) applies to the category as a whole. There is no per-category version counter — the whole documentation set shares one `docs_version`, bumped once per `CHANGELOG.md` entry, whichever category the entry touches (`rules/versioning.md`).

## Inside this Skill package (`software-architect/`)

`software-architect/docs/` is a **completely different thing** — it is this Skill's own usage documentation (`how-it-works.md`, `faq.md`, `troubleshooting.md`), read by someone using or maintaining the Skill itself. It is never written to by the Skill while it runs, and it never contains anything about any specific user project. Do not confuse the two `docs/` directories — one belongs to the Skill, one belongs to the target project.

## Out of scope (v1)

A single `docs/` root assumes one product per repository root. Monorepos with multiple products needing independent planning cycles, and multiple concurrent users writing to the same `project-state.md` at once, are explicitly out of scope for v1 — a conscious scope decision, not an oversight; either could become a v2 concern if actually needed.
