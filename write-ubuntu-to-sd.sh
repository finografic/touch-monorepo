#!/bin/bash

# Script to write Ubuntu ARM64 ISO to SD card
# Usage: ./write-ubuntu-to-sd.sh /path/to/ubuntu-25.10-desktop-arm64.iso

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <path-to-ubuntu-iso>"
    echo ""
    echo "Example:"
    echo "  $0 ~/Downloads/ubuntu-25.10-desktop-arm64.iso"
    exit 1
fi

ISO_FILE="$1"

if [ ! -f "$ISO_FILE" ]; then
    echo "❌ ISO file not found: $ISO_FILE"
    exit 1
fi

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
echo "⚠️  WARNING: This will ERASE ALL DATA on $SD_CARD"
echo "   Make sure this is the correct device!"
echo ""
read -p "Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 1
fi

echo ""
echo "📋 Unmounting SD card..."
diskutil unmountDisk "$SD_CARD" || true

echo ""
echo "💾 Writing Ubuntu ISO to SD card..."
echo "   This may take 10-20 minutes depending on SD card speed..."
echo "   File: $(basename "$ISO_FILE")"
echo "   Size: $(du -h "$ISO_FILE" | cut -f1)"
echo ""

# Use dd to write the ISO
sudo dd if="$ISO_FILE" of="$SD_CARD" bs=1m status=progress

echo ""
echo "✅ Done! Syncing..."
sync

echo ""
echo "✅ Ubuntu has been written to $SD_CARD"
echo ""
echo "Next steps:"
echo "  1. Eject the SD card safely"
echo "  2. Insert it into your Raspberry Pi"
echo "  3. Boot the Raspberry Pi"
echo "  4. Follow Ubuntu installation/setup"

