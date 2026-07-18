# Delegation Policy

When and how the Skill may delegate work to a subagent (e.g. the `Task`/`Agent` tool). Scope is deliberately restricted to **two** uses — expanding this scope was discussed explicitly with the user and rejected beyond these two, because a subagent starts cold (no history of the project's confirmed decisions) and cannot run the confirmation loop, which is fundamentally in tension with "never assume anything."

## The two sanctioned uses

1. **Read-only research** (phases 00, 08, 09 — Calibration, Architecture, API Design), against either of two targets:
   - **An existing codebase**, when the project is brownfield: a subagent explores the existing code/schema/API and reports **facts**, never decisions, back to the main thread.
   - **A sibling project this Skill already planned**, when Calibration's "prior artifacts" question identifies one (`playbooks/00-project-calibration.md`) — independent of whether the current project is brownfield or a genuinely new product. A subagent reads that project's already-*approved* documents (never a document still `draft`/`pending re-approval`) read-only and reports back what it decided (tech stack, domain entities, architecture pattern, security posture) as **facts about that other project**, not as recommendations for this one.

   Either way, the main thread uses those facts to ask better-informed questions — it does not skip asking, and a sibling project's decision is always offered as a starting suggestion to confirm, adapt, or reject, never presented as already settled the way an existing codebase's own reality is (see the phases' own "Special cases" for how each treats the two differently).
2. **Mechanical audit for phase 17 (Review)**: a subagent runs `scripts/validate-ids.mjs` and `scripts/validate-traceability.mjs` and returns the raw report. The main thread synthesizes that report, performs the semantic conflict scan (not delegable — it requires the full history of confirmed decisions), and runs the final confirmation with the user.

## Rules every use of a subagent must follow, without exception

- A subagent **never** runs the confirmation loop (`confirmation-protocol.md`) with the user — that always belongs to the main thread, because only the main thread holds the history of already-confirmed decisions.
- A subagent **never** decides, proposes a requirement or business rule, or writes text that goes directly into a document without passing through the main thread and the appropriate `[confirmation individual]` step.
- A subagent is only ever used for **read-only research** or **mechanical/scriptable** work — never to draft Vision, Requirements, Architecture, or any document requiring business judgment.
- Outside the two uses above, the Skill runs entirely in the main thread. No other phase introduces a subagent without this file being updated first.

## Contradiction between subagent findings and the user's answer

If the subagent's research contradicts what the user just said (e.g. the user says "we use REST" but the code found is GraphQL), the AI never silently picks a side. It surfaces the discrepancy explicitly — "You mentioned X, but I found Y in the code — which is correct/current?" — and treats the user's response to that question as a new confirmation. It never assumes the code is right, and never assumes the user is right.
