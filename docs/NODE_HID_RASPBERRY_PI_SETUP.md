# node-hid Setup for Raspberry Pi 4

## Problem

`node-hid` works on macOS but fails on Raspberry Pi 4 (Linux) when deployed. This is because `node-hid` is a **native Node.js addon** that requires:

1. **System-level dependencies** (development headers)
2. **Proper permissions** for USB HID device access
3. **Correct build tools** for native compilation

## Solution

### 1. Install System Dependencies

`node-hid` requires `libusb-1.0` development headers and build tools:

```bash
# On Raspberry Pi (Debian/Ubuntu-based)
sudo apt update
sudo apt install -y \
  libusb-1.0-0-dev \
  build-essential \
  node-gyp
```

**Required packages:**
- `libusb-1.0-0-dev` - USB library development headers (required for node-hid)
- `build-essential` - GCC compiler and build tools (required for node-gyp)
- `node-gyp` - Node.js native addon build tool (usually comes with Node.js)

### 2. Set Up USB HID Permissions

The user running the Node.js application needs permission to access USB HID devices:

**Option A: Add user to input group (Recommended)**
```bash
sudo usermod -a -G input $USER
# Log out and log back in for changes to take effect
```

**Option B: Create udev rule for specific device (More secure)**
```bash
# Create udev rule for USBRelay8 device (vendor: 16c0, product: 05df)
echo 'SUBSYSTEM=="hidraw", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", MODE="0666", GROUP="input"' | sudo tee /etc/udev/rules.d/99-usbrelay8.rules

# Reload udev rules
sudo udevadm control --reload-rules
sudo udevadm trigger
```

**Option C: Make device accessible to all users (Less secure, but simpler)**
```bash
# Create udev rule that makes all HID devices accessible
echo 'SUBSYSTEM=="hidraw", MODE="0666"' | sudo tee /etc/udev/rules.d/99-hidraw-permissions.rules
sudo udevadm control --reload-rules
sudo udevadm trigger
```

### 3. Rebuild node-hid After System Setup

After installing system dependencies, rebuild `node-hid`:

```bash
cd /path/to/touch-monorepo/apps/server
pnpm rebuild node-hid
# Or
npm rebuild node-hid
```

### 4. Verify Device Detection

Test if the device is detected:

```bash
# List USB devices
lsusb

# Should show something like:
# Bus 001 Device 003: ID 16c0:05df Van Ooijen Technische Informatica USBRelay8

# List HID devices
ls -la /dev/hidraw*

# Test with node-hid script
cd apps/server
node scripts/list-hid-devices.js
```

## Installation in Deployment Script

Add to your deployment setup script (e.g., `deployments/FILES/setup-others.sh`):

```bash
#!/bin/bash

# Install system dependencies for node-hid
echo "📦 Installing system dependencies for node-hid..."
sudo apt update
sudo apt install -y \
  libusb-1.0-0-dev \
  build-essential

# Set up USB HID permissions
echo "🔐 Setting up USB HID permissions..."
sudo usermod -a -G input $USER

# Create udev rule for USBRelay8
echo 'SUBSYSTEM=="hidraw", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", MODE="0666", GROUP="input"' | sudo tee /etc/udev/rules.d/99-usbrelay8.rules
sudo udevadm control --reload-rules
sudo udevadm trigger

echo "✅ System dependencies installed. Please log out and log back in for group changes to take effect."
```

## Important Notes

### Do NOT Install node-hid Globally

- `node-hid` should be installed as a **project dependency** (in `package.json`)
- Installing globally won't help and may cause version conflicts
- The native addon must be built for the specific Node.js version and platform

### Why It Works on macOS But Not Linux

1. **macOS**: System libraries are pre-installed, permissions are handled via System Preferences
2. **Linux**: Requires explicit installation of development headers and udev rules for device access

### Build Requirements

- `node-hid` uses `node-gyp` to compile native C++ code
- Requires Python 3.x and GCC compiler
- Must be rebuilt when:
  - Node.js version changes
  - System libraries are updated
  - Moving to a different architecture (e.g., x64 to ARM)

## Troubleshooting

### Error: "Cannot find module 'node-hid'"
- Run `pnpm install` or `npm install` in `apps/server`
- Ensure system dependencies are installed
- Rebuild: `pnpm rebuild node-hid`

### Error: "Permission denied" when accessing device
- Check user is in `input` group: `groups $USER`
- Verify udev rules: `cat /etc/udev/rules.d/99-usbrelay8.rules`
- Reload udev: `sudo udevadm control --reload-rules && sudo udevadm trigger`
- May need to log out/in for group changes

### Error: "gyp: No Xcode or CLT version detected" (on macOS)
- Install Xcode Command Line Tools: `xcode-select --install`

### Device Not Detected
- Check USB connection: `lsusb`
- Check device permissions: `ls -la /dev/hidraw*`
- Test with: `node apps/server/scripts/list-hid-devices.js`

## References

- [node-hid GitHub](https://github.com/node-hid/node-hid)
- [node-hid Installation Guide](https://github.com/node-hid/node-hid#installation)
- [Linux USB HID Permissions](https://github.com/node-hid/node-hid#linux)
