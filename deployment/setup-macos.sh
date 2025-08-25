#!/bin/bash
set -e

echo "========================================"
echo "My Monorepo App - macOS Setup"
echo "========================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Attempting Homebrew install..."
  if command -v brew >/dev/null 2>&1; then
    brew install node
  else
    echo "⚠️  Homebrew not found. Installing Homebrew (may prompt for password)..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
    brew install node
  fi
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"

echo "📦 Installing dependencies (production)..."
npm install --production

echo "🚀 Starting application (server + client)..."
chmod +x start-server-macos.sh start-client-macos.sh || true
(./start-server-macos.sh &) >/dev/null 2>&1
(./start-client-macos.sh &) >/dev/null 2>&1

echo "🎉 Setup completed. Server and client started in background."
