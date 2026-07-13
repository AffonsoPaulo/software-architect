# ARCH-001 — Conversion Engine
*Traces to: REQ-002 · ADR: ADR-001*

Parses an input format into an internal representation (a stream of flat records) and serializes it to a target format. Streams rather than loading the whole file into memory, to satisfy REQ-002.
