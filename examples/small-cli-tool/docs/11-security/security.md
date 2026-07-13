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

### SEC-001 — File access restricted to explicit CLI arguments
*Traces to: ARCH-001, API-001*

The tool only ever reads the explicitly named input file and writes the explicitly named output file — no network access, no reading of unrelated files, no execution of file contents. This is the auth/authz statement required for every `API-XXX`: **API-001 and API-002 are both "public, no auth" by design** — there is no user/session concept in a local CLI tool. Protects ARCH-001 and, by extension, API-002 (which reuses the same file-handling path).
