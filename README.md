# iox-monorepo

📅 Apr 5, 2025

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

## Docker Setup

1. Ensure you have Docker and Docker Compose installed
2. Create a `.env` file with your GitHub token:

```sh
GITHUB_TOKEN=your_github_token_here
```

3. Build and run with Docker Compose:

```sh
# Build the containers
docker-compose build

# Start the services
docker-compose up

# Or run in detached mode
docker-compose up -d
```

The application will be available at:
- Client: <http://localhost:3000>
- API: <http://localhost:4040>

## Local Development Setup

```sh
# If starting fresh:
1. Delete the database file (data/development.sqlite.db)
2. pnpm --filter @workspace/server db:generate  # Generate migration files
3. pnpm --filter @workspace/server db:migrate   # Run migrations

# OR for development:
Just use db:push which will update the schema directly:
pnpm --filter @workspace/server db:push
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
