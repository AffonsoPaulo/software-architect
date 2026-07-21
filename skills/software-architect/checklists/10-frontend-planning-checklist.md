# Frontend Planning Checklist

- [ ] Every `SCR-XXX` ID is unique and correctly formatted
- [ ] Every screen has a non-empty `traces_to` pointing to an existing `UC-XXX`
- [ ] Every `UC-XXX` with a user-facing interaction is covered by at least one screen, or documented as backend-only
- [ ] Every `SCR-XXX` referenced in `frontend.md` (including the component inventory) actually exists
- [ ] State management approach was individually confirmed
- [ ] Design system/UI kit was individually confirmed
- [ ] Frontend topology matches Architecture's confirmed decision, or a divergence was individually confirmed
- [ ] Target platforms and responsiveness expectations are explicit
- [ ] Screen-to-Use-Case mapping reflects what was actually confirmed
- [ ] Every screen has a genuine Description and a Composition without props/variants/internal state
- [ ] Component inventory entries match components actually reused across screens
- [ ] Every screen states States/Responsive behavior/Analytics events explicitly, never omitted
- [ ] Every screen was explicitly confirmed by the user
