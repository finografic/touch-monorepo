#!/bin/bash

# Touch App Ubuntu VM Setup Script
# Run this after installing Ubuntu Desktop 24.04 LTS

echo "🚀 Setting up Touch App development environment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc

# Install VS Code (optional)
echo "📦 Installing VS Code..."
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
rm -f packages.microsoft.gpg
sudo apt install apt-transport-https
sudo apt update
sudo apt install code

# Install additional development tools
echo "🔧 Installing development tools..."
sudo apt install -y build-essential python3 python3-pip

# Create development directory
echo "📁 Setting up development directory..."
mkdir -p ~/development
cd ~/development

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository: git clone <your-repo-url>"
echo "2. Navigate to project: cd touch-monorepo"
echo "3. Install dependencies: pnpm install"
echo "4. Start development: pnpm run dev"
echo ""
echo "Access your app at: http://localhost:3000"
echo "API server at: http://localhost:4040"
