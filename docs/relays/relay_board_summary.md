# HW-554 USB Relay Board: Combined Technical Summary

📅 Sep 21, 2025

This document summarizes the key technical details of the HW-554 USB relay board, drawing information from both provided reference manuals.

## 1. Hardware Overview

- **Device Name:** HW-554 USB relay board (also identified as "200765")
- **Functionality:** 8-channel relay board designed for computer control
- **Relays:** Utilizes SRD-12VDC-SL-C relays (specifications can vary by manufacturer)
- **Power Requirements:** Requires external 12V power supply + USB connection
- **Indicators:** Power LED and individual relay status LEDs
- **Design:** Computer-dependent device (not standalone)

## 2. USB Interface and Communication

### USB Chips

- **Primary:** FTDI FT245RL USB interface chip
- **Alternative:** Some variants use CH340 chip (USB-to-serial converter)

### Communication Methods

- **Virtual COM Port (Serial):** Primary method using serial communication
- **USB HID:** Alternative Human Interface Device protocol
- **Baud Rate:** Typically 9600 baud for serial communication

## 3. Control Protocol and Commands

### Serial Protocol (Byte Commands)

- **Turn all relays ON:** Send `0xFF, 0xFF`
- **Turn all relays OFF:** Send `0x00, 0x00`
- **Individual relay control:** Specific byte sequences (requires further documentation)

### HID Protocol

- Uses USB HID reports for relay control
- Compatible with HIDAPI libraries
- Command examples: `usbrelay 1_1=1` (turn on relay 1)

## 4. Driver Requirements

### Windows

- **FTDI FT245RL:** Usually auto-detected by Windows 10 (no additional drivers needed)
- **CH340:** Requires CH341SER.EXE driver installation
- **Detection:** Appears as COM port in Device Manager

### Linux/macOS

- **FTDI FT245RL:** Kernel drivers usually included (appears as `/dev/ttyUSB*`)
- **CH340:** Uses `ch341` module (included in kernels 3.x+)
- **Detection:** Use `lsusb` to identify device, `dmesg | grep -E "FTDI|ch34"` for driver info

## 5. Software Control Options

### Command Line Tools

- **usbrelay:** Cross-platform CLI tool (GitHub: darrylb123/usbrelay)
  - Install: `sudo apt install usbrelay` (Debian/Ubuntu)
  - Usage: `usbrelay toggle 0` (toggle relay 0)
- **Denkovi CLI:** Manufacturer-provided command-line tool
- **crelay:** Lightweight, unified control for various USB relay cards

### Programming Libraries

- **HIDAPI:** Cross-platform library for USB HID communication
- **Python serial:** Direct serial communication with `pyserial`
- **Node.js options:** `serialport` or `node-hid` libraries

### Example Python Code

```python
import serial
s = serial.Serial('/dev/ttyUSB0', 9600)
s.write(bytes([0xFF, 0xFF]))  # Turn all relays ON
s.write(bytes([0x00, 0x00]))  # Turn all relays OFF
```

## 6. Integration Requirements

### Hardware Setup

1. Connect USB cable to computer
2. Provide 12V external power supply
3. Verify device detection in OS

### Software Setup

1. Install appropriate drivers (if needed)
2. Identify device port/interface
3. Choose control method (serial, HID, CLI)
4. Test basic relay control

## 7. Device Identification

### Linux Commands

- `lsusb` - List USB devices
- `ls /dev/ttyUSB*` - List serial ports
- `dmesg | grep -E "FTDI|ch34"` - Check driver messages

### Windows

- Device Manager → Ports (COM & LPT)
- Look for FTDI or CH340 device

## 8. Key Integration Points

- **8 Relays:** Map to slots 1-8 in your existing system
- **Simple Protocol:** Byte-based commands for easy Node.js integration
- **Cross-platform:** Works on Windows, Linux, macOS
- **Multiple Interfaces:** Serial, HID, and CLI options available
- **Reliable Hardware:** FTDI chip provides stable USB communication

---

*Generated from combined analysis of HW-554 documentation*
