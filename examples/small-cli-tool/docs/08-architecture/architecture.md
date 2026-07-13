---
components:
  - id: ARCH-001
    name: "Conversion Engine"
    responsibility: "parses an input format into an internal representation and serializes it to a target format, streaming to bound memory usage"
    traces_to: ["REQ-002"]
    adr: "ADR-001"
  - id: ARCH-002
    name: "YAML Parser Adapter"
    responsibility: "parses/serializes YAML into the same internal representation the Conversion Engine already uses for CSV/JSON (cycle 2)"
    traces_to: []
interaction_style_guidance: "CLI command surface — a single executable with subcommands/flags, not an HTTP API. No client-server boundary at all."
---

# Architecture

## Architectural style
Single-process CLI binary, no client-server split, no persistence layer — `[confirmation individual]`, confirmed given the project's small size and the constraint of "no runtime to install beyond what's already there."

## Components

### ARCH-001 — Conversion Engine
Parses an input format into an internal representation (a stream of flat records) and serializes it to a target format. Streams rather than loading the whole file into memory, to satisfy REQ-002.

### ARCH-002 — YAML Parser Adapter (cycle 2)
Parses/serializes YAML into the same internal representation ARCH-001 already uses — added without changing ARCH-001's shape, since the internal representation was already format-agnostic.

## Core technologies
Node.js (matches the target developer machines, which already have it installed) — `[confirmation individual]`.

## Non-functional requirement coverage
| REQ-XXX (NFR) | Addressed by |
|---|---|
| REQ-002 (memory bound) | ARCH-001 / ADR-001 |

## Interaction style guidance
CLI command surface — see `interaction_style_guidance` above. Phase 09 details the actual command/flags.

```mermaid
graph TD
    CLI["CLI entrypoint"] --> Engine["ARCH-001: Conversion Engine"]
    Engine --> CSV["CSV parser/serializer"]
    Engine --> JSON["JSON parser/serializer"]
    Engine --> YAML["ARCH-002: YAML Parser Adapter"]
```
