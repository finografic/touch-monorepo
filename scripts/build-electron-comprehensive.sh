#!/bin/bash

set -e  # Exit on any error

echo "🚀 Building Touch Client Electron App - Comprehensive Build"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Clean previous builds
echo "1. Cleaning previous builds..."
pnpm clean || print_warning "Clean failed, continuing..."

# Step 2: Install all dependencies
echo "2. Installing dependencies..."
pnpm install
print_status "Dependencies installed"

# Step 3: Build shared packages first
echo "3. Building shared packages..."
pnpm build.types
print_status "Shared packages built"

# Step 4: Build server
echo "4. Building server..."
pnpm --filter @workspace/server build.production
print_status "Server built"

# Step 5: Build client
echo "5. Building client..."
pnpm --filter @workspace/client build.production
print_status "Client built"

# Step 6: Verify builds exist
echo "6. Verifying builds..."
if [ ! -d "apps/server/dist" ]; then
    print_error "Server build not found at apps/server/dist"
    exit 1
fi

if [ ! -d "apps/client/dist" ]; then
    print_error "Client build not found at apps/client/dist"
    exit 1
fi

print_status "All builds verified"

# Step 7: Install electron dependencies
echo "7. Installing electron dependencies..."
cd electron
pnpm install
print_status "Electron dependencies installed"

# Step 8: Build Electron app
echo "8. Building Electron app..."

# For M1 Mac, build for both Windows and Mac
case "$1" in
    "win")
        echo "Building for Windows x64..."
        pnpm run build:win
        ;;
    "mac")
        echo "Building for macOS (current architecture)..."
        pnpm run build:mac
        ;;
    "mac-arm")
        echo "Building for macOS ARM64 (app only)..."
        pnpm run build:mac-arm-app
        ;;
    "mac-universal")
        echo "Building for macOS Universal..."
        pnpm run build:mac-universal
        ;;
    "all"|"")
        echo "Building for Windows and macOS Universal..."
        pnpm run dist
        ;;
    *)
        print_error "Unknown build target: $1"
        echo "Usage: $0 [win|mac|mac-arm|mac-universal|all]"
        exit 1
        ;;
esac

print_status "Electron build complete!"

# Step 9: Show build outputs
echo "9. Build outputs:"
ls -la dist/
echo ""
echo "🎉 Electron build successful!"
echo "📁 Windows installer: dist/Touch Client Setup.exe (if built)"
echo "📁 macOS app: dist/Touch Client.app (if built)"
echo "📁 macOS DMG: dist/Touch Client.dmg (if built)"
