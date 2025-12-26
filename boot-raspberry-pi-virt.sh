#!/bin/bash

# Alternative boot script using QEMU 'virt' machine type
# This has much better support than raspi4b, but requires different setup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/rpi-vm-images"
KERNEL_PATH="/tmp/rpi-kernel8.img"
DTB_PATH="/tmp/rpi-bcm2711-rpi-4-b.dtb"

echo "🚀 Booting Raspberry Pi OS using QEMU 'virt' machine type"
echo "   (Better support than raspi4b, but may need different kernel)"
echo ""

# Check for cached files
if [ ! -f "$IMAGES_DIR/kernel8.img" ] || [ ! -f "$IMAGES_DIR/bcm2711-rpi-4-b.dtb" ]; then
    echo "❌ Kernel/DTB files not found in $IMAGES_DIR"
    echo "   Please run boot-raspberry-pi-direct.sh first to extract them"
    exit 1
fi

cp "$IMAGES_DIR/kernel8.img" "$KERNEL_PATH"
cp "$IMAGES_DIR/bcm2711-rpi-4-b.dtb" "$DTB_PATH"

# Detect SD card
DISK_DEVICE=""
for test_disk in /dev/disk8 /dev/disk9 /dev/disk10; do
    if [ -e "${test_disk}s1" ] && [ -e "${test_disk}s2" ]; then
        boot_info=$(diskutil info "${test_disk}s1" 2>/dev/null || true)
        root_info=$(diskutil info "${test_disk}s2" 2>/dev/null || true)
        if echo "$boot_info" | grep -qE "FAT32|MS-DOS" && \
           echo "$root_info" | grep -qE "Linux"; then
            DISK_DEVICE="$test_disk"
            break
        fi
    fi
done

if [ -z "$DISK_DEVICE" ]; then
    echo "❌ Could not find SD card"
    exit 1
fi

echo "✅ Found SD card: $DISK_DEVICE"
echo ""

# Unmount if mounted
if mount | grep -q "${DISK_DEVICE}s1"; then
    echo "🔓 Unmounting boot partition..."
    diskutil unmount "${DISK_DEVICE}s1" || true
fi

echo "🔧 Starting QEMU with 'virt' machine type..."
echo "   Note: This may not work with Raspberry Pi kernel - it's experimental"
echo ""

# Try virt machine type - better support but may need different kernel
sudo qemu-system-aarch64 \
    -M virt \
    -cpu cortex-a72 \
    -m 2G \
    -smp 4 \
    -kernel "$KERNEL_PATH" \
    -drive "file=$DISK_DEVICE,format=raw,if=virtio,id=disk0" \
    -append "root=/dev/vda2 rootfstype=ext4 rw console=ttyAMA0 earlyprintk" \
    -serial stdio \
    -display none \
    -device virtio-net-device,netdev=net0 \
    -netdev user,id=net0,hostfwd=tcp::2222-:22

echo ""
echo "✅ QEMU session ended"

