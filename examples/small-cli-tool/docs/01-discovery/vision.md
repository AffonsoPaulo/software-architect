# Vision

## Problem
Developers on this team regularly need to convert data files between CSV and JSON (and, as of cycle 2, YAML) when moving data between spreadsheet tools and scripts/config files. Today this means writing a one-off script every time, which is slow and error-prone (encoding issues, nested-object flattening handled inconsistently).

## Target audience
Developers on the team who work with data files day to day — technical users comfortable with a CLI, not a general audience.

## Current state
No existing tool for this. Ad hoc scripts are written and thrown away each time.

## Business objective
Reduce the time spent on file-format conversion from "write a script" (10-30 minutes) to "run one command" (seconds), for every team member.

## Success criteria
A team member can convert a CSV file to JSON (or back) with a single command, correctly handling nested structures and common encoding issues, without writing any code.

## Constraints
Must run as a single, dependency-free binary/script — no requirement to install a runtime beyond what's already on developer machines. No deadline; this is a quality-of-life tool.

## Out of scope
Not a general-purpose ETL tool. Not building a GUI. Not handling formats beyond CSV/JSON/YAML unless a real need arises later (which is exactly what cycle 2's YAML addition tests).
