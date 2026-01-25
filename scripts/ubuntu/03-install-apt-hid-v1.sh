#!/bin/bash

# Script to install system dependencies for node-hid on Raspberry Pi OS (Debian-based)
# Usage: ./03-install-apt.sh

set -e

USERNAME="touch"
UDEV_RULE_FILE="/etc/udev/rules.d/99-usbrelay8.rules"

echo "========================================"
echo "Installing System Dependencies for node-hid"
echo "========================================"
echo ""

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install system dependencies required for node-hid
echo ""
echo "📦 Installing system dependencies..."
echo "  - libusb-1.0-0-dev (USB library development headers)"
echo "  - build-essential (GCC compiler and build tools)"
echo ""

sudo apt install -y \
  libusb-1.0-0-dev \
  build-essential

echo ""
echo "✅ System dependencies installed!"
echo ""

# Set up USB HID permissions
echo "🔐 Setting up USB HID permissions..."
echo ""

# Add user to input group
echo "  - Adding user '$USERNAME' to 'input' group..."
if groups "$USERNAME" | grep -q "\binput\b"; then
  echo "    ✅ User '$USERNAME' is already in 'input' group"
else
  sudo usermod -a -G input "$USERNAME"
  echo "    ✅ User '$USERNAME' added to 'input' group"
  echo "    ⚠️  Note: You may need to log out and log back in for this to take effect"
fi

# Create udev rule for USBRelay8 device
echo ""
echo "  - Creating udev rule for USBRelay8 device..."
if [ -f "$UDEV_RULE_FILE" ]; then
  echo "    ⚠️  Udev rule already exists at $UDEV_RULE_FILE"
  read -p "    Do you want to overwrite it? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "    ℹ️  Keeping existing udev rule"
  else
    echo 'SUBSYSTEM=="hidraw", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", MODE="0666", GROUP="input"' | sudo tee "$UDEV_RULE_FILE" > /dev/null
    echo "    ✅ Udev rule updated"
  fi
else
  echo 'SUBSYSTEM=="hidraw", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", MODE="0666", GROUP="input"' | sudo tee "$UDEV_RULE_FILE" > /dev/null
  echo "    ✅ Udev rule created at $UDEV_RULE_FILE"
fi

# Reload udev rules
echo ""
echo "  - Reloading udev rules..."
sudo udevadm control --reload-rules
sudo udevadm trigger

echo ""
echo "✅ USB HID permissions configured!"
echo ""

# Verify installation
echo "========================================"
echo "Verification"
echo "========================================"
echo ""

echo "📋 Checking installed packages..."
if dpkg -l | grep -q "libusb-1.0-0-dev"; then
  echo "  ✅ libusb-1.0-0-dev is installed"
else
  echo "  ❌ libusb-1.0-0-dev is NOT installed"
fi

if dpkg -l | grep -q "build-essential"; then
  echo "  ✅ build-essential is installed"
else
  echo "  ❌ build-essential is NOT installed"
fi

echo ""
echo "📋 Checking user groups..."
if groups "$USERNAME" | grep -q "\binput\b"; then
  echo "  ✅ User '$USERNAME' is in 'input' group"
else
  echo "  ⚠️  User '$USERNAME' is NOT in 'input' group (may need to log out/in)"
fi

echo ""
echo "📋 Checking udev rule..."
if [ -f "$UDEV_RULE_FILE" ]; then
  echo "  ✅ Udev rule exists at $UDEV_RULE_FILE"
  echo "  📄 Rule content:"
  cat "$UDEV_RULE_FILE" | sed 's/^/      /'
else
  echo "  ❌ Udev rule NOT found at $UDEV_RULE_FILE"
fi

echo ""
echo "========================================"
echo "✅ Installation Complete!"
echo "========================================"
echo ""
echo "📋 Next steps:"
echo ""
echo "  1. If user was added to 'input' group, log out and log back in:"
echo "     - Close current terminal session"
echo "     - Open a new terminal or SSH session"
echo "     - Verify with: groups"
echo ""
echo "  2. Rebuild node-hid in your project:"
echo "     cd /path/to/touch-monorepo/apps/server"
echo "     pnpm rebuild node-hid"
echo "     # Or: npm rebuild node-hid"
echo ""
echo "  3. Verify USB device detection:"
echo "     lsusb | grep -i '16c0:05df'"
echo "     ls -la /dev/hidraw*"
echo ""
echo "  4. Test with node-hid script:"
echo "     node apps/server/scripts/list-hid-devices.js"
echo ""
