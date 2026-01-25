#!/bin/bash

# Script to install nvm (Node Version Manager) on Raspberry Pi OS
# Usage: ./install-nvm.sh

set -e

echo "🚀 Installing nvm (Node Version Manager)..."
echo ""

# Check if nvm is already installed
if [ -d "$HOME/.nvm" ]; then
  echo "⚠️  nvm appears to be already installed at $HOME/.nvm"
  read -p "Do you want to reinstall? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Installation cancelled"
    exit 0
  fi
  echo "🔄 Reinstalling nvm..."
fi

# Download and install nvm
echo "📥 Downloading nvm install script..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

echo ""
echo "✅ nvm installation complete!"
echo ""

# Detect shell
SHELL_NAME=$(basename "$SHELL")
if [ "$SHELL_NAME" = "bash" ]; then
  RC_FILE="$HOME/.bashrc"
elif [ "$SHELL_NAME" = "zsh" ]; then
  RC_FILE="$HOME/.zshrc"
else
  RC_FILE="$HOME/.bashrc"
fi

# Check if nvm is already in RC file
if grep -q "NVM_DIR" "$RC_FILE" 2>/dev/null; then
  echo "✅ nvm already configured in $RC_FILE"
else
  echo "📝 Adding nvm to $RC_FILE..."
  cat >> "$RC_FILE" << 'EOF'

# NVM (Node Version Manager)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
  echo "✅ nvm added to $RC_FILE"
fi

echo ""
echo "📋 Next steps:"
echo "   1. Reload your shell configuration:"
echo "      source $RC_FILE"
echo ""
echo "   2. Or close and reopen your terminal"
echo ""
echo "   3. Verify installation:"
echo "      nvm --version"
echo ""
echo "   4. Install Node.js LTS:"
echo "      nvm install --lts"
echo "      nvm use --lts"
echo ""
echo "   5. Verify Node.js:"
echo "      node --version"
echo "      npm --version"
echo ""

