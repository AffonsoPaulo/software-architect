# Playbook 10 — Frontend Planning

## Objective

Plan screens, navigation, and high-level component organization from the approved Use Cases and API. Not a full UI/UX design pass — just enough structure to inform later phases and the eventual implementation.

## When to run

Whenever `docs/project-state.md` marks phase 10 as included — whenever the project has a user-facing interface.

## When NOT to run

Skippable for projects with no interface at all — a pure API, a CLI, a background job. This condition is decided in `playbooks/00-project-calibration.md`; this playbook reaffirms the same skip condition rather than defining a separate one, so the two never drift apart. If somehow reached for a project genuinely without an interface, stop and confirm with the user whether Calibration's phase list needs correcting rather than forcing screens onto a project that has none.

## Inputs

- `docs/05-use-cases/use-cases.md` — approved.
- `docs/09-api-design/api.md` — approved.

## Outputs

- `docs/10-frontend-planning/frontend.md`.

## Documents produced

- `docs/10-frontend-planning/frontend.md` via `templates/frontend.md`.

## Mandatory questions

- What screens/pages exist, one per relevant Use Case (or grouping)?
- Navigation flow between screens?
- State management approach — `[confirmation individual]`. For a server-rendered/MVC project with no client-side framework (see phase 09's interaction style), this question usually resolves to "not applicable — no client-side state, every action is a full page load or redirect." That's a valid, complete answer — confirm it explicitly as such rather than treating the question as if it assumes a SPA architecture.
- Design system/UI kit to use (existing or to be created) — `[confirmation individual]`
- Responsiveness/target platforms (web, mobile, or both)?
- Per screen or action: is visibility/access gated by role or permission ("only X can see/do this")? Note it explicitly the moment it comes up here — this phase records *that* the constraint exists and roughly what it is, as input for phase 11's authorization model, not the full rule itself (that's phase 11's job). Don't let a permission constraint surface only as an offhand remark that has to be tracked down and formalized retroactively later.

*Fully Dressed only* (`rules/documentation-depth.md`):
- What accessibility conformance level is the target (e.g. WCAG 2.1 AA), and are there specific requirements beyond the baseline?
- Are there content/copy/tone guidelines screens should follow?
- Per screen: what does the user see in the loading, empty, and error states?
- What are the actual responsive breakpoint values used project-wide?
- Per screen: which user actions are tracked, and under what event name?

## Optional questions

- Whether specific screens warrant their own sub-navigation diagram if the overall flow is large enough that one diagram would be unreadable.

## Interview flow

1. Confirm target platforms and responsiveness expectations first — this frames every screen decision that follows.
2. Walk the Use Cases with a real user-facing interaction, one at a time, deriving a screen (or confirming several Use Cases share one screen) for each.
3. State management and design system — `[confirmation individual]` each, asked once these screens give enough concrete grounding to make the choice meaningful rather than abstract.
4. Navigation flow, once screens are settled.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). State management and design system are always individually confirmed — both are expensive to change once implementation starts.

## How to document answers

Each confirmed screen gets a stable name (no formal ID prefix is reserved for screens in `rules/id-conventions.md`) and a `Traces to` pointing to its source Use Case(s), plus which interaction units from `docs/09-api-design/api.md` it uses — real calls for a client-server style, or the same route for a server-rendered style (see "Special cases"). The navigation `flowchart` (`rules/diagram-conventions.md`) is built from the confirmed screen list and flow, not sketched ahead of it. Any role/permission gating noted for a screen or action is recorded in that screen's own notes as a plain statement of the constraint — phase 11 is what turns it into a formal `SEC-XXX` control. At Fully Dressed depth, the additional answers map to `templates/frontend.md`'s "Fully Dressed additions" section.

## How to validate answers

- Every screen has `traces_to` pointing to at least one existing `UC-XXX`.
- Every Use Case with a real user-facing interaction has a corresponding screen, or an explicit note that it's backend-only.
- State management and design system are recorded as confirmed decisions, not defaults.

## Special cases

- **A Use Case spans multiple screens, or multiple Use Cases share one screen**: both are valid — record the actual mapping as confirmed, not a forced 1:1 assumption.
- **Existing design system from a brownfield project**: if Calibration's subagent research already surfaced one, present it as the default to confirm rather than asking as if starting fresh.
- **Server-rendered / MVC projects** (Laravel Blade, Rails views, Django templates, and similar): a screen here is very often the exact same route already documented as an interaction unit in `docs/09-api-design/api.md` — there's no separate client calling a JSON API. In this case, don't redesign the route; reference the existing `API-XXX` and add only the navigation/structure framing this phase is actually for (which screen links to which, high-level layout grouping). State explicitly in the screen's notes that it IS that interaction unit's rendered response, not a consumer of it.

## Common ambiguities

- "We'll figure out the design system later" — push for at least "to be created" as an explicit, confirmed answer rather than leaving it open; an unconfirmed design system decision left implicit tends to get decided ad hoc during implementation, which is exactly what this Skill exists to prevent.
- A screen described by its visual layout ("a card grid") rather than its purpose — ask what Use Case it serves before accepting the screen into the document; layout detail beyond structure isn't this phase's job anyway.

## Frequent errors

- A screen with no Use Case behind it.
- A Use Case with real user interaction left without any screen and no explicit "backend-only" note.
- Treating state management or design system as low-stakes and confirming them in a batch with unrelated questions in Agile mode, when both are always-strict here.

## Examples

> AI: "UC-014 (customer-initiated refund) and UC-015 (viewing order history) both seem to live on the same 'Order Details' screen — the refund action is available from there. Does that match what you had in mind, or should refund be its own separate screen?"
> User: "Same screen, that's right."
> AI: "Recording one screen, 'Order Details,' tracing to both UC-014 and UC-015, calling API-001 (refund) and API-005 (order history). Confirm?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a screen without a Use Case behind it, and never assume a design system or state management approach as an "obvious" default for this kind of project.

## Checklist

`checklists/10-frontend-planning-checklist.md`

## Quality Gate

`quality-gates/10-frontend-planning-gate.md`. Summary: every screen traces to a Use Case; every Use Case with a user-facing interaction has a corresponding screen.

## Approval criteria

This phase is done when every screen has a valid `traces_to`, every relevant Use Case is covered, state management and design system have been individually confirmed, and the user has explicitly confirmed the full screen list and navigation flow.
