Setting up the SD card from macOS (or from Ubuntu in VMWare Fusion) is straightforward. Two options:

Option 1: Use macOS directly (simpler)
Using `dd` or a GUI tool to write the Ubuntu image to the SD card:

[2 tools called]

Creating a script to write Ubuntu to the SD card. Also covering how to pass the SD card through to VMWare Fusion if you prefer that:

[2 tools called]

Created a script to write Ubuntu to your SD card. Important note:

**Ubuntu Desktop ISO vs Raspberry Pi image:**

- The `ubuntu-25.10-desktop-arm64.iso` is a generic ARM64 ISO, not optimized for Raspberry Pi.
- For Raspberry Pi, use Ubuntu Server for Raspberry Pi or the Raspberry Pi Desktop image.

**Two options:**

### Option 1: Use the script (from macOS)

```bash
./write-ubuntu-to-sd.sh ~/Downloads/ubuntu-25.10-desktop-arm64.iso
```

### Option 2: Use VMWare Fusion VM

If you want to set it up from inside the Ubuntu VM:

1. Boot Ubuntu in VMWare Fusion
2. Pass through the SD card:
   - In VMWare Fusion, go to VM Settings
   - Add a USB device → select your SD card reader
   - The SD card will appear in the Ubuntu VM
3. In the Ubuntu VM, use `dd` or a tool like `balena-etcher`:

   ```bash
   sudo dd if=/path/to/ubuntu.iso of=/dev/sdX bs=1M status=progress
   ```

**Recommendation:**
For Raspberry Pi, download Ubuntu Server for Raspberry Pi (not the generic ARM64 ISO). It’s optimized for Raspberry Pi hardware.

Would you like me to:

1. Update the script to download the Raspberry Pi-specific Ubuntu image?
2. Help you set up the SD card from the VM?
3. Or proceed with the generic ISO you have?

The script is ready to use once you have the SD card inserted.
