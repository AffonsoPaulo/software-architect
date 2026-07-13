---
use_cases:
  - id: UC-001
    traces_to: ["US-001"]
    primary_actor: "developer"
    secondary_actors: []
    preconditions:
      - "The input file exists and is readable."
    postconditions:
      - "The output file exists, containing the converted data in the target format."
    main_flow:
      - "Developer runs `convert <input-file> --to <format>`."
      - "Tool detects the input format from the file extension (or an explicit --from flag)."
      - "Tool parses the input file into its internal representation."
      - "Tool serializes the internal representation into the target format."
      - "Tool writes the output file."
    alternative_flows:
      - trigger: "At step 3, the input file is malformed"
        steps:
          - "Tool prints a specific parse error (line/column if available) and exits with a non-zero status; no output file is written."
      - trigger: "At step 4, the data can't be represented in the target format (e.g. deeply nested JSON to CSV with ambiguous flattening)"
        steps:
          - "Tool prints an error naming the specific structure that couldn't be converted and exits non-zero; no output file is written."
  - id: UC-002
    traces_to: ["US-002"]
    primary_actor: "developer"
    secondary_actors: []
    preconditions:
      - "The input file exists and is readable."
    postconditions:
      - "The output file exists, containing the converted data in the target format."
    main_flow:
      - "Developer runs `convert <input-file> --to <format>` where input or target format is YAML."
      - "Tool parses YAML into the same internal representation used for CSV/JSON."
      - "Tool serializes to the target format."
      - "Tool writes the output file."
    alternative_flows:
      - trigger: "At step 2, the YAML uses an unsupported feature (anchors, multi-document)"
        steps:
          - "Tool prints an error naming the specific unsupported feature and exits non-zero; no output file is written."
---

# Use Cases

## UC-001 — Convert file between CSV and JSON
**Traces to**: US-001
**Primary actor**: developer

**Preconditions**:
- The input file exists and is readable.

**Main flow**:
1. Developer runs `convert <input-file> --to <format>`.
2. Tool detects the input format from the file extension (or an explicit `--from` flag).
3. Tool parses the input file into its internal representation.
4. Tool serializes the internal representation into the target format.
5. Tool writes the output file.

**Alternative/exception flows**:
- At step 3, if the input file is malformed: print a specific parse error and exit non-zero; no output file written.
- At step 4, if the data can't be represented in the target format: print an error naming the structure and exit non-zero; no output file written.

**Postconditions**:
- The output file exists, containing the converted data in the target format.

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CLI as convert CLI
    Dev->>CLI: convert input.csv --to json
    CLI->>CLI: detect format, parse input
    alt parse succeeds
        CLI->>CLI: serialize to JSON
        CLI-->>Dev: write output.json, exit 0
    else parse fails
        CLI-->>Dev: print error, exit non-zero
    end
```

## UC-002 — Convert file involving YAML (cycle 2)
**Traces to**: US-002
**Primary actor**: developer

**Preconditions**:
- The input file exists and is readable.

**Main flow**:
1. Developer runs `convert <input-file> --to <format>` where input or target format is YAML.
2. Tool parses YAML into the same internal representation used for CSV/JSON.
3. Tool serializes to the target format.
4. Tool writes the output file.

**Alternative/exception flows**:
- At step 2, if the YAML uses an unsupported feature: print an error naming the feature and exit non-zero; no output file written.

**Postconditions**:
- The output file exists, containing the converted data in the target format.
