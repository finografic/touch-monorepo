# TODO — Public Repository Cleanup

> **Goal:** Migrate this repo from a private Bitbucket project to a public GitHub portfolio piece.
> This is NOT a refactor. Every item here is about presentation, safety, and polish — removing or
> anonymising things that should not be public, cleaning up obvious developer-only clutter, and
> making the codebase legible to someone reading it for the first time.

---

## 0 · Before Anything Else — Secrets Rotation (CRITICAL)

These must be done BEFORE the repository is made public. A secret in git history
is permanently compromised even after removal — rotate first.

- [ ] **Rotate the GitHub Personal Access Token** currently hardcoded in `.env.development`
      and `.env.production`. Generate a new token in GitHub and update your local `.env`.
- [ ] **Rotate `AUTH_SECRET`** — the session-signing key in both env files. Generate a new
      32-char random value (`openssl rand -base64 32`).
- [ ] **Rotate `INLANG_GOOGLE_TRANSLATE_API_KEY`** if it appears in any committed file.
- [ ] **Audit git history** for any committed secrets. Both `.env.development` and
      `.env.production` are in `.gitignore` now, but check whether they were ever committed:
      `bash
      git log --all --full-history -- .env.development .env.production
      git log --all --full-history -- "**/.env*"`
      If found in history, use `git filter-repo` to purge them before pushing to GitHub.
      Do NOT use `git filter-branch` — it is deprecated and slow.

---

## 1 · Git Remote Migration

- [ ] Create the new public GitHub repository (`github.com/finografic/touch-monorepo` or similar)
- [ ] Update the git remote:
      `bash
      git remote set-url origin git@github.com:finografic/touch-monorepo.git`
- [ ] Update any hardcoded Bitbucket URLs in docs, comments, or config
- [ ] Search for `bitbucket.org` across the codebase:
      `bash
      grep -r "bitbucket.org" --include="*.{md,json,ts,sh}" .`

---

## 2 · Root `package.json` Cleanup

The root `package.json` has accumulated several issues worth fixing.

### Dead / disabled scripts to remove

These scripts serve no purpose in a public-facing repo and add noise:

| Script                 | Reason to remove                                                     |
| :--------------------- | :------------------------------------------------------------------- |
| `postinstall.disabled` | Disabled — just noise, not wired up                                  |
| `postinstall.no`       | Disabled, references `db.sqlite3.copy` which doesn't exist at root   |
| `md.date-tags`         | Internal markdown utility — not relevant publicly                    |
| `lint.test-react`      | Dev-only rule-testing script (`scripts/test-react-rules.ts`)         |
| `build.design-system`  | Filters `@workspace/design-system` which does not exist in this repo |
| `dev.i18n.update`      | Alias of `i18n.force` — redundant                                    |
| `scripts`              | Points to internal script runner — remove or document                |

### Changesets scripts

`change`, `version`, `release` assume a Changesets publishing workflow. This is a private
app repo, not a library. Either remove them or add a comment explaining their purpose.

### `peerDependencies` at root

Root `peerDependencies` (`eslint`, `prettier`, `react`, `typescript`) are unusual for a
private monorepo root. These are likely leftover from an older workspace setup. Remove them
unless there's an active reason.

### `author` field

Update the `url` — it currently points to `http://finografic.github.com/cv-justin-rankin`
(http, not https, and wrong subdomain format).

### `lint.fix.imports` script

Contains a hardcoded inline ESLint rule JSON string. If this is still needed, move the rule
into the ESLint config and simplify the script, or remove it.

---

## 3 · Hardcoded Credentials and Internal Details in Docs / Scripts

### `scripts/deploy-to-pi.sh`

- [ ] Remove or replace the hardcoded Pi IP `192.168.1.31` with an environment variable or
      a named constant at the top of the script with a clear placeholder
- [ ] Remove or redact the password `1234` from comments (it should be in docs only, not script comments)
- [ ] Add a usage comment at the top: what env vars or config values to set before running

### `docs/ubuntu/INSTALL.UBUNTU.md`

- [ ] Replace hardcoded `192.168.1.31` with a placeholder like `<PI_IP_ADDRESS>`
- [ ] Replace hardcoded `touch:1234` credentials with a placeholder and a note to set a
      strong password during OS setup
- [ ] Review for any other internal network details

### `docs/ubuntu/RASPBERRY_PI_NETWORK_ACCESS.md`

- [ ] Same as above — audit for hardcoded IPs and credentials
- [ ] Replace all internal IPs with `<PI_IP_ADDRESS>` placeholder pattern

### General docs sweep

- [ ] Run a search for `192.168` to catch any remaining internal IP addresses:
      `bash
      grep -r "192\.168\." --include="*.{md,sh,ts,json}" .`
- [ ] Run a search for `1234` to catch any remaining hardcoded default passwords:
      `bash
      grep -rn "\b1234\b" --include="*.{md,sh}" .`

---

## 4 · `.env.example` Audit

- [ ] Open `.env.example` and ensure every variable has a placeholder value, not a real value
- [ ] Ensure the file documents what each variable does and where to get the values
- [ ] Confirm `GITHUB_TOKEN`, `AUTH_SECRET`, and `INLANG_GOOGLE_TRANSLATE_API_KEY` are
      placeholders only, with instructions on how to obtain them

