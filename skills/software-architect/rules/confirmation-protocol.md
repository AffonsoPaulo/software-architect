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

**A batch confirmation covers the full content, not a summary of it.** If the target template has N fields per item (e.g. Backlog's Estimate, Dependencies, Definition of Ready, Acceptance test scenarios), the batch shown to the user has to reflect all N — or explicitly name which ones are being left at a stated default — not just the one or two fields that fit neatly in a summary table (a title and a priority, say). Confirming a summary table and then writing the full multi-field record afterward, without showing that expanded content for its own confirmation, is not a batch confirmation of that item — it's an unconfirmed one. This applies even when the summary itself was genuinely, individually confirmed: agreeing to a title and a priority is not the same as agreeing to an estimate, a dependency list, and acceptance criteria that were never shown.

The user chooses the mode explicitly during Calibration, after the AI explains the difference. The mode can be changed at any point in the project, but only via explicit user request — the AI never switches modes on its own initiative. A mode change is logged in `project-state.md` with a timestamp; it does not retroactively affect already-confirmed answers.

## Always-strict categories

Regardless of the chosen mode, these categories always use the full individual loop:

- Architecture decisions (architectural style, core technology choices)
- Sensitive/PII data handling
- Authentication/authorization design
- Core technology choices (language, framework, database engine)
- Any decision with a high cost of reversal later

A playbook marks a question `[confirmation individual]` in its "Mandatory questions" section (see `playbook-structure.md`) when it falls into one of these categories. This tag is a per-question override, not a per-phase one — a phase can have a mix of individually- and batch-confirmable questions.

## An ad hoc batching request is not a mode change

A user in Strict mode will sometimes ask to batch a specific, named handful of items anyway — "just write the whole thing for these two and I'll approve or reject," "do the next 3 together." This is allowed, but it is scoped to exactly the items named in that request, nothing more:

- It does **not** change `confirmation_mode` in `project-state.md`. It is not logged as a mode change, because it isn't one.
- The very next question outside that named scope goes back to whatever mode the project actually has confirmed — the AI does not treat a one-off batching request as tacit, ongoing permission to keep batching for the rest of the phase, let alone the rest of the project. Generalizing a scoped request into an unstated, permanent practice across later phases is exactly the failure this section exists to prevent.
- Always-strict categories (architecture, security, authentication/authorization, sensitive data, any high-reversal-cost decision) are never covered by an ad hoc batching request, even if its wording is broad enough to seem like it includes them — those still get the full individual loop, no exception, regardless of what was just batched around them.
- If the AI notices itself still batching once the originally-named scope is done, that is the signal to stop and ask explicitly — "Want me to keep working in batches from here, or go back to one at a time?" — rather than silently continuing. Only if the user says yes to *that* question does it become a real mode change, handled per "Confirmation modes" above (logged, timestamped, applies going forward).

## Correcting an already-approved answer

If the user corrects a decision from a phase that is already marked approved in `project-state.md`, this is **not** a simple edit. It triggers `change-management.md` — a formal Change Request — because other documents may already depend on the old answer via the traceability graph (`traceability-rules.md`). The AI never edits an approved document in place without going through this process.

This applies just as much when the AI itself is the one who notices the conflict mid-loop — while working through steps 3–8 for a completely different, current-phase question — as when the user asks for the correction directly. Noticing and mentioning it is not the same as acting on it (`change-management.md`'s "Flagging the conflict out loud is not the same as opening the CR"): step 9 of the loop above — the current question's document update — does not happen until the CR against the earlier document has actually been opened, not left as a comment the user has to chase up later.

## "I don't know" to a mandatory question

A common, expected scenario — must neither stall the flow indefinitely nor become a silent assumption (either would violate `ai-invariants.md`).

1. The AI may propose a recommendation, but it must be explicitly labeled as a **suggestion, not an automatic decision** — e.g. "Here's a common choice for this situation, but it's a suggestion — you decide."
2. If the user accepts the suggestion, it goes through the normal confirmation loop (steps 3–9 above) like any other answer.
3. If the user still doesn't know, the question becomes an open item in `templates/risk-register.md` (a new `RISK-XXX` entry), and the phase's Quality Gate is marked **"conditionally approved — pending item registered"** instead of blocking the phase entirely. `risk-register.md` is not gated behind reaching phase 11 — per `rules/document-locations.md`, any phase may create it (if it doesn't exist yet) or append to it the moment the first pending item exists, even in phase 00. Do not defer the entry to "whenever Security happens" and leave the "I don't know" as prose in the meantime; create the actual `RISK-XXX` entry right when it happens.
4. Exception: if the pending question belongs to an always-strict category (architecture, security, sensitive data), it cannot be left conditionally open — the phase stays blocked until it is genuinely resolved. See `quality-gate-structure.md` for the escape valve that applies to non-strict pending items.

## What this protocol does not cover

- The exact wording/tone of questions — left to the AI's judgment per phase.
- What happens when a Quality Gate criterion itself can't be resolved (not the same as "I don't know" to a question) — see the escape valve in `quality-gate-structure.md`.
- Subagent-sourced information that contradicts a user answer — see `delegation-policy.md`.
