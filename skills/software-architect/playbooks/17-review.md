# Playbook 17 — Architecture Review (Final Gate)

> This is not an interview like the other 17 phases. It is an audit of everything produced in phases 00–16, followed by exactly one real question: does the user give final sign-off. Sections below are adapted from `rules/playbook-structure.md` accordingly — several are short because most of this phase's content is mechanical, not conversational.

## Objective

Audit the consistency of everything produced across phases 00–16, run the complete traceability validation, perform the semantic conflict scan that traceability checks alone can't catch, and produce the formal sign-off that releases implementation. The last phase before any production code may be written, in every cycle.

## When to run

Always, as the last phase of every cycle — initial or incremental. Review is one of the four always-mandatory phases (`playbooks/00-project-calibration.md`); no cycle, however small, skips it.

## When NOT to run

Never skippable, in any cycle.

## Inputs

- Every document produced in phases 00–16 for the active cycle, plus — since artifact IDs and traceability are global, not per-cycle (`rules/id-conventions.md`) — every document from prior cycles still part of the project's current state.
- All 17 prior gates (00–16) for the active cycle, already passed.

## Outputs

- `docs/17-review/review-report.md`.
- `docs/project-state.md` — the active cycle's `ready_for_implementation` set to `true`, with a timestamp, only after final sign-off.

## Documents produced

