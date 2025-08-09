#!/bin/bash
echo "Starting Touch Monorepo Client..."
cd "$(dirname "$0")"
node dist/client/server.js
