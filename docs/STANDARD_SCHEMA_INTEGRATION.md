# Standard Schema (Valibot + forms)

📅 Updated Apr 2026

## Overview

[Standard Schema](https://github.com/standard-schema/standard-schema) is a small, library-agnostic interface for validation. This repo uses **Valibot** for schemas and **`standardSchemaResolver`** from `@hookform/resolvers/standard-schema` for React Hook Form, so forms do not depend on a specific validator’s API beyond that interface.

Auth is **Auth.js** (`@hono/auth-js`); it is unrelated to Standard Schema but sits alongside this stack.

## Current pattern (simplified)

- **Server:** Valibot schemas (e.g. `drizzle-valibot`, `hono-openapi` + `validator`).
- **Client forms:** Valibot schema → optional `@standard-schema/valibot` adapter if you need a Standard Schema object for the resolver → `standardSchemaResolver(...)`.

## Resources

- Standard Schema — [github.com/standard-schema/standard-schema](https://github.com/standard-schema/standard-schema)
- Valibot — [valibot.dev](https://valibot.dev/)
- React Hook Form — `@hookform/resolvers/standard-schema`

## Related

- `TODO_VALIDATION.P2.md` — validation and API-contract notes
