#!/bin/bash

# =============================================================================
# TOUCH MONOREPO - ENVIRONMENT SETUP SCRIPT
# =============================================================================

set -e

echo "🔧 Setting up Touch Monorepo environment files..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    print_error ".env.example not found!"
    exit 1
fi

# Create development environment
if [ ! -f ".env.development" ]; then
    cp .env.example .env.development
    print_status "Created .env.development"
else
    print_warning ".env.development already exists (skipping)"
fi

# Create production environment
if [ ! -f ".env.production" ]; then
    cp .env.example .env.production
    # Update production defaults
    sed -i '' 's/NODE_ENV=development/NODE_ENV=production/' .env.production
    sed -i '' 's/DB_NAME=development.sqlite.db/DB_NAME=production.sqlite.db/' .env.production
    print_status "Created .env.production"
else
    print_warning ".env.production already exists (skipping)"
fi

# Create test environment
if [ ! -f ".env.test" ]; then
    cp .env.example .env.test
    # Update test defaults
    sed -i '' 's/NODE_ENV=development/NODE_ENV=test/' .env.test
    sed -i '' 's/DB_NAME=development.sqlite.db/DB_NAME=test.sqlite.db/' .env.test
    print_status "Created .env.test"
else
    print_warning ".env.test already exists (skipping)"
fi

echo ""
print_info "Environment files created successfully!"
echo ""
print_warning "IMPORTANT: You need to update these files with your actual values:"
echo "  - .env.development (for development)"
echo "  - .env.production (for production)"
echo "  - .env.test (for testing)"
echo ""
print_warning "Especially important:"
echo "  - BETTER_AUTH_SECRET (generate a secure 32+ character secret)"
echo "  - Database credentials (if using MySQL/PostgreSQL)"
echo "  - API_HOST and CLIENT_HOST for production"
echo ""
print_info "To generate a secure auth secret, run:"
echo "  node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo ""
print_info "The deployment build will automatically consolidate these settings."
