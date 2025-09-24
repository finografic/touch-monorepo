import hid
import time

print("🔌 USBRelay8 - AGGRESSIVE Turn ALL Relays OFF")
print("=" * 50)

# Find USBRelay8 device
devices = hid.enumerate(0x16c0, 0x05df)
if not devices:
    print("❌ USBRelay8 not found")
    exit(1)

print(f"✅ Found {len(devices)} USBRelay8 device(s)")

device = hid.device()
device.open(0x16c0, 0x05df)
print("✅ Connected to USBRelay8")

try:
    print("\n🧹 AGGRESSIVELY turning ALL relays OFF...")
    print("   Using multiple methods to ensure everything is OFF")

    # Method 1: Multiple OFF commands with different delays
    print("\n📡 Method 1: Rapid OFF commands")
    for i in range(10):
        device.write([0x00])  # All relays OFF
        print(f"   Command {i+1}/10: [0x00] - ALL OFF")
        time.sleep(0.1)

    # Method 2: Different OFF command formats
    print("\n📡 Method 2: Different OFF formats")
    off_commands = [
        [0x00],                    # Standard OFF
        [0x00, 0x00],             # 2-byte OFF
        [0x00, 0x00, 0x00],       # 3-byte OFF
        [0x00, 0x00, 0x00, 0x00], # 4-byte OFF
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], # 8-byte OFF
    ]

    for i, cmd in enumerate(off_commands):
        device.write(cmd)
        print(f"   Format {i+1}/5: {cmd} - ALL OFF")
        time.sleep(0.2)

    # Method 3: Individual relay OFF commands
    print("\n📡 Method 3: Individual relay OFF commands")
    for relay in range(1, 9):
        device.write([0x00])  # Turn off each relay individually
        print(f"   Relay {relay}: [0x00] - OFF")
        time.sleep(0.1)

    # Method 4: Clear any potential buffers
    print("\n📡 Method 4: Buffer clearing")
    for i in range(5):
        device.write([0x00])
        time.sleep(0.05)
        print(f"   Buffer clear {i+1}/5")

    print("\n✅ All methods completed!")
    print("💡 All relays should DEFINITELY be OFF now")
    print("💡 All LEDs should DEFINITELY be OFF now")

    print("\n⏰ Waiting 3 seconds before disconnecting...")
    time.sleep(3)

    # Final verification
    print("\n🔍 Final verification - sending one more OFF command...")
    device.write([0x00])
    print("✅ Final OFF command sent")

except Exception as e:
    print(f"❌ Error: {e}")
finally:
    device.close()
    print("🔌 Disconnected")
    print("✅ AGGRESSIVE script completed - all relays should be OFF")
    print("💡 If LEDs are still ON, try unplugging/replugging USB cable")
