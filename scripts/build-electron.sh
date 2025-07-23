#!/bin/bash

echo "Building Touch Client Electron App..."

# Build the monorepo first
echo "1. Building monorepo..."
pnpm build

# Build Electron app for Windows
echo "2. Building Electron app for Windows..."
cd electron
pnpm run build:win

echo "✅ Electron build complete!"
echo "📁 Check electron/dist/ for the Windows installer"
