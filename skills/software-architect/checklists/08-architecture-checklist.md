# Architecture Checklist

- [ ] Every `ARCH-XXX` ID is unique and correctly formatted
- [ ] Every non-functional `REQ-XXX` is referenced by at least one `ARCH-XXX`
- [ ] Every `ARCH-XXX` with an `adr` field points to an existing `ADR-XXX`
- [ ] Every consequential decision has an associated ADR
- [ ] Every component has a single, clear responsibility
- [ ] Architectural style and core technologies were individually confirmed
- [ ] In brownfield mode, the architecture reflects the actual existing system
- [ ] `interaction_style_guidance` is specific enough for phase 09 to use directly, and names what the project actually is rather than defaulting to REST
