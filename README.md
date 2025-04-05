# iox-monorepo

**Basic React boilerplate app built with:**

- React
- Typescript React
- Emotion CSS-in-JS
- ESLint

---

## Development Setup

This project requires a GitHub Personal Access Token for installing PRIVATE packages.

1. Ensure to add `GITHUB_TOKEN` to local `.env` file:

```sh
# .env
GITHUB_TOKEN=your_token_here
```

2. The `.npmrc` file, with `load-dot-env=true` set (important!) will allow packages
with the `@finografic` scope, to install / update directly from the private GitHub packages registry.

```sh
# .npmrc
use-node-version=20.18.2
save-prefix=""
strict-peer-dependencies=false
link-workspace-packages=false
save-workspace-protocol=rolling
ignore-workspace-root-check=true

# GITHUB PACKAGES REGISTRY via .ENV TOKEN
load-dot-env=true
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@finografic:registry=https://npm.pkg.github.com
```


## get started

```sh
# If starting fresh:
1. Delete the database file (data/development.sqlite.db)
2. pnpm --filter @touch/server db:generate  # Generate migration files
3. pnpm --filter @touch/server db:migrate   # Run migrations

# OR for development:
Just use db:push which will update the schema directly:
pnpm --filter @touch/server db:push
```

---

```sh
# Safest approach
pnpm reset
pnpm build:db
pnpm build:db:migrate
pnpm dev
```

```sh
open http://localhost:3000
```
