#!/bin/bash

################################################################################
# Raspberry Pi 4 - node-hid Setup Script
# 
# This script ensures all required OS/system drivers and dependencies are
# installed for node-hid to work correctly with USBRelay8 boards on Raspberry Pi OS.
#
# Device: USBRelay8 (Vendor: 16c0, Product: 05df)
# Protocol: USB HID
#
# Usage: sudo ./setup-raspberry-pi-hid.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
USBRELAY_VENDOR_ID="16c0"
USBRELAY_PRODUCT_ID="05df"
UDEV_RULE_FILE="/etc/udev/rules.d/99-usbrelay8.rules"
CURRENT_USER="${SUDO_USER:-$USER}"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then 
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

check_os() {
    if [ ! -f /etc/os-release ]; then
        print_error "Cannot detect OS. This script is designed for Debian-based Linux (Raspberry Pi OS)."
        exit 1
    fi
    
    . /etc/os-release
    
    if [[ "$ID" != "raspbian" && "$ID" != "debian" && "$ID_LIKE" != *"debian"* ]]; then
        print_warning "This script is designed for Debian-based Linux (Raspberry Pi OS)."
        print_warning "Detected OS: $PRETTY_NAME"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "Detected OS: $PRETTY_NAME"
    fi
}

################################################################################
# Main Installation Steps
################################################################################

install_system_dependencies() {
    print_header "Step 1: Installing System Dependencies"
    
    print_step "Updating package lists..."
    apt-get update -qq
    
    print_step "Installing build tools and development headers..."
    apt-get install -y \
        build-essential \
        python3 \
        libusb-1.0-0-dev \
        udev \
        usbutils \
        || {
            print_error "Failed to install system dependencies"
            exit 1
        }
    
    print_success "System dependencies installed successfully"
}

setup_udev_rules() {
    print_header "Step 2: Setting Up USB HID Device Permissions"
    
    print_step "Creating udev rule for USBRelay8 device..."
    
    # Create udev rule for USBRelay8 (vendor: 16c0, product: 05df)
    cat > "$UDEV_RULE_FILE" << EOF
# USBRelay8 HID Device Permissions
# Vendor ID: 16c0, Product ID: 05df
# This allows users in the 'input' group to access the USBRelay8 device
SUBSYSTEM=="hidraw", ATTRS{idVendor}=="$USBRELAY_VENDOR_ID", ATTRS{idProduct}=="$USBRELAY_PRODUCT_ID", MODE="0666", GROUP="input"
EOF
    
    print_success "Created udev rule: $UDEV_RULE_FILE"
    
    print_step "Reloading udev rules..."
    udevadm control --reload-rules
    udevadm trigger
    
    print_success "Udev rules reloaded"
}

setup_user_permissions() {
    print_header "Step 3: Setting Up User Permissions"
    
    print_step "Adding user '$CURRENT_USER' to 'input' group..."
    
    if id -nG "$CURRENT_USER" | grep -qw "input"; then
        print_success "User '$CURRENT_USER' is already in 'input' group"
    else
        usermod -a -G input "$CURRENT_USER"
        print_success "User '$CURRENT_USER' added to 'input' group"
        print_warning "You will need to log out and log back in for group changes to take effect"
    fi
}

verify_device_detection() {
    print_header "Step 4: Verifying Device Detection"
    
    print_step "Checking for USBRelay8 device..."
    
    if command -v lsusb &> /dev/null; then
        DEVICE_FOUND=$(lsusb | grep -i "$USBRELAY_VENDOR_ID:$USBRELAY_PRODUCT_ID" || true)
        
        if [ -n "$DEVICE_FOUND" ]; then
            print_success "USBRelay8 device detected:"
            echo "  $DEVICE_FOUND"
        else
            print_warning "USBRelay8 device not currently detected"
            print_warning "Make sure the device is connected via USB"
            echo ""
            print_step "All USB devices:"
            lsusb | head -10
        fi
    else
        print_warning "lsusb not available, skipping device detection check"
    fi
    
    print_step "Checking HID device nodes..."
    if ls /dev/hidraw* &> /dev/null; then
        HID_DEVICES=$(ls -la /dev/hidraw* 2>/dev/null | wc -l)
        print_success "Found $HID_DEVICES HID device node(s)"
        ls -la /dev/hidraw* 2>/dev/null | head -5
    else
        print_warning "No HID device nodes found (device may not be connected)"
    fi
}

rebuild_node_hid() {
    print_header "Step 5: Rebuilding node-hid (if Node.js is installed)"
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_warning "Node.js not found. Skipping node-hid rebuild."
        print_warning "Install Node.js first, then run: cd apps/server && pnpm rebuild node-hid"
        return
    fi
    
    # Check if pnpm is available
    if command -v pnpm &> /dev/null; then
        print_step "Rebuilding node-hid with pnpm..."
        # Note: We can't run this as root, so we'll provide instructions
        print_warning "To rebuild node-hid, run as your user (not root):"
        echo "  cd apps/server"
        echo "  pnpm rebuild node-hid"
    elif command -v npm &> /dev/null; then
        print_step "Rebuilding node-hid with npm..."
        print_warning "To rebuild node-hid, run as your user (not root):"
        echo "  cd apps/server"
        echo "  npm rebuild node-hid"
    else
        print_warning "Neither pnpm nor npm found. Install them first, then rebuild node-hid."
    fi
}

print_summary() {
    print_header "Installation Summary"
    
    echo -e "${GREEN}✓${NC} System dependencies installed"
    echo -e "${GREEN}✓${NC} USB HID permissions configured"
    echo -e "${GREEN}✓${NC} User permissions set up"
    echo ""
    echo -e "${YELLOW}⚠${NC} ${BLUE}Important Next Steps:${NC}"
    echo ""
    echo "1. ${YELLOW}Log out and log back in${NC} for group changes to take effect"
    echo "   (or run: newgrp input)"
    echo ""
    echo "2. ${YELLOW}Rebuild node-hid${NC} after logging back in:"
    echo "   cd apps/server"
    echo "   pnpm rebuild node-hid"
    echo ""
    echo "3. ${YELLOW}Verify device detection${NC}:"
    echo "   lsusb | grep -i '$USBRELAY_VENDOR_ID:$USBRELAY_PRODUCT_ID'"
    echo "   node apps/server/scripts/list-hid-devices.js"
    echo ""
    echo -e "${GREEN}Setup complete!${NC}"
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "Raspberry Pi 4 - node-hid Setup Script"
    
    check_root
    check_os
    
    install_system_dependencies
    setup_udev_rules
    setup_user_permissions
    verify_device_detection
    rebuild_node_hid
    print_summary
}

# Run main function
main
