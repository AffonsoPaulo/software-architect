# Calibration — Template

Saved at `docs/00-calibration/calibration.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/00-project-calibration.md`, in both initial and incremental mode. This is the human-readable rationale behind the terse phase list in `project-state.md` — it explains *why* each phase was included or skipped, not just *that* it was.

## Structure

```markdown
# Project Calibration

| Field | Value |
|---|---|
| Author | <name/handle of whoever is confirming this cycle's answers, `[confirmation individual]` — asked fresh every cycle, project-state.md's cycles[].author, rules/versioning.md> |
| Project type | <one of: new product / feature on existing product / prototype / internal script / legacy migration — as confirmed by the user, `[confirmation individual]`> |
| Size | <small / medium / large, as confirmed by the user, `[confirmation individual]`, plus the one-line reasoning the user gave (this is not a self-assessment the AI makes — it's what the user said, rewritten for clarity and confirmed)> |
| Stakeholders | <who beyond the current user needs to be consulted, if anyone> |
| Prior artifacts | <PRD, legacy code, prototype, or another project this Skill already planned — what exists already, and where> |
| Confirmation mode | <Strict or Agile, `[confirmation individual]` — project-wide, see rules/confirmation-protocol.md> |
| Documentation depth | <Casual or Fully Dressed, `[confirmation individual]` — project-wide, see rules/documentation-depth.md> |
| Language | <the language confirmed for generated documents, `[confirmation individual]`, see rules/language-policy.md> |

## Brownfield research summary
<Only present if project type is "feature on existing product" or "legacy
migration". Summarizes what the read-only subagent found (rules/delegation-
policy.md) — stack in use, folder structure, apparent conventions. Marked
clearly as findings to inform later questions, not decisions.>

## Sibling-project research summary
<Only present if prior artifacts named another project this Skill already
planned. Summarizes what the read-only subagent found in that project's
already-approved documents (rules/delegation-policy.md) — tech stack,
domain entities, architecture pattern, security posture, whatever's
relevant. Marked clearly as facts about the OTHER project, offered later
as a starting suggestion in this project's own Domain Model, Database
Design, Architecture, and Security phases — never copied in as this
project's own answer, and kept separate from the brownfield section above
even when both are present, since they answer different questions.>

## Phase inclusion
| Phase | Status | Reason |
|---|---|---|
| 01 — Discovery | included / skipped | <why> |
| ... one row per phase 01-17 ... |

Phases 03 (Requirements), 08 (Architecture), 11 (Security), and 17 (Review)
are never listed as "skipped" — they are always mandatory regardless of
project size (rules/quality-gate-structure.md's always-strict categories
overlap heavily with why these four can't be skipped).
```

## For incremental mode (cycle 2+)

Instead of the full structure above, an incremental calibration only records:

```markdown
# Project Calibration — Cycle <N> (incremental)

| Field | Value |
|---|---|
| Increment scope | <what this cycle adds, in one or two sentences> |
| Author | <name/handle of whoever is confirming this cycle's answers, `[confirmation individual]` — asked fresh, never inherited from a prior cycle even if it's the same actual person, rules/versioning.md> |

## Phases touched
| Phase | Status | Reason |
|---|---|---|
| ... only the phases this increment actually needs ... |

## Existing documents affected
<none, or a list — anything here triggers rules/change-management.md,
it is never edited directly>
```

Project type, size, stakeholders, confirmation mode, documentation depth, and language are **not** re-asked or re-recorded — they already live in `project-state.md` and apply to the whole project.
