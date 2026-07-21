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
- `docs/08-architecture/architecture.md` — approved, specifically the confirmed frontend topology (only present when this phase was already known to be included at the time Architecture ran).

## Outputs

- `docs/10-frontend-planning/frontend.md`.
- `docs/10-frontend-planning/scr-XXX.md` — one per screen.

## Documents produced

- `docs/10-frontend-planning/frontend.md` (index: state management, design system, target platforms, frontend topology, component organization, component inventory, navigation) plus one `docs/10-frontend-planning/scr-XXX.md` per screen, via `templates/frontend.md` (`rules/document-locations.md`).

## Mandatory questions

- What screens/pages exist, one per relevant Use Case (or grouping)?
- Per screen: what is it for (its role in the flow), and what is it composed of (a light, named breakdown — not a full component spec)?
- Per screen or action: is visibility/access gated by role or permission ("only X can see/do this")? Note it explicitly the moment it comes up here, even when the answer is "no gating, public" — this phase records *that* the constraint exists and roughly what it is, as input for phase 11's authorization model, not the full rule itself (that's phase 11's job). Don't let a permission constraint surface only as an offhand remark that has to be tracked down and formalized retroactively later.
- Are there components reused across more than one screen? What does each do, and which screens use it?
- How are components organized internally — atomic design, feature-based, ad hoc by convention, or genuinely no formal organization yet?
- Navigation flow between screens?
- State management approach — `[confirmation individual]`. For a server-rendered/MVC project with no client-side framework (see phase 09's interaction style), this question usually resolves to "not applicable — no client-side state, every action is a full page load or redirect." That's a valid, complete answer — confirm it explicitly as such rather than treating the question as if it assumes a SPA architecture.
- Design system/UI kit to use (existing or to be created) — `[confirmation individual]`
- Responsiveness/target platforms (web, mobile, or both)?
- If phase 08 (Architecture) confirmed a frontend topology: does this phase's screen-level view match it, or has something emerged that genuinely calls for a divergence? Not a fresh decision to make here — a confirmation of what's already settled, the same treatment API Design gives an Interaction style divergence.

*Fully Dressed only* (`rules/documentation-depth.md`):
- What accessibility conformance level is the target (e.g. WCAG 2.1 AA), and are there specific requirements beyond the baseline?
- What do loading, empty, and error states look like by default, across screens? Recorded once as the project's "General conventions" — every screen still states its own answer explicitly (never omitted), either "Same as General conventions" or its actual divergence.
- What are the actual responsive breakpoint values used project-wide?
- Are user actions tracked at all, and under what general naming convention? Same "recorded once in General conventions, every screen restates explicitly" treatment as states above.
- Are there content/copy/tone guidelines screens should follow? Same treatment — this is a fourth entry in General conventions, not a separate topic of its own.

## Optional questions

- Whether specific screens warrant their own sub-navigation diagram if the overall flow is large enough that one diagram would be unreadable.

## Interview flow

1. Confirm target platforms and responsiveness expectations first — this frames every screen decision that follows.
2. If Architecture confirmed a frontend topology, restate it and confirm it still matches; if this phase is reached and Architecture's own answers predate phase 10 being added to scope (e.g. an incremental cycle), treat the topology question as newly owed there via `rules/change-management.md` rather than deciding it here.
3. Walk the Use Cases with a real user-facing interaction, one at a time, deriving a screen (or confirming several Use Cases share one screen) for each — Description, Composition, Permission, and Calls together, in the same pass, while the screen is concretely in view.
4. Once every screen is walked: component inventory — consolidate any component name that came up on more than one screen in step 3, confirm its responsibility as a single description shared across all its uses.
5. Component organization, state management, and design system — `[confirmation individual]` each for the latter two, asked once the screens give enough concrete grounding to make the choice meaningful rather than abstract.
6. Navigation flow, once screens are settled.

## How to confirm answers

Standard loop (`rules/confirmation-protocol.md`). State management and design system are always individually confirmed. Frontend topology is individually confirmed only if it diverges from Architecture's guidance — a straightforward confirmation of what Architecture already decided doesn't need the full individual treatment, but a genuine divergence does, exactly like an Interaction style divergence in `playbooks/09-api-design.md`.

## How to document answers

Each confirmed screen gets the next `SCR-XXX` ID (`project-state.md`'s `id_sequences.SCR`) and becomes its own `docs/10-frontend-planning/scr-XXX.md` item file, with `Traces to` pointing to its source Use Case(s), a `Description`, a `Composition`, a `Permission`, and which interaction units from `docs/09-api-design/api.md` it `Calls` — real calls for a client-server style, or the same route for a server-rendered style (see "Special cases"). A matching row is added to `frontend.md`'s Screens table. The component inventory table is built once, after step 4 of the interview, from names that repeated across more than one screen — a component used on exactly one screen stays named only in that screen's own Composition, not duplicated into the inventory. The navigation `flowchart` (`rules/diagram-conventions.md`) is built from the confirmed screen list and flow, not sketched ahead of it. Any role/permission gating noted for a screen or action is recorded in that screen's own `Permission` field as a plain statement of the constraint — phase 11 is what turns it into a formal `SEC-XXX` control. At Fully Dressed depth, the additional answers map to `templates/frontend.md`'s "Fully Dressed additions" section, including the index-level "General conventions" (states, responsive behavior, analytics, and content/tone together — one section, not four separate ones). Every screen still states its own States/Responsive behavior/Analytics events fields explicitly — "Same as General conventions" when nothing diverges, the actual content when something does — never omitted, the same principle as an empty `Traces to` still being written as `(none)` (`rules/document-format.md`).

**A screen's Composition or Permission that appears to encode a business rule not already captured upstream** (e.g. "field X only appears when the license type is Y") is not this phase's decision to make silently — flag it explicitly the same way a permission constraint is flagged, and route it back through Business Analysis/Requirements (a new `BR-XXX`, or a Change Request against an already-approved one) rather than letting a real business decision get invented here as an incidental UI detail. This phase renders rules that already exist; it does not mint new ones.

## How to validate answers

- Every screen has `traces_to` pointing to at least one existing `UC-XXX`.
- Every Use Case with a real user-facing interaction has a corresponding screen, or an explicit note that it's backend-only.
- Every `SCR-XXX` ID is unique and correctly formatted.
- Every component inventory entry's "Used by" list references real, existing `SCR-XXX` screens.
- State management and design system are recorded as confirmed decisions, not defaults.
- Frontend topology matches Architecture's confirmed decision, or a divergence was individually confirmed and reflected back to `docs/08-architecture/architecture.md` via `rules/change-management.md` if Architecture was already approved.

## Special cases

- **A Use Case spans multiple screens, or multiple Use Cases share one screen**: both are valid — record the actual mapping as confirmed, not a forced 1:1 assumption.
- **Existing design system from a brownfield project**: if Calibration's subagent research already surfaced one, present it as the default to confirm rather than asking as if starting fresh.
- **Server-rendered / MVC projects** (Laravel Blade, Rails views, Django templates, and similar): a screen here is very often the exact same route already documented as an interaction unit in `docs/09-api-design/api.md` — there's no separate client calling a JSON API. In this case, don't redesign the route; reference the existing `API-XXX` and add only the navigation/structure framing this phase is actually for (which screen links to which, high-level layout grouping). State explicitly in the screen's `Calls` field that it IS that interaction unit's rendered response, not a consumer of it.
- **A project with no reusable components at all** (every screen genuinely self-contained): the component inventory is legitimately empty — record "(none) — no components reused across screens" rather than forcing entries that don't exist.

## Common ambiguities

- "We'll figure out the design system later" — push for at least "to be created" as an explicit, confirmed answer rather than leaving it open; an unconfirmed design system decision left implicit tends to get decided ad hoc during implementation, which is exactly what this Skill exists to prevent.
- A screen described by its visual layout ("a card grid") rather than its purpose — ask what Use Case it serves before accepting the screen into the document; layout detail beyond structure isn't this phase's job anyway.
- A screen's `Description` that just restates its Use Case's title ("screen for UC-001") — push for the screen-specific framing: what a user actually sees and can do here, not a repetition of the use case name.

## Frequent errors

- A screen with no Use Case behind it.
- A Use Case with real user interaction left without any screen and no explicit "backend-only" note.
- Treating state management or design system as low-stakes and confirming them in a batch with unrelated questions in Agile mode, when both are always-strict here.
- Assuming frontend topology is obviously "a single application" instead of checking what Architecture actually confirmed.
- Letting a screen's Composition specify props, variants, or internal state — that's implementation detail, not this phase's job; a component gets a name and a responsibility here, nothing lower-level.
- Noticing a screen's conditional visibility or requiredness looks like a new business rule and documenting it anyway instead of flagging it for Business Analysis/Requirements.

## Examples

> AI: "UC-014 (customer-initiated refund) and UC-015 (viewing order history) both seem to live on the same 'Order Details' screen — the refund action is available from there. Does that match what you had in mind, or should refund be its own separate screen?"
> User: "Same screen, that's right."
> AI: "Recording SCR-001, 'Order Details,' tracing to both UC-014 and UC-015, calling API-001 (refund) and API-005 (order history). Description: the screen where a customer reviews a past order and can request a refund on it. Composition: OrderSummary → OrderItemsTable → RefundButton → RefundConfirmModal. Permission: any authenticated customer, scoped to their own orders. Confirm?"

## Anti-patterns

See `rules/ai-invariants.md`. In particular: never invent a screen without a Use Case behind it, never assume a design system, state management approach, or frontend topology as an "obvious" default for this kind of project, and never let a screen's conditional logic silently mint a new business rule instead of flagging it back to Business Analysis/Requirements.

## Checklist

`checklists/10-frontend-planning-checklist.md`

## Quality Gate

`quality-gates/10-frontend-planning-gate.md`. Summary: every screen traces to a Use Case; every Use Case with a user-facing interaction has a corresponding screen; every `SCR-XXX` ID is valid; the component inventory only references real screens.

## Approval criteria

This phase is done when every screen has a valid `traces_to` and a unique `SCR-XXX` ID, every relevant Use Case is covered, the component inventory is complete and consistent with what each screen's Composition actually names, state management, design system, and (when applicable) frontend topology have been individually confirmed, and the user has explicitly confirmed the full screen list and navigation flow.
