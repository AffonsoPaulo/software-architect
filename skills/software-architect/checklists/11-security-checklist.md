# Security Checklist

- [ ] Every `SEC-XXX` ID is unique and correctly formatted
- [ ] Every `SEC-XXX` has a non-empty `traces_to` pointing to an existing `ARCH-XXX` and/or `API-XXX`
- [ ] Every `API-XXX` has an explicit auth statement recorded (including "public, no auth")
- [ ] Every sensitive data category has an associated control
- [ ] Every threat has a mitigation or an explicitly accepted, registered risk
- [ ] Authentication mechanism and authorization model were individually confirmed
- [ ] Data classification was individually confirmed and holds up against the actual data
- [ ] Compliance requirements were individually confirmed, including explicit "none"
- [ ] In brownfield mode, new interaction units follow the existing auth mechanism unless consciously changed
