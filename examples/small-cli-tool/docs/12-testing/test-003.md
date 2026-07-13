# TEST-003 — YAML round-trip and unsupported-feature error (cycle 2)
*Traces to: REQ-003 · Level: Integration · Kind: Automated · Author: Jordan*

Round-trips a YAML fixture through YAML→JSON→YAML and asserts equivalence; separately asserts that a YAML fixture using anchors fails with the documented specific error rather than silently mis-converting.
