# Domain Model Checklist

- [ ] Every `ENT-XXX` ID is unique and correctly formatted
- [ ] Every `ENT-XXX` has a non-empty `traces_to` pointing to an existing `UC-XXX`
- [ ] Every `ENT-XXX` has at least one explicit invariant
- [ ] Every `ENT-XXX` is an aggregate root or explicitly belongs to one
- [ ] Every invariant is a genuine business rule, not a restated attribute
- [ ] No entity/attribute/relationship is described in database terms
- [ ] Entity vs. value object classification is correct
- [ ] Aggregate boundaries were individually confirmed
- [ ] Relationship cardinalities were explicitly confirmed
