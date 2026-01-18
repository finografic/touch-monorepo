#!/bin/bash
# Ensure correct Node.js version is used
# This script checks and uses the Node version specified in .nvmrc

if [ -f .nvmrc ]; then
  REQUIRED_VERSION=$(cat .nvmrc | tr -d '[:space:]')
  CURRENT_VERSION=$(node --version | tr -d 'v')

  if [ "$CURRENT_VERSION" != "$REQUIRED_VERSION" ]; then
    echo "⚠️  Node.js version mismatch!"
    echo "   Required: v$REQUIRED_VERSION (from .nvmrc)"
    echo "   Current:  v$CURRENT_VERSION"
    echo ""
    echo "   Attempting to switch to v$REQUIRED_VERSION..."

    if command -v nvm >/dev/null 2>&1 || [ -s "$HOME/.nvm/nvm.sh" ]; then
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
      nvm use "$REQUIRED_VERSION" 2>/dev/null || {
        echo "❌ Failed to switch Node.js version"
        echo "   Please run: nvm install $REQUIRED_VERSION && nvm use $REQUIRED_VERSION"
        exit 1
      }
      echo "✅ Switched to Node.js v$REQUIRED_VERSION"
    else
      echo "❌ nvm not found. Please install nvm or switch Node.js version manually."
      exit 1
    fi
  fi
fi
