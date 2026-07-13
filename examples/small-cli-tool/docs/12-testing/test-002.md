# TEST-002 — Memory bound on large files
*Traces to: REQ-002 · Level: Integration · Kind: Automated*

Converts a generated 100MB CSV fixture to JSON, asserting peak memory stays under 512MB (measured via `process.memoryUsage()` sampling) and the process completes successfully.
