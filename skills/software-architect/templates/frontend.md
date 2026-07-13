# Frontend Planning — Template

Saved at `docs/10-frontend-planning/frontend.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/10-frontend-planning.md`. Plans screens, navigation, and high-level component organization from the approved Use Cases and API — not a full UI/UX design pass, just enough structure to inform Testing, Deployment, and the eventual implementation. Screens don't get a formal ID prefix (`rules/id-conventions.md`) — each is a heading followed by an italic metadata line, per `rules/document-format.md`, using the screen's name in place of an ID.

## Structure (Casual)

```markdown
# Frontend Planning

## State management
<Confirmed approach — `[confirmation individual]`. For a server-rendered/
MVC project with no client-side framework, this usually resolves to "not
applicable — no client-side state, every action is a full page load or
redirect." That's a valid, complete answer.>

## Design system
<Existing UI kit, or explicitly "to be created" — `[confirmation individual]`.>

## Target platforms
<Web / mobile / both, responsiveness expectations.>

## Screens

### Order Details
*Traces to: UC-014*

<High-level component hierarchy — not a full component spec, just enough
to show the screen isn't monolithic if it shouldn't be.>

**Calls**: API-001 <which interaction units from docs/09-api-design/api.md
this screen uses. For a client-server style, these are real calls the
screen makes. For a server-rendered style, the screen and the
interaction unit are typically the SAME route — list the same API-XXX
here rather than inventing a separate synthetic call, and say so
explicitly (e.g. "this screen IS API-001's rendered response").>

## Navigation

```mermaid
flowchart TD
    ...
```
```

## Fully Dressed additions

```markdown
## Accessibility
<Target conformance level (e.g. WCAG 2.1 AA) and any specific
requirements beyond the baseline — screen reader support, keyboard
navigation, color contrast. "Baseline WCAG 2.1 AA, nothing beyond" is
valid if that's genuinely the target.>

## Content and tone guidelines
<How copy should read across screens — voice, terminology consistency
(tie back to the Domain Model's ubiquitous language if Fully Dressed
there too), error-message tone. "(none) — follow existing brand
guidelines at <link>" is valid if one already exists.>

### Order Details
*Traces to: UC-014*

<component hierarchy, as in Casual>

**Calls**: API-001

**States**
| State | What the user sees |
|---|---|
| Loading | ... |
| Empty | ... |
| Error | ... |
<Every screen needs its loading/empty/error states considered
explicitly — a screen with only its "happy path" content specified is
incomplete.>

**Responsive behavior**
<How this screen adapts across the breakpoints below — or "(none) —
desktop-only" if genuinely out of scope.>

**Analytics events**
<Which user actions on this screen are tracked, and under what event
name — or "(none) — not instrumented" if analytics isn't part of this
project.>

## Responsive breakpoints
<The actual breakpoint values used project-wide (e.g. mobile <768px,
tablet 768–1024px, desktop >1024px), so every screen's "Responsive
behavior" above refers to the same scale.>
```

## Notes for whoever fills this in

- **Every screen needs `traces_to`** pointing to at least one `UC-XXX` — a screen invented without a Use Case behind it doesn't belong here.
- **Every Use Case with a real user-facing interaction needs a screen**, unless it's explicitly backend-only (documented as such).
- This phase does not design visual style, exact layout, or pixel-level detail — it plans structure and navigation, not the interface itself.
- **Server-rendered / MVC projects**: don't treat this document and `docs/09-api-design/api.md` as fully independent — a screen here is very often the same thing as an interaction unit there. This document adds navigation/structure framing on top of what's already defined in `api.md`; it doesn't redefine the route.
