---
state_management: "React Query for server state (task lists, project data); component-local state for form/UI-only concerns — `[confirmation individual]`."
design_system: "New — no existing design system to reuse; will build a small internal component library starting with this project — `[confirmation individual]`."
target_platforms: ["web"]
screens:
  - id: "screen-task-board"
    traces_to: ["UC-002"]
    name: "Task Board"
    api_calls: ["API-002"]
  - id: "screen-task-create"
    traces_to: ["UC-001"]
    name: "Create Task"
    api_calls: ["API-001"]
---

# Frontend Planning

## State management
React Query for server state, component-local state for UI-only concerns — `[confirmation individual]`.

## Design system
No existing design system — building a small internal component library starting with this project — `[confirmation individual]`.

## Target platforms
Web only for this release.

## Screens

### screen-task-board
Traces to UC-002. Calls API-002. Shows the filterable task list for a project.

### screen-task-create
Traces to UC-001. Calls API-001. A form/modal for creating a task, reachable from the Task Board.

## Navigation

```mermaid
flowchart TD
    Board["Task Board (screen-task-board)"] -->|"New Task"| Create["Create Task (screen-task-create)"]
    Create -->|"Save"| Board
```
