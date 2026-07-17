# Security

## Threat model

### ARCH-001 — Conversion Engine
| Threat | Category | Mitigation |
|---|---|---|
| A malicious input file could attempt path traversal via crafted content if the tool ever interpreted file contents as paths | Tampering | SEC-001 |

## Authentication and authorization
No authentication mechanism — this is a local CLI tool with no network surface. Authorization is entirely delegated to the operating system's file permissions on the input/output paths — `[confirmation individual]`, confirmed given the tool's local-only scope.

## Data classification
| Data | Classification | Handling |
|---|---|---|
| Contents of user-supplied input/output files | None | Not inspected or classified by the tool — it's a format converter, not a data store; whatever sensitivity the input data has is the user's responsibility, same as any other file processed locally. |

## Compliance
None applicable — `[confirmation individual]`, confirmed: no PII, no regulated data category, purely a local format converter.

## Secrets strategy
Not applicable — the tool has no secrets or credentials.

## Controls

| ID | Title | Traces to |
|---|---|---|
| [SEC-001](sec-001.md) | File access restricted to explicit CLI arguments | ARCH-001, API-001, API-002 |