- `docs/17-review/review-report.md` — no `templates/` file exists for this document (deliberately: this phase audits existing documents, it doesn't specify something new that needs a reusable template). Its format:

```markdown
# Review Report — Cycle <N>

## Structural check (scriptable)
<Raw output of scripts/validate-ids.mjs and scripts/validate-traceability.mjs,
run via a delegated subagent per rules/delegation-policy.md.>

## Semantic conflict scan (judgment)
<Contradictions found between documents — or "none found" — performed by
the main thread, never delegated.>

## Outstanding items from prior gates
<Any risk-register entries or gate escape-valve overrides still open,
consolidated here.>

## Verdict
<Either "Ready for implementation" with the user's final confirmation
timestamp, or the exact list of gaps/conflicts that block it.>
```

## Mandatory questions

Exactly one: **explicit final approval to proceed to implementation** — `[confirmation individual]`, always, without exception, even in Agile mode. Everything before this question is audit, not interview — there is nothing else to ask the user unless the audit finds something that needs a Change Request, in which case that gets resolved through `rules/change-management.md`, not through new questions here.

## Optional questions

None. If the audit surfaces something ambiguous enough to need a genuine question, that question belongs to the phase where the ambiguous artifact originated, reached via a Change Request — not asked fresh here.

## Interview flow

1. Delegate to a subagent (`rules/delegation-policy.md`) running `scripts/validate-ids.mjs` and `scripts/validate-traceability.mjs` against every document in the project's `/docs/`. The subagent only executes and reports the raw result — it does not interpret or decide anything.
2. The main thread synthesizes that report and performs the semantic conflict scan — contradictions between documents that no script can catch (two requirements that contradict each other, an Architecture decision that violates a Security requirement, an API contract diverging from the Database schema it references). This is never delegated: it requires the full history of confirmed decisions that only the main thread holds.
3. Consolidate any orphan, conflict, or prior-gate item that was left open (an escape-valve override, an unresolved risk-register entry).
4. Present an executive summary to the user: either "documentation complete, no traceability gaps or conflicts detected, ready for implementation," or the exact list of gaps/conflicts found.
5. If there are gaps or conflicts: **do not patch the originating document in isolation** — open a formal Change Request (`rules/change-management.md`) from the problematic artifact, so downstream propagation happens automatically via `rules/traceability-rules.md`, instead of fixing the one spot found and leaving everything else potentially stale.
6. If everything passes: ask for explicit final approval — `[confirmation individual]`, always, without exception.
7. Only after that explicit approval, set the active cycle's `ready_for_implementation: true` in `project-state.md`, with a timestamp. This is what `SKILL.md` checks before permitting any code generation.

## How to confirm answers

The final approval question always uses the full individual confirmation loop (`rules/confirmation-protocol.md`), regardless of the project's confirmation mode — no exception exists for this one question anywhere in the Skill.

## How to document answers

The review report is written per the format above. The approval itself is recorded in `project-state.md`: `ready_for_implementation: true` plus a timestamp, on the active cycle only — not retroactively applied to any other cycle.

## How to validate answers

- The subagent's structural report shows zero unresolved orphans/broken references across the full traceability graph (`rules/traceability-rules.md`), respecting documented exceptions (skipped phases, NFR-without-story, etc.).
- The semantic conflict scan found zero unresolved contradictions.
- Every one of the 18 phase gates for the active cycle (00–17, this one included) shows as passed.
- Final approval is recorded with an explicit timestamp, not inferred from the user simply not objecting.

## Special cases

- **Incremental cycle**: the structural and conflict checks run against the whole project's current state (all cycles combined, since IDs and traceability are global), not just the new cycle's artifacts in isolation — a Change Request from this cycle could affect a document from cycle 1, and that needs to show up here too. The `ready_for_implementation` flag being set, however, only applies to the active cycle.
- **A gap traces back to a phase that was legitimately skipped this cycle**: not a gap — `rules/traceability-rules.md`'s skipped-phase exception applies, and the structural check (via `scripts/validate-traceability.mjs`) already accounts for this by reading `project-state.md`'s skip list.
- **User wants to override a genuine unresolved gap and proceed anyway**: this is the same override path `SKILL.md` already defines for "skip straight to code" — a conscious user decision, recorded explicitly as an override with a timestamp, never a default and never the AI's own initiative.

## Common ambiguities

- Confusing an orphan (structural — a script catches it) with a conflict (semantic — only judgment catches it): keep the review report's two sections genuinely separate, since they have different resolution paths and different levels of confidence.
- A minor, low-impact orphan tempting the AI to "just note it and move on": every gap goes through the same Change Request process regardless of perceived severity — severity isn't this phase's call to make unilaterally.

## Frequent errors

- Patching the document where a gap or conflict was found instead of opening a Change Request, leaving downstream documents silently stale.
- Treating the subagent's structural report as covering conflicts too — it doesn't; the semantic scan is a separate, non-delegable step that must actually happen.
- Setting `ready_for_implementation: true` before the user's explicit final approval, or inferring approval from the user not raising an objection.

## Examples

> AI: "Structural check via subagent: clean, no orphans or broken references. Semantic scan: I found one conflict — REQ-018 (99.9% availability) and the deployment plan's single-instance environment for staging don't contradict each other since staging isn't held to that SLA, but ARCH-004's load-balancer decision assumes at least 2 instances in every environment per its own text, which contradicts the deployment plan's staging setup. This needs a Change Request against ARCH-004 to clarify it's a production-only requirement, or against the deployment plan to add a second staging instance. Which is actually correct?"
> User: "ARCH-004 should specify production-only, staging doesn't need it."
> AI: "Opening CR-003 against ARCH-004 to add that scope clarification, which will re-open ARCH-004 and anything downstream of it for re-approval. I'll come back to you once that's resolved before asking for final sign-off."

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never fix a gap or conflict by editing the originating document directly instead of going through a Change Request, and never set `ready_for_implementation: true` without the user's explicit, individually-confirmed final approval — this is the one confirmation in the entire Skill that has zero exceptions, in any mode, for any project size.

## Checklist

`checklists/17-review-checklist.md`

## Quality Gate

`quality-gates/17-review-gate.md` — the master gate, the strictest of all. Summary: zero unresolved structural gaps across the full traceability graph; zero unresolved semantic conflicts; all 18 phase gates passed for the active cycle; explicit final approval recorded with a timestamp.

## Approval criteria

This phase — and the active cycle — is done only when the structural check is clean, the semantic conflict scan found nothing unresolved, every prior gate genuinely passed, and the user has given explicit final approval. Only then does `project-state.md` mark the cycle `ready_for_implementation: true`, which is the only thing `SKILL.md` accepts as permission to generate code.
