# TODO — Public Repository Cleanup

> **Goal:** Present this repo as a public GitHub portfolio piece (not a refactor).
> Status tracked here; most automated cleanup is done — see **Remaining (manual)** below.

---

## 0 · Before Anything Else — Secrets Rotation (CRITICAL)

> **You must do these locally.** Secrets in git history stay compromised until rotated and history is purged.

- [ ] **Rotate the GitHub Personal Access Token** if one was ever committed (check history below).
- [ ] **Rotate `AUTH_SECRET`** — `openssl rand -base64 32`, update local `.env.development` / `.env.production`.
- [ ] **Rotate `INLANG_GOOGLE_TRANSLATE_API_KEY`** if it was ever committed.
- [ ] **Audit git history** (`.env` files were removed from HEAD but may exist in old commits):
      ```bash
      git log --all --full-history -- .env.development .env.production
      ```
      If found, purge with `git filter-repo` before treating the repo as clean for portfolio use.

---

## 1 · Git Remote Migration

- [x] Create the public GitHub repository (`github.com/finografic/touch-monorepo`)
- [x] `origin` points at GitHub (Bitbucket remote removed from this clone)
- [x] No `bitbucket.org` references in committed source (only this checklist mentioned it)

---

## 2 · Root `package.json` Cleanup

- [x] Removed dead scripts: `postinstall.disabled`, `postinstall.no`, `md.date-tags`, `lint.test-react`, `build.design-system`, `dev.i18n.update`, root `scripts`
- [x] Removed Changesets publish scripts and `@changesets/cli` devDependency
- [x] Removed root `peerDependencies`
- [x] Fixed `author.url` → `https://github.com/finografic`
- [x] Removed redundant `lint.fix.imports` (import sort lives in ESLint config / `lint.imports` on client)

---

## 3 · Hardcoded Credentials and Internal Details in Docs / Scripts

- [x] `scripts/deploy-to-pi.sh` — `PI_HOST` / `PI_USER` env vars, no hardcoded password in comments
- [x] `docs/ubuntu/INSTALL.UBUNTU.md` — placeholders for IP / credentials
- [x] `docs/ubuntu/RASPBERRY_PI_NETWORK_ACCESS.md` — placeholders for IP / credentials
- [x] `scripts/ubuntu/05-configure-static-ip.sh` — `STATIC_IP` env var (default example only)
- [x] `packages/build-deployment/README.md` — generic `<PI_IP_ADDRESS>` example

---

## 4 · `.env.example` Audit

- [x] Placeholder values only
- [x] Section comments for `GITHUB_TOKEN`, `AUTH_SECRET`, `INLANG_GOOGLE_TRANSLATE_API_KEY`

---

## 5 · Documentation Cleanup

- [x] Root `README.md` rewritten for portfolio
- [x] Removed internal-only docs (refactor summaries, relay debug session, internal `docs/todo/*` except this file)
- [x] No `iox-monorepo` references in the codebase

### Kept (architecture / engineering signal)

- `API_ARCHITECTURE.md`, `TIMER_AND_SESSION_SYSTEM.md`, `FormMiddleware-System.md`, `SMART_FALLBACK_ARCHITECTURE.md`, `PRODUCTION_BUILD_SYSTEM.md`
- `docs/relays/`, `docs/i18n/`, `docs/auth/`, `docs/ubuntu/`

---

## 6 · `apps/server` — Sensitive Config Review

- [x] `relay.config.ts` — generic USBRelay8 vendor/product IDs from env only
- [x] No internal IPs in server source
- [x] `scripts/list-hid-devices.js` — purpose documented; prints device metadata only
- [x] Admin check scripts use `admin@example.com` (seed placeholder)

---

## 7 · `apps/client` — Dev Tooling

- [x] `DevProvider` returns children only in production (`import.meta.env.PROD`)
- [x] `DevScreenSize` already no-ops in production

---

## 8 · `packages/build-deployment` Cleanup

- [x] No hardcoded Pi IPs or credentials in `src/`
- [x] README uses placeholder IP examples

---

## 9 · Root-Level File Cleanup

- [x] `*.db` / `*.sqlite*` gitignored; `data/` paths ignored
- [ ] Optional: run `find . -name '.DS_Store'` and delete any tracked stray files if found

---

## 10 · `package.json` Metadata

- [x] `repository`, `homepage`, `bugs` fields added
- [x] `LICENSE` (MIT) added; README license section updated

---

## 11 · GitHub-Specific Setup (after migration)

- [ ] Add repository description and topics on GitHub (IoT, raspberry-pi, hono, react, typescript, …)
- [ ] Optional: `.github/FUNDING.yml`
- [x] `LICENSE` file (MIT)
- [ ] Optional: GitHub Actions CI (lint + typecheck) for README badge

---

## 12 · Final Pre-Publish Checklist

- [ ] All secrets rotated (step 0)
- [ ] Git history purged if `.env` files were ever committed (step 0)
- [x] No real credentials in current tree
- [x] No internal IPs / passwords in docs or deploy scripts
- [x] `git remote` → GitHub
- [ ] `pnpm install` from fresh clone (verify locally)
- [ ] `pnpm db.reset && pnpm dev` from clean state (verify locally)
- [x] README describes project and getting started
- [x] Licence decision (MIT)

---

## Branch cleanup (optional)

Temporary script: `scripts/tmp-delete-branches-except-master.sh` — run to keep only `master` on GitHub, then delete the script.
