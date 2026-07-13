---
interaction_style: "CLI command surface"
versioning_strategy: "Semantic versioning on the package itself; no per-command versioning needed for a single-binary CLI."
failure_format: "Non-zero exit code, human-readable error message on stderr naming the specific problem. No output file is written on failure."
interactions:
  - id: API-001
    traces_to: ["UC-001", "ARCH-001"]
    trigger: "convert <input-file> --to <format> [--from <format>] [--output <path>]"
    input:
      description: "input-file: path to an existing, readable file. --to: target format (csv|json). --from: optional, inferred from extension if omitted. --output: optional, defaults to input filename with the target extension."
    effect_or_output:
      description: "Writes the converted file to the output path and exits 0. Prints a one-line success summary to stdout (input format, output format, record count)."
    failure_modes:
      - condition: "Input file doesn't exist or isn't readable"
        result: "Exit 1, stderr: 'cannot read <path>: <reason>'"
      - condition: "Input file is malformed for its detected/declared format"
        result: "Exit 2, stderr: parse error with line/column if available"
      - condition: "Data can't be represented in the target format"
        result: "Exit 3, stderr: names the specific structure that couldn't convert"
  - id: API-002
    traces_to: ["UC-002", "ARCH-002"]
    trigger: "convert <input-file> --to yaml, or convert <input-file>.yaml --to <format> (cycle 2 — extends API-001's --to/--from options with 'yaml')"
    input:
      description: "Same shape as API-001; --to/--from now also accept 'yaml'."
    effect_or_output:
      description: "Same as API-001, for the YAML direction."
    failure_modes:
      - condition: "YAML uses an unsupported feature (anchors, multi-document)"
        result: "Exit 4, stderr: names the specific unsupported feature"
---

# API Design

## Interaction style
CLI command surface, per Architecture's guidance — a single `convert` command with flags, no separate contract format needed since there's no network boundary.

## Versioning strategy
Semantic versioning on the package itself.

## Failure format
Non-zero exit code + a specific stderr message. No output file written on any failure path.

## Interactions

### API-001 — `convert` command (CSV/JSON)
**Trigger**: `convert <input-file> --to <format> [--from <format>] [--output <path>]`
**Traces to**: UC-001, ARCH-001

### API-002 — `convert` command, YAML option (cycle 2)
**Trigger**: `convert <input-file> --to yaml` (extends API-001's format options, doesn't introduce a new command)
**Traces to**: UC-002, ARCH-002

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CLI as convert command
    participant Engine as ARCH-001
    Dev->>CLI: convert data.csv --to json
    CLI->>Engine: parse(data.csv, "csv")
    Engine-->>CLI: internal representation
    CLI->>Engine: serialize(repr, "json")
    Engine-->>CLI: JSON bytes
    CLI-->>Dev: write data.json, exit 0
```
