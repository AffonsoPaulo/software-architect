# Frontend Planning — Template

Saved at `docs/10-frontend-planning/frontend.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/10-frontend-planning.md`. Plans screens, navigation, and high-level component organization from the approved Use Cases and API — not a full UI/UX design pass, just enough structure to inform Testing, Deployment, and the eventual implementation.

## Structure

```yaml
---
state_management: "<approach — `[confirmation individual]`>"
design_system: "<existing UI kit to use, or 'to be created' — `[confirmation individual]`>"
target_platforms: ["web"]
# web | mobile | both, and responsive breakpoints if relevant
screens:
  - id: "screen-order-refund"
    # screens don't get a formal ENT-style ID prefix (no ID prefix reserved
    # for them in rules/id-conventions.md) — use a short, stable slug instead,
    # consistent across this document
    traces_to: ["UC-014"]
    # REQUIRED — at least one UC-XXX. Never blank.
    name: "<screen name>"
    api_calls: ["API-001"]
    # which endpoints from docs/09-api-design/api.md this screen calls
---
```

```markdown
# Frontend Planning

## State management
<Confirmed approach — `[confirmation individual]`.>

## Design system
<Existing UI kit, or explicitly "to be created" — `[confirmation individual]`.>

## Target platforms
<Web / mobile / both, responsiveness expectations.>

## Screens
<One subsection per screen: which Use Case(s) it serves, which API
endpoints it calls, high-level component hierarchy (not a full component
spec — just enough to show the screen isn't monolithic if it shouldn't be).>

## Navigation

```mermaid
flowchart TD
    ...
```
```

## Notes for whoever fills this in

- **Every screen needs `traces_to`** pointing to at least one `UC-XXX` — a screen invented without a Use Case behind it doesn't belong here.
- **Every Use Case with a real user-facing interaction needs a screen**, unless it's explicitly backend-only (documented as such).
- This phase does not design visual style, exact layout, or pixel-level detail — it plans structure and navigation, not the interface itself.
