# TODO: Migrate touch-monorepo client (and workspace peers) to React 19

**Status:** Planning
**Last scanned:** 2026-04-20 (`apps/client` + workspace packages that declare `react`)

This document is the **single checklist** for upgrading from **React 18.3** to **React 19**. Execute phases in order; do not bump `@types/react` on the client without bumping runtime `react` / `react-dom` in the same change set (avoids the `ReactNode` / `bigint` TS split-brain you hit with a React-19-typed design system on React 18).

---

## 1. Scan summary (facts)

### 1.1 `apps/client` footprint

| Metric                         | Value                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `src/**/*.tsx` files           | ~212                                                                                                                     |
| Entry API                      | `ReactDOM.createRoot` in `main.tsx` (no legacy `render`)                                                                 |
| `React.FC` / `: FC<` usage     | Widespread (~120+ files); not deprecated in 19 but keep in mind implicit `children` typing changes when tightening types |
| Legacy APIs searched           | No `defaultProps` on function components, `findDOMNode`, `createFactory`, `ReactDOM.render` in `src`                     |
| `cloneElement`                 | **1** use: `admin/AdminDashboardPage.tsx` (clone icon node for cards) — retest visually after upgrade                    |
| Component tests (`*.test.tsx`) | **1** under `src`: `ThemeToggleButton.test.tsx`; other tests are `utils` `.ts`                                           |

### 1.2 Stack that must stay compatible with React 19

| Area           | Package / config                                                   | Notes                                                                                                                                                |
| -------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bundler        | `vite@^7`, `@vitejs/plugin-react@5`                                | Modern; expect OK. Emotion Babel still configured in `vite.config.ts`.                                                                               |
| Routing        | `react-router-dom@7.13`                                            | RR7 targets current React; verify release notes when bumping patch.                                                                                  |
| Server state   | `@tanstack/react-query@^5.90`                                      | OK on 19; root `pnpm.overrides` pins query — update overrides if you bump the package.                                                               |
| Forms          | `react-hook-form@7.71`, `@hookform/resolvers`                      | Check RHF release notes for explicit 19 support line.                                                                                                |
| UI (3rd party) | `primereact@10.9.7`                                                | **Highest risk:** confirm peer `react` range on npm before merge; only **6** import sites in `src` but PrimeReact touches a lot at runtime.          |
| UI (DS)        | `@finografic/design-system` (often `link:`)                        | **Must** use a build whose `peerDependencies` and published types target React **19** (or you stay on 18 types — the mismatch caused TS2786 before). |
| Headless       | `@ark-ui/react@^5.34`                                              | Generally aligned with modern React; bump with DS if needed.                                                                                         |
| Styling        | `@emotion/react@11.14`, Panda `jsxFramework: 'react'`              | Emotion 11 + React 19 is common; run smoke tests on styled routes and Panda `css` prop.                                                              |
| JSON debug UI  | `react-json-tree@0.20`                                             | Older; smoke-test any screen that renders it.                                                                                                        |
| Errors         | `react-error-boundary@6.1`                                         | Check changelog for 19; usually fine.                                                                                                                |
| i18n           | `react-i18next@16.5`                                               | Verify peer range for 19.                                                                                                                            |
| Icons          | `lucide-react@^0.564`                                              | Usually OK; typecheck after bump.                                                                                                                    |
| Lint           | `eslint-plugin-react-hooks@^7`, `@eslint-react/eslint-plugin@2.13` | After upgrade, run `pnpm lint.client` and fix any new hook rules.                                                                                    |

### 1.3 Monorepo pins (must move together)

| Location                                 | What blocks a partial bump                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Root `package.json` → `pnpm.overrides`   | `react` and `react-dom` pinned to `^18.3.1` — **update to 19** when migrating.                                               |
| Root `package.json` → `peerDependencies` | `react: ^18.3.1` — bump to `^19.x` (or whatever policy you choose).                                                          |
| `packages/core/package.json`             | `react` + `@types/react` / `@types/react-dom` on **18** — bump with client or `workspace:*` resolution will fight overrides. |
| `packages/icons/package.json`            | `peerDependencies.react` + dev `react-dom` **18** — bump for consistency.                                                    |
| `syncpack` / `update-deps` flows         | After edits, run `pnpm syncpack.fix` (or your usual `reset.sync`) so all workspaces agree.                                   |

### 1.4 TypeScript / types

