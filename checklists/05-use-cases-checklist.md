# Use Cases Checklist

- [ ] Every `UC-XXX` ID is unique and correctly formatted
- [ ] Every `UC-XXX` has a non-empty `traces_to` pointing to an existing `US-XXX`
- [ ] Every `UC-XXX` has at least one postcondition
- [ ] Every main-flow step with real failure risk has a corresponding alternative/exception flow
- [ ] Preconditions and postconditions are distinct from main-flow steps
- [ ] Diagrams follow `rules/diagram-conventions.md`
- [ ] Payment/sensitive-data exception flows were individually confirmed, regardless of mode
- [ ] Every use case was explicitly confirmed by the user
