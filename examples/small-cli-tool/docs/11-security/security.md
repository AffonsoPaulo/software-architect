---
controls:
  - id: SEC-001
    traces_to: ["ARCH-001", "API-001"]
    description: "The tool only ever reads the input file and writes the output file explicitly named by the user — no network access, no reading of unrelated files, no execution of file contents."
threat_model:
  - component: "ARCH-001"
    threats:
      - category: "Tampering"
        description: "A malicious input file could attempt path traversal via crafted content if the tool ever interpreted file contents as paths."
        mitigation: "SEC-001"
data_classification:
  - data: "Contents of user-supplied input/output files"
    classification: "none"
    handling: "Not inspected or classified by the tool — it's a format converter, not a data store; whatever sensitivity the input data has is the user's responsibility, same as any other file processed locally."
authentication:
  mechanism: "none — local CLI tool, no authentication surface"
authorization:
  model: "none — relies entirely on the operating system's file permissions"
compliance:
  - "none"
secrets_strategy: "not applicable — the tool has no secrets or credentials"
---

# Security

## Threat model
### ARCH-001 — Conversion Engine
- **Tampering**: a malicious input file could attempt path traversal if file contents were ever interpreted as paths. Mitigated by SEC-001 (the tool never treats file contents as paths — only the CLI arguments are).

## Authentication and authorization
No authentication mechanism — this is a local CLI tool with no network surface. Authorization is entirely delegated to the operating system's file permissions on the input/output paths — `[confirmation individual]`, confirmed given the tool's local-only scope.

## Data classification
Input/output file contents are not classified or inspected by the tool — see table above.

## Compliance
None applicable — `[confirmation individual]`, confirmed: no PII, no regulated data category, purely a local format converter.

## Secrets strategy
Not applicable.

## Controls

### SEC-001
Protects: ARCH-001, API-001 (and by extension API-002, which reuses the same file-handling path).
The tool only ever reads the explicitly named input file and writes the explicitly named output file — no network access, no reading of unrelated files, no execution of file contents. This is the auth/authz statement required for every `API-XXX`: **API-001 and API-002 are both "public, no auth" by design** — there is no user/session concept in a local CLI tool.
