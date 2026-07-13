# Security — Template

Saved at `docs/11-security/security.md` in the target project (see `rules/document-locations.md`). Produced by `playbooks/11-security.md`. Models threats, defines authentication/authorization in detail, classifies data, and records compliance requirements — always mandatory, regardless of project size or cycle. Risks identified here (or anywhere else in the project) live in `docs/11-security/risk-register.md` via `templates/risk-register.md`.

## Structure

```yaml
---
controls:
  - id: SEC-001
    traces_to: ["ARCH-003", "API-001"]
    # At least one of: an ARCH-XXX (component protected) or an API-XXX
    # (interaction unit protected) — REQUIRED, never blank.
    description: "<the control, stated as a concrete measure — e.g.
      'all refund interaction units require an authenticated session
      with the customer or support role'>"
threat_model:
  - component: "ARCH-003"
    threats:
      - category: "<STRIDE category or equivalent simplified label>"
        description: "<the threat, concretely>"
        mitigation: "SEC-001"
        # a SEC-XXX control, OR an explicit accepted-risk reference
        # (RISK-XXX in the risk register) — never left blank
data_classification:
  - data: "<what data — e.g. 'customer payment method'>"
    classification: "<PII | financial | health | other-sensitive | none>"
    handling: "<required treatment — encryption at rest, access
      restrictions, retention limits, etc.>"
authentication:
  mechanism: "<password | OAuth | SSO | magic link | other — `[confirmation individual]`>"
authorization:
  model: "<RBAC | ABAC | other — `[confirmation individual]`>"
compliance:
  - "<LGPD | GDPR | PCI-DSS | HIPAA | none | other — `[confirmation individual]`>"
secrets_strategy: "<vault | env vars | KMS | other>"
---
```

```markdown
# Security

## Threat model
<Per critical component (from Architecture): threats identified, using
STRIDE or an equivalent simplified approach, each with a mitigation
(SEC-XXX) or an explicit accepted risk (RISK-XXX) — never left open
without one or the other.>

## Authentication and authorization
<Mechanism and model, in detail. `[confirmation individual]`.>

## Data classification
<Every category of sensitive data this project handles, its
classification, and its required treatment.>

## Compliance
<Applicable regulatory requirements, or explicitly "none" — confirmed,
not assumed either way.>

## Secrets strategy
...

## Controls
<One subsection per SEC-XXX: what it protects (component and/or
interaction unit), what it does.>
```

## Notes for whoever fills this in

- **Every control needs `traces_to`** pointing to at least one `ARCH-XXX` or `API-XXX` — a control that doesn't protect anything named and real doesn't belong here.
- **Every classified-sensitive data category needs an associated control** — this is the gate's primary check, not a suggestion.
- **Every identified threat needs a mitigation or an explicitly accepted risk** — never left implicit. An accepted risk still gets recorded in `templates/risk-register.md`, with an owner and a status, not silently dropped.
- **Authentication/authorization must cover every `API-XXX`** from `docs/09-api-design/api.md` — an interaction unit with no stated auth treatment (including "explicitly public, no auth required") is a gap.
- `SEC-XXX` IDs come from `project-state.md`'s `id_sequences.SEC`, global to the project.
