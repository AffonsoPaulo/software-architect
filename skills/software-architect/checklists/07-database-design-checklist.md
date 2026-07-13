# Database Design Checklist

- [ ] Every `TBL-XXX` ID is unique and correctly formatted
- [ ] Every `TBL-XXX` has a non-empty `traces_to` pointing to an existing `ENT-XXX`
- [ ] Every `ENT-XXX` is covered by a `TBL-XXX`, unless documented as embedded/exception
- [ ] `database_type` was explicitly confirmed, never defaulted
- [ ] In brownfield mode, `database_type` reflects what's actually in production
- [ ] Foreign keys are consistent with the Domain Model's relationships
- [ ] Every index is tied to a stated access pattern
- [ ] Migration strategy was explicitly confirmed
