# API Design Checklist

- [ ] Every `API-XXX` ID is unique and correctly formatted
- [ ] Every `API-XXX` has `traces_to` pointing to both an existing `UC-XXX` and an existing `ARCH-XXX`
- [ ] Every `UC-XXX` with a real interaction surface is covered by at least one `API-XXX`, or documented as frontend-only
- [ ] `failure_format` is used consistently across every interaction unit
- [ ] `interaction_style` matches phase 08's guidance, or divergence is justified and individually confirmed
- [ ] Interaction units are shaped consistently with phase 08's confirmed architectural pattern, or divergence is justified and individually confirmed
- [ ] The vocabulary used actually fits the confirmed interaction style
- [ ] Authentication/authorization mechanism was individually confirmed
- [ ] In brownfield mode, style/versioning/failure format reflect production reality
- [ ] Every interaction unit was explicitly confirmed by the user
