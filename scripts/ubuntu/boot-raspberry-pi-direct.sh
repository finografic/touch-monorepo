#!/bin/bash

# Simpler script that uses SD card directly (faster, but requires sudo)
# Automatically detects SD card with Raspberry Pi OS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/rpi-vm-images"
KERNEL_PATH="/tmp/rpi-kernel8.img"
DTB_PATH="/tmp/rpi-bcm2711-rpi-4-b.dtb"

# Function to detect Raspberry Pi SD card
detect_sd_card() {
    echo "🔍 Detecting Raspberry Pi SD card..."

    # Look for disks with FAT32 boot partition and Linux root partition
    # Check all disks, not just external ones (SD cards can show as "internal")
    for disk in /dev/disk[0-9]; do
        if [ ! -e "$disk" ]; then
            continue
        fi

        # Skip synthesized/APFS containers
        disk_type=$(diskutil list "$disk" 2>/dev/null | head -1 | grep -o "(.*)" || true)
        if echo "$disk_type" | grep -qE "synthesized|APFS"; then
            continue
        fi

        # Check partitions
        for part in "${disk}"s[0-9]; do
            if [ ! -e "$part" ]; then
                continue
            fi

            part_info=$(diskutil info "$part" 2>/dev/null || true)
            # Check for FAT32 (boot partition)
            if echo "$part_info" | grep -qE "File System Personality.*FAT32|MS-DOS.*FAT32|Windows_FAT_32"; then
                # Found FAT32 partition - check if it has Raspberry Pi boot files
                mount_point=$(echo "$part_info" | grep "Mount Point" | awk '{print $3}' || true)

                # Try mounted first, then check if we can find kernel8.img
                if [ -n "$mount_point" ] && [ -f "$mount_point/kernel8.img" ]; then
                    # Found boot partition with kernel! Now find the Linux partition
                    disk_base=$(basename "$disk")
                    for root_part in "${disk}"s[0-9]; do
                        if [ "$root_part" = "$part" ]; then
                            continue
                        fi
                        root_info=$(diskutil info "$root_part" 2>/dev/null || true)
                        if echo "$root_info" | grep -qE "File System Personality.*Linux|Linux"; then
                            BOOT_PARTITION="$part"
                            ROOT_PARTITION="$root_part"
                            BOOT_MOUNT="$mount_point"
                            echo "✅ Found SD card:"
                            echo "   Boot: $BOOT_PARTITION (mounted at $BOOT_MOUNT)"
                            echo "   Root: $ROOT_PARTITION"
                            return 0
                        fi
                    done
                # Also check if partition name suggests it's a boot partition
                elif echo "$part_info" | grep -qi "bootfs"; then
                    # Try to mount it temporarily to check for kernel
                    temp_mount="/tmp/rpi-boot-check"
                    mkdir -p "$temp_mount"
                    if diskutil mount -mountPoint "$temp_mount" "$part" >/dev/null 2>&1; then
                        if [ -f "$temp_mount/kernel8.img" ]; then
                            # Found it! Now find the Linux partition
                            for root_part in "${disk}"s[0-9]; do
                                if [ "$root_part" = "$part" ]; then
                                    continue
                                fi
                                root_info=$(diskutil info "$root_part" 2>/dev/null || true)
                                if echo "$root_info" | grep -qE "File System Personality.*Linux|Linux"; then
                                    BOOT_PARTITION="$part"
                                    ROOT_PARTITION="$root_part"
                                    BOOT_MOUNT="$temp_mount"
                                    echo "✅ Found SD card:"
                                    echo "   Boot: $BOOT_PARTITION (mounted at $BOOT_MOUNT)"
                                    echo "   Root: $ROOT_PARTITION"
                                    return 0
                                fi
                            done
                        fi
                        diskutil unmount "$part" >/dev/null 2>&1 || true
                    fi
                    rmdir "$temp_mount" 2>/dev/null || true
                fi
            fi
        done
    done

    return 1
}

echo "🚀 Booting Raspberry Pi OS directly from SD card"
echo ""

