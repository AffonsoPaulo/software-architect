# API Design

## Interaction style
REST, per Architecture's guidance.

## Versioning strategy
URL path versioning (`/v1/...`); breaking changes get a new version prefix.

## Failure format
JSON error body: `{ "error": { "code": string, "message": string } }`, with standard HTTP status codes.

## Interactions

| ID | Trigger | Traces to |
|---|---|---|
| [API-001](api-001.md) | `POST /v1/projects/{projectId}/tasks` | UC-001, ARCH-001 |
| [API-002](api-002.md) | `GET /v1/projects/{projectId}/tasks` | UC-002, ARCH-001 |
