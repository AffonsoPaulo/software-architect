# API Design Checklist

- [ ] Every `API-XXX` ID is unique and correctly formatted
- [ ] Every `API-XXX` has `traces_to` pointing to both an existing `UC-XXX` and an existing `ARCH-XXX`
- [ ] Every `UC-XXX` with a real API surface is covered by at least one `API-XXX`, or documented as frontend-only
- [ ] `error_format` is used consistently across every endpoint
- [ ] `api_style` matches phase 08's guidance, or divergence is justified and individually confirmed
- [ ] Authentication/authorization mechanism was individually confirmed
- [ ] In brownfield mode, style/versioning/error format reflect production reality
- [ ] Every endpoint was explicitly confirmed by the user
