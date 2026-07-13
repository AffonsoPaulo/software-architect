# API Design

## Interaction style
CLI command surface, per Architecture's guidance — a single `convert` command with flags, no separate contract format needed since there's no network boundary.

## Versioning strategy
Semantic versioning on the package itself; no per-command versioning needed for a single-binary CLI.

## Failure format
Non-zero exit code, human-readable error message on stderr naming the specific problem. No output file is written on failure.

## Interactions

| ID | Trigger | Traces to |
|---|---|---|
| [API-001](api-001.md) | `convert` command (CSV/JSON) | UC-001, ARCH-001 |
| [API-002](api-002.md) | `convert` command, YAML option (cycle 2) | UC-002, ARCH-002 |
