# Document Locations

Where the Skill reads and writes files — in the target user's project, not inside this Skill package.

## In the target project (the repository the Skill is helping to plan)

```
<user's repo root>/
  docs/
    project-state.md              # single source of truth for progress, cycles, mode, language
    00-calibration/
      calibration.md
    01-discovery/
      vision.md
    02-business-analysis/
      business-analysis.md
    03-requirements/
      requirements.md
    04-user-stories/
      user-stories.md
    05-use-cases/
      use-cases.md
    06-domain-model/
      domain-model.md
    07-database-design/
      database.md
    08-architecture/
      architecture.md
      adr/                        # ADR-XXX files, one per consequential decision
    09-api-design/
      api.md
    10-frontend-planning/
      frontend.md
    11-security/
      security.md
      risk-register.md
    12-testing/
      testing.md
    13-deployment/
      deployment.md
    14-roadmap/
      roadmap.md
    15-backlog/
      backlog.md
    16-implementation-plan/
      implementation-plan.md
    17-review/
      review-report.md
    change-requests/
      CR-XXX.md                   # one file per Change Request, any phase
```

- `project-state.md` lives at the root of `docs/`, not inside any phase subfolder — it's project-wide, not phase-specific.
- `risk-register.md` lives under `11-security/` because Security is where risk tracking becomes formal, but any phase can add entries to it (e.g. an "I don't know" pending item from an earlier phase, per `confirmation-protocol.md`).
- `adr/` and `change-requests/` are the only subfolders that hold multiple numbered files instead of one document per phase.

## Inside this Skill package (`software-architect/`)

`software-architect/docs/` is a **completely different thing** — it is this Skill's own usage documentation (`how-it-works.md`, `faq.md`, `troubleshooting.md`), read by someone using or maintaining the Skill itself. It is never written to by the Skill while it runs, and it never contains anything about any specific user project. Do not confuse the two `docs/` directories — one belongs to the Skill, one belongs to the target project.

## Out of scope (v1)

A single `docs/` root assumes one product per repository root. Monorepos with multiple products needing independent planning cycles are explicitly out of scope for v1 (see `plan-00-overview.md` decision #17) — not an oversight.
