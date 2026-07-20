# Architecture Review Gate (Master Gate)

The strictest gate in the Skill — the only one that, when passed, sets `docs/project-state.md`'s active cycle `ready_for_implementation: true`. No escape valve applies anywhere in this gate; see the Pass rule below.

## Scriptable criteria
- [ ] `scripts/validate-ids.mjs` reports zero violations across every document in `/docs/` — run via delegated subagent per `rules/delegation-policy.md`
- [ ] `scripts/validate-traceability.mjs` reports zero unresolved orphans or broken references across the full traceability graph (`rules/traceability-rules.md`), respecting documented exceptions (skipped phases, NFR-without-story, etc.) — run via delegated subagent
- [ ] `scripts/validate-versioning.mjs` reports zero violations: every cycle and every artifact has a non-blank `Author`, `docs_version` matches `docs/CHANGELOG.md`'s newest entry, and `changelog[]`/`CHANGELOG.md` haven't drifted apart
- [ ] `scripts/validate-tone.mjs` reports zero violations: no document references this Skill's internal phase numbers, leaves a confirmation-marker bracket in written text, cites a `rules/`/`playbooks/`/`templates/`/`scripts/` path, echoes the Skill's own policy language, uses "Fully Dressed"/"Casual" as a document label (`rules/document-format.md`'s "Never let the Skill's own process show through"), or cites another document's raw `docs/` path in prose instead of a real markdown link (`rules/document-format.md`'s "Cross-referencing another document in prose")
- [ ] `scripts/validate-heading-language.mjs` reports zero violations (skipped entirely when `language: "en"`): no phase document's fixed section headings, table header row, or `**Bold label**` sub-section is still the template's literal English text when the project's confirmed language is something else (`rules/language-policy.md`)
- [ ] `scripts/validate-export-labels.mjs` reports zero violations (skipped entirely when `language: "en"`): every `export_labels` key this Skill currently knows about is present in `project-state.md` and actually translated, not silently missing or left equal to its English default (`rules/skill-drift.md`)
- [ ] All 18 phase gates (00 through 16, plus this one) show `passed` for the active cycle in `project-state.md`

## Judgment criteria (AI/human) — never delegated
- [ ] The semantic conflict scan (main thread, not the subagent) found zero unresolved contradictions between documents
- [ ] Every gap or conflict found, if any, was routed through a Change Request (`rules/change-management.md`) rather than patched in isolation, and every resulting downstream re-approval is complete
- [ ] Every outstanding risk-register entry or gate escape-valve override from prior phases is either resolved or explicitly, freshly re-confirmed as still acceptable by the user at this final checkpoint
- [ ] `docs/17-review/review-report.md` accurately reflects everything actually found and resolved — no drift between the report and reality
- [ ] Every significant documentation event since the last `docs/CHANGELOG.md` entry has a corresponding row — the script above confirms the log is internally consistent, not that it's complete; completeness (is everything that *should* be logged actually there) requires reading what happened, which only the reviewer can judge
- [ ] The user gave explicit final approval, individually confirmed, with a recorded timestamp — no exception, in any confirmation mode

## Pass rule
This gate has **no escape valve** — `rules/quality-gate-structure.md`'s stuck-criterion override does not apply to any criterion here. Every criterion must genuinely pass; a gap routes through a Change Request and this gate is re-evaluated after that CR closes, not overridden. Only once every criterion passes AND the user gives explicit final approval does `project-state.md`'s active cycle get `ready_for_implementation: true`. This is the only gate in the Skill whose pass directly changes that flag, and `SKILL.md` treats that flag as the sole permission to generate code.
