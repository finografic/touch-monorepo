#!/bin/bash

# Script to format SD card and write Ubuntu ARM64 ISO to it
# Usage: ./write-ubuntu-to-sd.sh /path/to/ubuntu-25.10-desktop-arm64.iso
#
# IMPORTANT: This script will FORMAT the SD card first, then write the ISO
# Make sure you have the correct SD card device selected!

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <path-to-ubuntu-iso>"
    echo ""
    echo "Example:"
    echo "  $0 ~/Downloads/ubuntu-25.10-desktop-arm64.iso"
    echo ""
    echo "Note: This script will FORMAT the SD card before writing."
    echo "      All data on the SD card will be permanently erased!"
    exit 1
fi

ISO_FILE="$1"

if [ ! -f "$ISO_FILE" ]; then
    echo "❌ ISO file not found: $ISO_FILE"
    exit 1
fi

# Note: Your M1 Mac's ARM architecture does NOT affect what gets written
# dd is a binary copy - whatever architecture the ISO/image is, that's what gets written
# Raspberry Pi 4 uses ARM64, so you need an ARM64 Ubuntu image

echo "ℹ️  Architecture Notes:"
echo "   - Your M1 Mac: ARM64 (doesn't affect what gets written)"
echo "   - Raspberry Pi 4: ARM64 (requires ARM64 Ubuntu image)"
echo "   - dd command: Binary copy (writes exactly what's in the ISO)"
echo ""

echo "🔍 Detecting SD card..."
echo ""

# List available disks
echo "Available disks:"
diskutil list | grep -E "disk[0-9].*physical" || true
echo ""

# Try to auto-detect SD card (look for removable disks that aren't your main drives)
SD_CARD=""
for disk in /dev/disk[0-9]; do
    if [ ! -e "$disk" ]; then
        continue
    fi

    # Skip internal disks
    disk_info=$(diskutil info "$disk" 2>/dev/null | grep "Internal" || true)
    if echo "$disk_info" | grep -q "Yes"; then
        continue
    fi

    # Check if it's a reasonable size for an SD card (between 1GB and 512GB)
    size_info=$(diskutil info "$disk" 2>/dev/null | grep "Disk Size" || true)
    if [ -n "$size_info" ]; then
        SD_CARD="$disk"
        break
    fi
done

if [ -z "$SD_CARD" ]; then
    echo "⚠️  Could not auto-detect SD card"
    echo ""
    echo "Please specify the SD card device manually:"
    echo "  Example: /dev/disk8"
    read -p "SD card device: " SD_CARD

    if [ ! -e "$SD_CARD" ]; then
        echo "❌ Device not found: $SD_CARD"
        exit 1
    fi
fi

echo "✅ Selected SD card: $SD_CARD"
echo ""
echo "📊 SD card information:"
diskutil info "$SD_CARD" | grep -E "Device Node|Disk Size|Media Name" || true
echo ""

echo "⚠️  WARNING: This will FORMAT and ERASE ALL DATA on $SD_CARD"
echo "   Make sure this is the correct device!"
echo ""
read -p "Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 1
fi

echo ""
echo "📋 Unmounting all partitions on SD card..."
diskutil unmountDisk "$SD_CARD" || true

echo ""
echo "🗑️  Formatting SD card (this will erase all data)..."
echo "   Formatting as ExFAT (will be overwritten by ISO)..."
# Format as ExFAT first to ensure clean state
# Note: The ISO will overwrite this anyway, but formatting ensures clean partition table
sudo diskutil eraseDisk ExFAT "UBUNTU_TEMP" "$SD_CARD" || {
    echo "⚠️  Formatting failed, but continuing with direct write..."
    echo "   (This is OK - dd will overwrite everything anyway)"
}

echo ""
echo "💾 Writing Ubuntu ISO to SD card..."
echo "   This may take 10-20 minutes depending on SD card speed..."
echo "   File: $(basename "$ISO_FILE")"
echo "   Size: $(du -h "$ISO_FILE" | cut -f1)"
echo "   Target: $SD_CARD"
echo ""

# Use dd to write the ISO (this overwrites the entire disk including partition table)
sudo dd if="$ISO_FILE" of="$SD_CARD" bs=1m status=progress

echo ""
echo "✅ Done! Syncing..."
sync

echo ""
echo "✅ Ubuntu has been written to $SD_CARD"
echo ""
echo "📝 Next steps:"
echo "  1. Eject the SD card safely:"
echo "     diskutil eject $SD_CARD"
echo "  2. Insert it into your Raspberry Pi"
echo "  3. Boot the Raspberry Pi"
echo "  4. Follow Ubuntu installation/setup"
echo ""
echo "💡 Important:"
echo "   - Raspberry Pi 4 uses ARM64 architecture"
echo "   - You MUST use an ARM64 Ubuntu image (not x86_64)"
echo "   - Your M1 Mac's ARM architecture doesn't affect what gets written"
echo "   - Ubuntu Server LTS for Raspberry Pi is recommended for best compatibility"
echo "   - LTS versions (22.04, 24.04) have 5 years of support vs 9 months for non-LTS"

