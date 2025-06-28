#!/bin/bash
# Dependency upgrade script with exclusions

echo "🚀 Starting selective dependency upgrades..."

# First, let's upgrade the safe ones (patch/minor versions)
echo "📦 Upgrading safe packages..."
pnpm update --recursive \
  @emotion/styled \
  @inquirer/confirm \
  @inquirer/core \
  @inquirer/input \
  @tailwindcss/vite \
  autoprefixer \
  postcss-import \
  postcss-nesting \
  react-hook-form \
  styled-components \
  syncpack \
  tailwindcss \
  @bugsnag/cuid \
  @changesets/cli \
  @dotenvx/dotenvx \
  @eslint-react/eslint-plugin \
  @eslint/js \
  @hono/node-server \
  @inquirer/prompts \
  @microsoft/api-extractor \
  @react-router/dev \
  @tanstack/eslint-plugin-query \
  @tanstack/query-sync-storage-persister \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  @tanstack/react-query-persist-client \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  @vitejs/plugin-react \
  @vitejs/plugin-react-swc \
  axios \
  better-auth \
  chalk \
  eslint \
  eslint-plugin-import \
  eslint-plugin-jsonc \
  eslint-plugin-prettier \
  globals \
  hono \
  i18next-browser-languagedetector \
  lightningcss \
  mermaid \
  pino \
  pino-http \
  prettier \
  react-i18next \
  react-router-dom \
  tailwind-merge \
  tsup \
  tsx \
  type-fest \
  typescript-eslint \
  uuid

echo "⚠️  Upgrading uncertain packages (test carefully)..."
pnpm update --recursive node-gyp vitest

echo "🚨 Major version upgrades (test thoroughly)..."
pnpm update --recursive @hookform/resolvers
pnpm update --recursive ansis
pnpm update --recursive eslint-config-prettier
pnpm update --recursive i18next
pnpm update --recursive lint-staged
pnpm update --recursive react-error-boundary
pnpm update --recursive tailwind-scrollbar-hide
pnpm update --recursive yargs
pnpm update --recursive zustand
pnpm update --recursive @hono/zod-openapi
pnpm update --recursive @hono/zod-validator
pnpm update --recursive @scalar/hono-api-reference
pnpm update --recursive better-call
pnpm update --recursive drizzle-kit
pnpm update --recursive drizzle-orm
pnpm update --recursive drizzle-zod
pnpm update --recursive eslint-plugin-format
pnpm update --recursive hono-pino
pnpm update --recursive lucide-react
pnpm update --recursive shx
pnpm update --recursive vite-plugin-checker

# # Handle better-sqlite3 separately (major version jump)
# echo "🔍 Checking better-sqlite3 upgrade..."
# echo "Current: better-sqlite3@9.2.2 → Latest: 12.1.1"
# echo "This is a MAJOR upgrade - test database functionality carefully!"
# read -p "Upgrade better-sqlite3? (y/N): " -n 1 -r
# echo
# if [[ $REPLY =~ ^[Yy]$ ]]; then
#     pnpm update --recursive better-sqlite3
# fi

# # Handle Vite 7 separately (major version)
# echo "🔍 Checking Vite 7 upgrade..."
# echo "Current: vite@6.0.7 → Latest: 7.0.0"
# echo "This is a MAJOR upgrade - may have breaking changes!"
# read -p "Upgrade to Vite 7? (y/N): " -n 1 -r
# echo
# if [[ $REPLY =~ ^[Yy]$ ]]; then
#     pnpm update --recursive vite
# fi

echo "✅ Upgrades complete!"
echo "🧪 Don't forget to test:"
echo "  - pnpm run build --recursive"
echo "  - pnpm run test --recursive"
echo "  - pnpm run lint --recursive"