---

## 5 · Documentation Cleanup

The `docs/` directory is extensive and valuable, but some files need attention before going public.

### Outdated or internal-only files to review

| File                                               | Issue                                                                      |
| :------------------------------------------------- | :------------------------------------------------------------------------- |
| `README.md` (root)                                 | Done — rewritten as part of this cleanup                                   |
| `docs/` root: `REFACTOR-FETCH-CLIENT-SUMMARY.md`   | Likely an internal dev note — review if it adds value or remove            |
| `docs/` root: `npm+git-package.json-hooks.md`      | Internal notes on hooks — review or remove                                 |
| `docs/` root: `🚧 RELAY.DEBUGGING - 2025-09-27.md` | Debug session notes — likely internal only, remove                         |
| `docs/todo/*.md` (existing)                        | Internal TODO lists — review each for anything sensitive before publishing |
| `docs/plans/`                                      | Review for internal product roadmap details you may not want public        |
| `docs/refactors/`                                  | Internal refactor notes — review or remove                                 |

### Fix the stale project name

- [ ] Search for `iox-monorepo` (the old project name) across all docs:
      `bash
      grep -r "iox-monorepo" --include="*.md" .`
- [ ] Replace any occurrences with `touch-monorepo`

### Docs to keep and polish (they demonstrate good engineering)

These are worth keeping and potentially improving — they show architectural thinking:

- `API_ARCHITECTURE.md`
- `TIMER_AND_SESSION_SYSTEM.md`
- `FormMiddleware-System.md`
- `SMART_FALLBACK_ARCHITECTURE.md`
- `PRODUCTION_BUILD_SYSTEM.md`
- `docs/relays/` (all four files)
- `docs/i18n/`

---

## 6 · `apps/server` — Sensitive Config Review

- [ ] Review `src/config/relay.config.ts` — USB Vendor/Product IDs (`0x16c0`, `0x05df`) are
      generic USBRelay8 defaults and fine to be public, but confirm no device-specific serials
      or internal config are hardcoded
- [ ] Review `src/db/` seed data for any real personal data (names, emails, phone numbers)
      that crept into seed files during development
- [ ] Review `src/scripts/` for any internal-only debugging scripts to remove or clean up
- [ ] Check `scripts/list-hid-devices.js` — useful debugging tool, but confirm it doesn't log
      sensitive device info; add a comment explaining its purpose

---

## 7 · `apps/client` — Dev Tooling

- [ ] Review `src/dev-tools/` — confirm this is behind a `NODE_ENV !== 'production'` guard
      and won't expose anything in a production build
- [ ] Review `src/test/` setup for any hardcoded test credentials or internal API endpoints

---

## 8 · `packages/build-deployment` Cleanup

- [ ] Review `src/build-deployment.ts` for any hardcoded internal paths, hostnames, or
      credentials that crept in during development
- [ ] Confirm the script works with only env variables / CLI arguments — no hardcoded Pi IP

---

## 9 · Root-Level File Cleanup

- [ ] Remove or gitignore `data/` if it contains any real SQLite database files
      (it should already be gitignored, but confirm)
- [ ] Check for any stray `.DS_Store`, `*.log`, or IDE config files not covered by `.gitignore`
- [ ] Review `deployments/FILES/*.sh` scripts — they should work with placeholders, not
      hardcoded values; confirm no internal hostnames or tokens

---

## 10 · `package.json` `repository` Field

- [ ] Add a `repository` field (currently missing) pointing to the new GitHub URL:
      `json
      "repository": {
        "type": "git",
        "url": "git+https://github.com/finografic/touch-monorepo.git"
      }`
- [ ] Add a `homepage` field if relevant (GitHub Pages, or just the repo URL)
- [ ] Update `bugs.url` if adding the field

---

## 11 · GitHub-Specific Setup (after migration)

- [ ] Add a repository description and topics on GitHub (IoT, raspberry-pi, hono, react, typescript, etc.)
- [ ] Set up `.github/FUNDING.yml` if you want a sponsor button (optional)
- [ ] Consider adding a `LICENSE` file — currently the README says "Private — all rights reserved".
      For a portfolio repo you may want MIT or a custom licence. Decide before making public.
- [ ] Review whether to add a `CONTRIBUTING.md` — probably not needed for a portfolio piece
- [ ] Consider whether to add a GitHub Actions CI workflow (lint + typecheck) — this would
      demonstrate CI capability and show the badge in the README. Low effort, high signal.

---

## 12 · Final Pre-Publish Checklist

Run through these in order before flipping the repo to public:

- [ ] All secrets rotated (step 0)
- [ ] Git history audited and cleaned if needed (step 0)
- [ ] No real credentials in any committed file
- [ ] No internal IPs / passwords in any docs or scripts
- [ ] `git remote` pointing to GitHub (step 1)
- [ ] `pnpm install` runs cleanly from a fresh clone
- [ ] `pnpm db.reset && pnpm dev` works from a clean state
- [ ] README accurately describes the project and getting started steps
- [ ] Licence decision made
