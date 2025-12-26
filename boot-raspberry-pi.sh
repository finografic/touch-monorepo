#!/bin/bash

# Script to boot Raspberry Pi OS from SD card using QEMU
# SD Card: /dev/disk8
# Boot partition: /dev/disk8s1 (FAT32) - mounted at /Volumes/bootfs
# Root partition: /dev/disk8s2 (ext4)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/rpi-vm-images"
BOOT_PARTITION="/dev/disk8s1"
ROOT_PARTITION="/dev/disk8s2"
BOOT_MOUNT="/Volumes/bootfs"

# QEMU parameters for Raspberry Pi 4 (ARM64)
# Note: Raspberry Pi 4B in QEMU only supports 2 GiB RAM
MEMORY="2G"
CORES="4"

echo "🚀 Raspberry Pi OS QEMU Boot Script"
echo "===================================="
echo ""

# Check if boot partition is mounted
if [ ! -d "$BOOT_MOUNT" ]; then
    echo "❌ Boot partition not mounted. Please mount it first:"
    echo "   diskutil mount $BOOT_PARTITION"
    exit 1
fi

# Extract kernel and DTB from boot partition
KERNEL_PATH="$IMAGES_DIR/kernel8.img"
DTB_PATH="$IMAGES_DIR/bcm2711-rpi-4-b.dtb"

mkdir -p "$IMAGES_DIR"

if [ ! -f "$KERNEL_PATH" ] || [ "$BOOT_MOUNT/kernel8.img" -nt "$KERNEL_PATH" ]; then
    echo "📋 Copying kernel from boot partition..."
    cp "$BOOT_MOUNT/kernel8.img" "$KERNEL_PATH"
    echo "✅ Kernel copied to $KERNEL_PATH"
fi

if [ ! -f "$DTB_PATH" ] || [ "$BOOT_MOUNT/bcm2711-rpi-4-b.dtb" -nt "$DTB_PATH" ]; then
    echo "📋 Copying device tree from boot partition..."
    cp "$BOOT_MOUNT/bcm2711-rpi-4-b.dtb" "$DTB_PATH"
    echo "✅ Device tree copied to $DTB_PATH"
fi

# Create disk images from partitions (safer than direct access)
BOOT_IMG="$IMAGES_DIR/boot.img"
ROOT_IMG="$IMAGES_DIR/root.img"

echo ""
echo "💾 Creating disk images from SD card partitions..."
echo "   (This may take a few minutes and requires sudo)"
echo ""

if [ ! -f "$BOOT_IMG" ]; then
    echo "Creating boot image..."
    echo "   (You can skip this and use SD card directly - press Ctrl+C, then use boot-raspberry-pi-direct.sh)"
    read -p "Create boot image? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Unmounting boot partition first..."
        diskutil unmount "$BOOT_PARTITION" || true
        sleep 1
        sudo dd if="$BOOT_PARTITION" of="$BOOT_IMG" bs=1m status=progress
        echo "✅ Boot image created: $BOOT_IMG"
        # Remount for potential future use
        diskutil mount "$BOOT_PARTITION" || true
    else
        echo "⏭️  Skipping boot image - will use SD card directly"
        BOOT_IMG="$BOOT_PARTITION"
    fi
else
    echo "ℹ️  Boot image already exists: $BOOT_IMG"
    echo "   (Delete it to recreate from SD card)"
fi

if [ ! -f "$ROOT_IMG" ]; then
    echo "Creating root image (this is large, ~66GB)..."
    echo "   You can interrupt this and use the SD card directly if preferred"
    read -p "Continue creating root image? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   Unmounting any mounted partitions first..."
        diskutil unmount "$BOOT_PARTITION" 2>/dev/null || true
        sudo dd if="$ROOT_PARTITION" of="$ROOT_IMG" bs=1m status=progress
        echo "✅ Root image created: $ROOT_IMG"
        # Remount boot partition
        diskutil mount "$BOOT_PARTITION" || true
    else
        echo "⏭️  Skipping root image creation"
        ROOT_IMG="$ROOT_PARTITION"  # Use SD card directly
        echo "   Will use SD card partition directly (requires sudo)"
    fi
else
    echo "ℹ️  Root image already exists: $ROOT_IMG"
fi

echo ""
echo "🔧 Starting QEMU..."
echo ""
echo "Note: First boot may take a while. You'll see kernel messages."
echo "      Login with default Raspberry Pi credentials if needed."
echo ""

# Unmount boot partition if using SD card directly
if [ "$BOOT_IMG" = "$BOOT_PARTITION" ] || [ "$ROOT_IMG" = "$ROOT_PARTITION" ]; then
    echo "🔓 Unmounting partitions for direct SD card access..."
    diskutil unmount "$BOOT_PARTITION" 2>/dev/null || true
fi

# QEMU command - using raspi4b machine type
if [ "$ROOT_IMG" = "$ROOT_PARTITION" ] || [ "$BOOT_IMG" = "$BOOT_PARTITION" ]; then
    # Direct SD card access (requires sudo)
    echo "⚠️  Using SD card directly - requires sudo"
    sudo qemu-system-aarch64 \
        -M raspi4b \
        -m "$MEMORY" \
        -smp "$CORES" \
        -kernel "$KERNEL_PATH" \
        -dtb "$DTB_PATH" \
        -drive "file=$ROOT_IMG,format=raw,if=sd,index=1" \
        -drive "file=$BOOT_IMG,format=raw,if=sd,index=0" \
        -append "root=/dev/mmcblk0p2 rootfstype=ext4 rw console=ttyAMA0,115200" \
        -netdev user,id=net0,hostfwd=tcp::2222-:22 \
        -device rtl8139,netdev=net0 \
        -serial stdio \
        -nographic
else
    # Using disk images (no sudo needed for QEMU)
    qemu-system-aarch64 \
        -M raspi4b \
        -m "$MEMORY" \
        -smp "$CORES" \
        -kernel "$KERNEL_PATH" \
        -dtb "$DTB_PATH" \
        -drive "file=$ROOT_IMG,format=raw,if=sd,index=1" \
        -drive "file=$BOOT_IMG,format=raw,if=sd,index=0" \
        -append "root=/dev/mmcblk0p2 rootfstype=ext4 rw console=ttyAMA0,115200" \
        -netdev user,id=net0,hostfwd=tcp::2222-:22 \
        -device rtl8139,netdev=net0 \
        -serial stdio \
        -nographic
fi

echo ""
echo "✅ QEMU session ended"