- Bump **`@types/react`** and **`@types/react-dom`** to the **19** line in every package that typechecks JSX (`apps/client`, `packages/core`, `packages/icons`, any other workspace package with `@types/react` in devDependencies).
- Goal: **one** effective `@types/react` version in the install graph (pnpm dedupe / overrides if a dependency pulls an older copy).

### 1.5 Design system alignment (critical)

- **Published** `@finografic/design-system` must declare compatible `peerDependencies` for React **19** and ship types generated against `@types/react@19` (or ship **no** bundled `@types/react` in its own `node_modules` tarball — ideal).
- **`panda.config.ts`** in client includes `node_modules/@finografic/design-system/src/**/*.tsx` when present; published tarballs may omit `src` — confirm Panda still emits all slot CSS needed (you previously fixed dialog styling via `dialog-V2.css` / local DS builds).

---

## 2. Phased execution plan

### Phase A — Preconditions (no version bump yet)

- [ ] **A1.** Choose target DS version: published tag that supports React **19**, or finish local DS on 19 and publish / `link:`.
- [ ] **A2.** Read PrimeReact 10.x release notes / peer deps for React 19; note minimum version if upgrade required.
- [ ] **A3.** Read `react-hook-form`, `react-i18next`, `react-json-tree`, `react-error-boundary` compatibility notes for React 19.
- [ ] **A4.** Optional: enable `typescript-eslint` / strict JSX checks on a branch to surface `ReactNode` issues before the bump.

### Phase B — Monorepo dependency bump (single PR recommended)

- [ ] **B1.** Update root `pnpm.overrides`: `react`, `react-dom` → `^19.x` (match chosen minors).
- [ ] **B2.** Update root `peerDependencies.react` to the same range.
- [ ] **B3.** Update `apps/client/package.json`: `react`, `react-dom`, `@types/react`, `@types/react-dom`.
- [ ] **B4.** Update `packages/core` and `packages/icons` `react` / types to match.
- [ ] **B5.** Run `pnpm install` from repo root.
- [ ] **B6.** Run `pnpm syncpack.fix` (or project equivalent) and resolve any intentional mismatches in `syncpack` config.

### Phase C — Client verification

- [ ] **C1.** `pnpm --filter @workspace/client typecheck` — fix TS errors (expect DS-related fixes first if DS/types still mixed).
- [ ] **C2.** `pnpm --filter @workspace/client lint` — address new `react-hooks` / `@eslint-react` findings.
- [ ] **C3.** `pnpm --filter @workspace/client test.all` — Vitest + `ThemeToggleButton` RTL test.
- [ ] **C4.** `pnpm --filter @workspace/client build` — production client build.
- [ ] **C5.** Manual smoke (touch + admin): routing, auth dialogs, PrimeReact selects, Emotion layouts, TanStack Query mutations, sound + image upload pages, language dialog.

### Phase D — Follow-ups (post-green build)

- [ ] **D1.** Revisit `React.FC` usage: optional refactor to plain function components + explicit props (not required by React 19, but improves `children` typing).
- [ ] **D2.** `AdminDashboardPage` `cloneElement`: consider replacing with explicit render prop or stable icon component to reduce fragility.
- [ ] **D3.** Document final React / types versions in internal README or release notes if you ship to Pi / production images.

---

## 3. Risk register (short)

| Risk                                                 | Mitigation                                                                    |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| PrimeReact peer or runtime incompatibility with 19   | Check peers first; bump PrimeReact or isolate failing screens.                |
| Duplicate `@types/react` (bigint `ReactNode` errors) | Align overrides + bump all workspace `@types/react` together; one DS version. |
| Emotion + Vite `jsxImportSource`                     | Full build + HMR smoke after bump.                                            |
| `react-json-tree` stale                              | Replace or upgrade if broken.                                                 |

---

## 4. Done criteria

- [ ] Single React **19** runtime across client + workspace packages; no TS2786 from mixed `ReactNode` definitions.
- [ ] `typecheck`, `lint`, `test.all`, and `build` pass for `@workspace/client`.
- [ ] Core admin + main pad flows manually verified on target hardware (or LAN dev URL with `0.0.0.0` + HMR if applicable).

---

## 5. References (official)

- React 19 upgrade guide: `https://react.dev/blog/2024/04/25/react-19-upgrade-guide`
- React 19 release notes: `https://react.dev/blog/2024/12/05/react-19`
