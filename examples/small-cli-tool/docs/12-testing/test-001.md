# TEST-001 — CSV/JSON round-trip with escaping
*Traces to: REQ-001 · Level: Integration · Kind: Automated · Author: Sam*

Round-trips a CSV fixture with commas/quotes in values through CSV→JSON→CSV and asserts the result matches the original, per REQ-001's acceptance criteria and edge cases.
