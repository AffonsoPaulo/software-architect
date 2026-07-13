# Testing Checklist

- [ ] Every `TEST-XXX` ID is unique and correctly formatted
- [ ] Every `TEST-XXX` has a non-empty `traces_to` pointing to an existing `REQ-XXX`
- [ ] 100% of functional `REQ-XXX` entries are covered by at least one `TEST-XXX`
- [ ] Every `TEST-XXX` has an explicit `kind` (automated or manual)
- [ ] Every non-functional requirement has a stated validation strategy
- [ ] Each test plan's description is specific enough to determine pass/fail
- [ ] `kind` reflects what was actually confirmed, not defaulted
- [ ] Every test plan was explicitly confirmed by the user