# Detect SD card
if ! detect_sd_card; then
    echo "⚠️  Auto-detection failed, trying alternative method..."

    # Alternative: use diskutil list to find FAT32 + Linux pattern
    disk_list=$(diskutil list | grep -A 10 "FDisk\|FAT32\|Linux" | grep -E "disk[0-9]+s[0-9]" | head -2)

    # Try common SD card locations
    for test_disk in /dev/disk8 /dev/disk9 /dev/disk10; do
        if [ -e "${test_disk}s1" ] && [ -e "${test_disk}s2" ]; then
            boot_info=$(diskutil info "${test_disk}s1" 2>/dev/null || true)
            root_info=$(diskutil info "${test_disk}s2" 2>/dev/null || true)

            if echo "$boot_info" | grep -qE "FAT32|MS-DOS" && \
               echo "$root_info" | grep -qE "Linux"; then
                BOOT_PARTITION="${test_disk}s1"
                ROOT_PARTITION="${test_disk}s2"
                # Try to get mount point
                mount_point=$(echo "$boot_info" | grep "Mount Point" | awk '{print $3}' || echo "/Volumes/bootfs")
                BOOT_MOUNT="$mount_point"

                # Verify kernel exists
                if [ -f "$BOOT_MOUNT/kernel8.img" ] || [ -f "/Volumes/bootfs/kernel8.img" ]; then
                    if [ -f "/Volumes/bootfs/kernel8.img" ]; then
                        BOOT_MOUNT="/Volumes/bootfs"
                    fi
                    echo "✅ Found SD card (alternative method):"
                    echo "   Boot: $BOOT_PARTITION (mounted at $BOOT_MOUNT)"
                    echo "   Root: $ROOT_PARTITION"
                    break
                fi
            fi
        fi
    done

    # Final check
    if [ -z "$BOOT_PARTITION" ] || [ -z "$ROOT_PARTITION" ]; then
        echo "❌ Could not find Raspberry Pi SD card"
        echo ""
        echo "Please make sure:"
        echo "  1. SD card is inserted"
        echo "  2. SD card has Raspberry Pi OS installed"
        echo "  3. Boot partition is mounted (should auto-mount)"
        echo ""
        echo "You can also manually specify the device:"
        echo "  BOOT_PARTITION=/dev/disk8s1 ROOT_PARTITION=/dev/disk8s2 $0"
        exit 1
    fi
fi

# Use existing files from rpi-vm-images if available, otherwise copy from SD card
if [ -f "$IMAGES_DIR/kernel8.img" ] && [ -f "$IMAGES_DIR/bcm2711-rpi-4-b.dtb" ]; then
    echo "📋 Using existing kernel and device tree from $IMAGES_DIR..."
    cp "$IMAGES_DIR/kernel8.img" "$KERNEL_PATH"
    cp "$IMAGES_DIR/bcm2711-rpi-4-b.dtb" "$DTB_PATH"
    echo "✅ Ready (using cached files)"
else
    # Fall back to copying from SD card
    if [ ! -d "$BOOT_MOUNT" ]; then
        echo "❌ Boot partition not mounted at $BOOT_MOUNT"
        echo "   And no cached files found in $IMAGES_DIR"
        exit 1
    fi
    echo "📋 Copying kernel and device tree from SD card..."
    cp "$BOOT_MOUNT/kernel8.img" "$KERNEL_PATH"
    cp "$BOOT_MOUNT/bcm2711-rpi-4-b.dtb" "$DTB_PATH"
    echo "✅ Ready"
fi

# Get the base disk device (e.g., /dev/disk8 from /dev/disk8s1)
DISK_DEVICE=$(echo "$BOOT_PARTITION" | sed 's/s[0-9]*$//')

# Unmount boot partition if mounted (QEMU needs raw access)
echo ""
if mount | grep -q "$BOOT_PARTITION"; then
    echo "🔓 Unmounting boot partition for QEMU..."
    diskutil unmount "$BOOT_PARTITION" || true
else
    echo "ℹ️  Boot partition already unmounted"
fi

echo ""
echo "🔧 Starting QEMU (this requires sudo)..."
echo "   First boot may take a while..."
echo ""

# Verify disk device exists
if [ ! -e "$DISK_DEVICE" ]; then
    echo "❌ Disk device $DISK_DEVICE not found"
    exit 1
fi

# Boot using the whole SD card device
# Raspberry Pi 4B in QEMU only supports 2 GiB RAM
# Using the whole disk device allows QEMU to see both partitions naturally
# Note: raspi4b machine type doesn't support PCI, so networking is disabled for now
echo "   (Console output will appear below - first boot may take 1-2 minutes)"
echo "   Press Ctrl+A then X to exit QEMU, or Ctrl+A then C for monitor"
echo ""
sudo qemu-system-aarch64 \
    -M raspi4b \
    -m 2G \
    -smp 4 \
    -kernel "$KERNEL_PATH" \
    -dtb "$DTB_PATH" \
    -drive "file=$DISK_DEVICE,format=raw,if=sd" \
    -append "root=/dev/mmcblk0p2 rootfstype=ext4 rw console=ttyAMA0,115200 earlyprintk loglevel=7" \
    -serial stdio \
    -display none \
    -d guest_errors,unimp

echo ""
echo "✅ QEMU session ended"
echo "💡 Tip: You can SSH into the VM with: ssh -p 2222 pi@localhost"

