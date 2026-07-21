# Frontend Planning — Template

Saved at `docs/10-frontend-planning/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/10-frontend-planning.md`. Plans screens, navigation, and high-level component organization from the approved Use Cases and API — not a full UI/UX design pass, just enough structure to inform Testing, Deployment, and the eventual implementation.

This category splits into an **index file** (`frontend.md`) and one **item file** per screen (`scr-001.md`, `scr-002.md`, ...) — see `rules/document-locations.md`.

## Index file — `frontend.md`

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

## Frontend topology
<Oriented by Architecture (phase 08)'s Architectural style — single
application, or split into independently deployable micro-frontends.
Confirmed there; restated here for reference, not re-decided. A
divergence from Architecture's orientation is a new, individually-
confirmed decision, the same treatment API Design gives an Interaction
style divergence.>

## Component organization
<How components are organized internally — atomic design, feature-based,
ad hoc by convention, or "(none) — small enough that no formal
organization is needed yet" if genuinely true.>

## Component inventory
<Components reused across more than one screen — name, responsibility,
and which screens use it. Not props, variants, or internal state: those
are implementation detail, decided when the component is actually
built, not planning-level information a stakeholder needs.>

| Component | Responsibility | Used by |
|---|---|---|
| ... | ... | SCR-001, SCR-004 |

## Screens

| ID | Screen | Traces to |
|---|---|---|
| [SCR-001](scr-001.md) | Order Details | UC-014 |

## Navigation

```mermaid
flowchart TD
    ...
```
```

## Item file — `scr-001.md`

```markdown
# SCR-001 — <short title>
*Traces to: UC-014*

**Description**: <what this screen is for, its role in the flow — must
add screen-specific framing, not restate the Use Case's own title.>

**Composition**: <a named chain or light nesting of components making up
this screen — not a full component spec, just enough to show the screen
isn't monolithic if it shouldn't be. Reuse a name from the Component
inventory above when this screen uses a shared component; a name unique
to this screen is fine too.>

**Calls**: API-001 <which interaction units from docs/09-api-design/
api.md this screen uses. For a client-server style, these are real calls
the screen makes. For a server-rendered style, the screen and the
interaction unit are typically the SAME route — list the same API-XXX
here rather than inventing a separate synthetic call, and say so
explicitly (e.g. "this screen IS API-001's rendered response").>

**Permission**: <who can access this screen — a role/permission name, or
"public, no authentication" as an explicit, valid answer. Never silently
omitted, same principle as an empty `Traces to` still being written out
(`rules/document-format.md`).>
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

## General conventions
<Default loading/empty/error states, responsive behavior, and
analytics-tracking stance that apply to every screen unless that
screen's own file explicitly says otherwise — written once here instead
of repeated verbatim on every item file.>

**States**
| State | What the user sees |
|---|---|
| Loading | ... |
| Empty | ... |
| Error | ... |

**Responsive behavior**
<How screens generally adapt across the breakpoints below.>

**Analytics events**
<Whether user actions are tracked at all, and the general naming
convention if so — or "(none) — not instrumented" if analytics isn't
part of this project.>

## Responsive breakpoints
<The actual breakpoint values used project-wide (e.g. mobile <768px,
tablet 768–1024px, desktop >1024px), so every screen's responsive
behavior refers to the same scale.>
```

```markdown
# SCR-001 — <short title>
*Traces to: UC-014*

**Description**: ...
**Composition**: ...
**Calls**: API-001
**Permission**: ...

**States** (only if this screen diverges from the index's General
conventions — omit entirely otherwise)
| State | What the user sees |
|---|---|
| Empty | "You haven't created any recipes yet." |

**Responsive behavior** (only if diverging from General conventions)
<...>

**Analytics events** (only if diverging from General conventions)
<...>
```

## Notes for whoever fills this in

- **Every screen needs `traces_to`** pointing to at least one `UC-XXX` — a screen invented without a Use Case behind it doesn't belong here.
- **Every Use Case with a real user-facing interaction needs a screen**, unless it's explicitly backend-only (documented as such).
- **Description must add screen-specific framing, not restate the Use Case's own title** — "screen where a teacher reviews and edits questions before generating a test," not "screen for UC-001."
- **Composition names components, it doesn't specify them** — no props, no variants, no internal state; those are implementation detail, decided when the component is actually built.
- This phase does not design visual style, exact layout, or pixel-level detail — it plans structure and navigation, not the interface itself.
- **`SCR-XXX` IDs** come from `project-state.md`'s `id_sequences.SCR`, global to the project, same mechanism as every other category.
- **A screen's States/Responsive behavior/Analytics events sections are additive, not repetitive** — omit them entirely on a screen that follows the index's General conventions; include only what diverges.
- **Server-rendered / MVC projects**: don't treat this document and `docs/09-api-design/api.md` as fully independent — a screen here is very often the same thing as an interaction unit there. This document adds navigation/structure framing on top of what's already defined in `api.md`; it doesn't redefine the route.
