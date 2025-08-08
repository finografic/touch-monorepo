#!/bin/bash

echo "========================================"
echo "Touch Monorepo - Linux Setup"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo
    echo "Please install Node.js:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm"
    echo "  Or download from: https://nodejs.org/"
    echo
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo
echo "📦 Installing dependencies..."
npm install --production
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Make scripts executable
chmod +x start-server.sh start-client.sh

echo
echo "🎉 Setup completed successfully!"
echo
echo "🚀 To start the application:"
echo "  1. ./start-server.sh (for backend)"
echo "  2. ./start-client.sh (for frontend)"
echo "  3. Or run: npm start (for both)"
echo
