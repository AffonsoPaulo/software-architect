# Security — Template

Saved at `docs/11-security/` in the target project (see `rules/document-locations.md`). Produced by `playbooks/11-security.md`. Models threats, defines authentication/authorization in detail, classifies data, and records compliance requirements — always mandatory, regardless of project size or cycle.

This category splits into an **index file** (`security.md`) and one **item file** per control (`sec-001.md`, `sec-002.md`, ...) — see `rules/document-locations.md`. The Risk Register (`risk-register.md`) is its own, separately-splitting category — see below.

## Index file — `security.md`

```markdown
# Security

## Threat model
<Per critical component (from Architecture): threats identified, using
STRIDE or an equivalent simplified approach, each with a mitigation
(SEC-XXX) or an explicit accepted risk (RISK-XXX) — never left open
without one or the other.>

### ARCH-003 — <component name>
| Threat | Category | Mitigation |
|---|---|---|
| <concrete threat> | <STRIDE category or equivalent> | SEC-001 or RISK-XXX |

## Authentication and authorization
**Mechanism**: password / OAuth / SSO / magic link / other —
`[confirmation individual]`
**Model**: RBAC / ABAC / other — `[confirmation individual]`

## Data classification
| Data | Classification | Handling |
|---|---|---|
| Customer payment method | Financial | Encrypted at rest, access
  restricted to billing service |

## Compliance
<LGPD / GDPR / PCI-DSS / HIPAA / none / other — `[confirmation individual]`,
confirmed, not assumed either way.>

## Secrets strategy
<Vault / env vars / KMS / other.>

## Controls
| ID | Title | Traces to |
|---|---|---|
| [SEC-001](sec-001.md) | <short title> | ARCH-003, API-001 |
```

## Item file — `sec-001.md`

```markdown
# SEC-001 — <short title>
*Traces to: ARCH-003, API-001*

<The control, stated as a concrete measure — e.g. "all refund
interaction units require an authenticated session with the customer or
support role.">
```

## Fully Dressed additions

The index file's threat model gains a full STRIDE pass per component, plus:

```markdown
## Threat model
<Full STRIDE pass, not just an illustrative example — every critical
component gets all six categories considered explicitly, even when the
answer for a category is "not applicable to this component.">

### ARCH-003 — <component name>
| Threat | STRIDE category | Mitigation |
|---|---|---|
| ... | Spoofing | ... |
| ... | Tampering | ... |
| ... | Repudiation | ... |
| ... | Information disclosure | ... |
| ... | Denial of service | ... |
| ... | Elevation of privilege | ... |

## Data flow diagram
<A diagram showing data moving between components/actors with explicit
trust boundaries marked — where data crosses from a lower-trust zone
(public internet, third-party) into a higher-trust one (internal
network, database). This is what a full STRIDE pass is actually
evaluated against.>

```mermaid
flowchart TD
    ...
```

## Incident response plan
<Who's notified and what happens when a security incident is detected
— detection, containment, eradication, recovery, post-mortem, at
whatever level of detail this project's size warrants. Points to an
existing org-wide plan if one already exists, rather than inventing a
project-specific one from scratch.>

## Security testing plan
<How the controls above get verified before release — static analysis,
dependency scanning, penetration testing, specific manual review
checklist. Distinct from `docs/12-testing/testing.md`'s general test
plan — this is security-specific verification.>

## Compliance control mapping
<For each compliance regime named above, the SPECIFIC articles/controls
this project must satisfy and which SEC-XXX/control addresses each —
not just "we comply with GDPR" but "GDPR Art. 17 (right to erasure) →
SEC-004.">

| Regime | Article/control | Addressed by |
|---|---|---|
| ... | ... | SEC-XXX |
```

## Notes for whoever fills this in

- **Every control needs `traces_to`** pointing to at least one `ARCH-XXX` or `API-XXX` — a control that doesn't protect anything named and real doesn't belong here.
- **Every classified-sensitive data category needs an associated control** — this is the gate's primary check, not a suggestion.
- **Every identified threat needs a mitigation or an explicitly accepted risk** — never left implicit. An accepted risk still gets recorded in `templates/risk-register.md`, with an owner and a status, not silently dropped.
- **Authentication/authorization must cover every `API-XXX`** from `docs/09-api-design/api.md` — an interaction unit with no stated auth treatment (including "explicitly public, no auth required") is a gap.
- `SEC-XXX` IDs come from `project-state.md`'s `id_sequences.SEC`, global to the project.
