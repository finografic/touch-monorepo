# Installing Ubuntu on SD Card (macOS M1/ARM)

This guide covers formatting an SD card and writing Ubuntu ARM64 to it from macOS (M1/ARM compatible).

## ⚠️ Important Notes

### Architecture Clarification

**Key Point**: Your M1 Mac's ARM architecture does NOT affect what gets written to the SD card. The `dd` command is a **binary copy** - whatever architecture the ISO/image is, that's exactly what gets written to the SD card.

- **Your system (M1 Mac)**: ARM64 - This is just the machine doing the writing
- **Raspberry Pi 4**: ARM64 architecture - This is what the SD card needs
- **Required**: ARM64/AArch64 Ubuntu image (NOT x86_64/amd64)

**Why ARM64?**

- Raspberry Pi 4 uses ARM64 (AArch64) processors
- You cannot run x86_64 software on Raspberry Pi 4
- The M1 Mac being ARM64 is just a coincidence - it doesn't affect the SD card contents

### Ubuntu Image Types

**For Raspberry Pi, you have two options:**

1. **Ubuntu Server for Raspberry Pi** (Recommended)
   - Optimized for Raspberry Pi hardware
   - Better driver support
   - Download from: <https://ubuntu.com/download/raspberry-pi>

2. **Generic ARM64 Ubuntu ISO**
   - Works but may have hardware compatibility issues
   - Use if Raspberry Pi-specific image isn't available

### LTS vs Non-LTS Versions

**✅ Use LTS (Long Term Support) - Recommended**

- **LTS versions**: 22.04, 24.04, etc. (released every 2 years)
- **Support**: 5 years (or 10 years with Ubuntu Pro)
- **Benefits**:
  - More stable and tested
  - Longer security updates
  - Better for production/servers
  - Less frequent upgrades needed
  - More community support and documentation

**Non-LTS versions**: 22.10, 23.04, 23.10, etc. (released every 6 months)

- **Support**: Only 9 months
- **Use case**: Testing new features, development only

**Recommendation**: Always use LTS for Raspberry Pi servers/production use.

## Option 1: Use the Script (Recommended - macOS)

The script will:

1. **Auto-detect** your SD card
2. **Format** the SD card (erases all data including Raspberry Pi OS)
3. **Write** the Ubuntu ISO to the SD card

### Usage

```bash
# Make script executable (first time only)
chmod +x write-ubuntu-to-sd.sh

# Run the script with your Ubuntu ISO
./write-ubuntu-to-sd.sh ~/Downloads/ubuntu-22.04-server-arm64+raspi.img.xz
```

### What the Script Does

1. **Detects SD card** - Automatically finds removable SD cards
2. **Shows SD card info** - Displays device, size, and name
3. **Confirms action** - Requires typing 'yes' to proceed
4. **Unmounts partitions** - Safely unmounts all partitions
5. **Formats SD card** - Formats as ExFAT (will be overwritten by ISO)
6. **Writes ISO** - Uses `dd` to write the entire ISO image
7. **Syncs data** - Ensures all data is written to disk

### Example

```bash
$ ./write-ubuntu-to-sd.sh ~/Downloads/ubuntu-22.04-server-arm64+raspi.img.xz

🔍 Detecting SD card...

Available disks:
/dev/disk8   external, physical

✅ Selected SD card: /dev/disk8

📊 SD card information:
   Device Node: /dev/disk8
   Disk Size: 32.0 GB (32000000000 Bytes)
   Media Name: SanDisk Ultra

⚠️  WARNING: This will FORMAT and ERASE ALL DATA on /dev/disk8
   Make sure this is the correct device!

Type 'yes' to continue: yes

📋 Unmounting all partitions on SD card...
🗑️  Formatting SD card (this will erase all data)...
💾 Writing Ubuntu ISO to SD card...
   This may take 10-20 minutes depending on SD card speed...
```

## Option 2: Use VMWare Fusion VM

If you prefer to set it up from inside an Ubuntu VM:

1. **Boot Ubuntu in VMWare Fusion**
2. **Pass through the SD card**:
   - In VMWare Fusion, go to **VM Settings**
   - **USB & Bluetooth** → **Add USB device** → Select your SD card reader
   - The SD card will appear in the Ubuntu VM as `/dev/sdX`
3. **In the Ubuntu VM**, use `dd` or a tool like `balena-etcher`:

   ```bash
   # First, format the SD card (optional, dd will overwrite anyway)
   sudo fdisk -l  # Find your SD card device

   # Write the ISO
   sudo dd if=/path/to/ubuntu.iso of=/dev/sdX bs=1M status=progress

   # Sync to ensure data is written
   sync
   ```

## Download Links

### Ubuntu Server for Raspberry Pi (Recommended - LTS)

- **Official**: <https://ubuntu.com/download/raspberry-pi>
- **Current LTS**: Ubuntu 24.04 LTS (Noble Numbat) or Ubuntu 22.04 LTS (Jammy Jellyfish)
- **Direct downloads**: <https://cdimage.ubuntu.com/releases/>
  - Look for: `ubuntu-*-server-arm64+raspi.img.xz` with LTS in the name
  - Example: `ubuntu-24.04-server-arm64+raspi.img.xz`

### Generic ARM64 Ubuntu (Alternative)

- **Official**: <https://ubuntu.com/download/server/arm>
- Look for ARM64/AArch64 images

## After Writing

1. **Eject the SD card safely**:

   ```bash
   diskutil eject /dev/disk8
   ```

2. **Insert into Raspberry Pi**

3. **Boot the Raspberry Pi**

4. **Follow Ubuntu installation/setup**

## Troubleshooting

### SD Card Not Detected

- Make sure the SD card is fully inserted
- Try a different USB port or SD card reader
- Check `diskutil list` to see all disks

### Formatting Fails

- This is OK - `dd` will overwrite everything anyway
- The script will continue even if formatting fails

### Wrong Architecture Error

- **Raspberry Pi 4 requires ARM64** - it cannot run x86_64 software
- Make sure you downloaded ARM64/AArch64 image, NOT x86_64/amd64
- Check the ISO filename for "arm64" or "aarch64"
- Your M1 Mac's architecture doesn't matter - `dd` writes exactly what's in the file

### Slow Write Speed

- SD card speed varies (Class 10, UHS-I, UHS-II, etc.)
- 10-20 minutes is normal for a 4-8GB image
- Be patient and don't interrupt the process
