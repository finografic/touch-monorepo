# Monorepo maintenance and backlog

Lower priority: tooling, published packages, and cross-cutting refactors that are not blocking product work.

---

## `@finografic/project-scripts` workspace vs npm

**Situation:** The repo lists `scripts` in `pnpm-workspace.yaml`, so the local `scripts/` tree can shadow the published `@finografic/project-scripts` package. That can cause duplicate maintenance and confusing resolution.

**Optional cleanup (when you have time):**

1. Publish any changes you need from `scripts/` to npm.
2. Remove `scripts` from `pnpm-workspace.yaml`.
3. Depend on the published version from root / consumers.
4. Remove the in-repo `scripts/` folder if it is no longer the source of truth.

**Note:** Deprecated `source-map@0.8.0-beta.0` warnings from `tsup` are upstream; cosmetic only unless you choose a different bundler.

---

## Client API layer

Roughly **30+** manual React Query hooks and overlapping endpoint helpers (`EndpointHelper`, `FetchEndpointHelper`, `api/endpoints/`) still exist. Consolidation is **not** blocking feature work.

**Detail and task list:** `docs/endpoints/TODO.ENDPOINTS.md`.

---

## TypeScript strictness / CI

If strict `tsc` or CI lists many errors unrelated to a single feature, treat them as a dedicated “debt” pass (fix `ColumnDef` mismatches, missing exports, etc.) rather than mixing into feature PRs.

---

## Related docs

| Doc | Topic |
| --- | --- |
| `docs/PERFORMANCE.md` | Performance notes |
| `docs/endpoints/TODO.ENDPOINTS.md` | Endpoint + query hook consolidation |
