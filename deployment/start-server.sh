#!/bin/bash
echo "Starting Touch Monorepo Server..."
cd "$(dirname "$0")"
node dist/server/index.js
