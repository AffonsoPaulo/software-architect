# Confirmation Protocol

This is the single most important rule in the Skill. It governs every question asked in every phase, with no exceptions. No playbook may shortcut it.

## The loop

For any question the Skill asks:

1. **Ask** the question.
2. **User answers.**
3. **AI interprets** the answer.
4. **AI rewrites** its understanding in plain language.
5. **AI shows exactly how this will be documented** — the literal text/fields that will go into the target document.
6. **AI asks**: "Is this what you meant?"
7. **User confirms** (or corrects).
8. If corrected, **repeat from step 3** until the user gives explicit approval.
9. Only then is the **document updated**.
10. Only then does the Skill move to the **next question**.

The AI never assumes anything. It never documents an interpretation the user has not explicitly confirmed.

## Confirmation modes

Set once, during `playbooks/00-project-calibration.md`, and stored in `project-state.md`. Applies to the whole project (not per-cycle — see `project-state.md`'s `cycles` structure).

- **Strict**: every single question goes through the full loop above, individually, one at a time.
- **Agile**: answers may be gathered and confirmed in batches (e.g. "here's what I understood from your last 3 answers — confirm all?") — **except** for any question tagged `[confirmation individual]`, which always uses the full one-at-a-time loop regardless of mode.

The user chooses the mode explicitly during Calibration, after the AI explains the difference. The mode can be changed at any point in the project, but only via explicit user request — the AI never switches modes on its own initiative. A mode change is logged in `project-state.md` with a timestamp; it does not retroactively affect already-confirmed answers.

## Always-strict categories

Regardless of the chosen mode, these categories always use the full individual loop:

- Architecture decisions (architectural style, core technology choices)
- Sensitive/PII data handling
- Authentication/authorization design
- Core technology choices (language, framework, database engine)
- Any decision with a high cost of reversal later

A playbook marks a question `[confirmation individual]` in its "Mandatory questions" section (see `playbook-structure.md`) when it falls into one of these categories. This tag is a per-question override, not a per-phase one — a phase can have a mix of individually- and batch-confirmable questions.

## Correcting an already-approved answer

If the user corrects a decision from a phase that is already marked approved in `project-state.md`, this is **not** a simple edit. It triggers `change-management.md` — a formal Change Request — because other documents may already depend on the old answer via the traceability graph (`traceability-rules.md`). The AI never edits an approved document in place without going through this process.

## "I don't know" to a mandatory question

A common, expected scenario — must neither stall the flow indefinitely nor become a silent assumption (either would violate `ai-invariants.md`).

1. The AI may propose a recommendation, but it must be explicitly labeled as a **suggestion, not an automatic decision** — e.g. "Here's a common choice for this situation, but it's a suggestion — you decide."
2. If the user accepts the suggestion, it goes through the normal confirmation loop (steps 3–9 above) like any other answer.
3. If the user still doesn't know, the question becomes an open item in `templates/risk-register.md` (a new `RISK-XXX` entry), and the phase's Quality Gate is marked **"conditionally approved — pending item registered"** instead of blocking the phase entirely.
4. Exception: if the pending question belongs to an always-strict category (architecture, security, sensitive data), it cannot be left conditionally open — the phase stays blocked until it is genuinely resolved. See `quality-gate-structure.md` for the escape valve that applies to non-strict pending items.

## What this protocol does not cover

- The exact wording/tone of questions — left to the AI's judgment per phase.
- What happens when a Quality Gate criterion itself can't be resolved (not the same as "I don't know" to a question) — see the escape valve in `quality-gate-structure.md`.
- Subagent-sourced information that contradicts a user answer — see `delegation-policy.md`.
