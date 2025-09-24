import hid
import time

print("🔍 USBRelay8 Debug Test - Comprehensive Protocol Testing")
print("=" * 70)

# Find USBRelay8 device
devices = hid.enumerate(0x16c0, 0x05df)
if not devices:
    print("❌ USBRelay8 not found")
    exit(1)

print(f"✅ Found {len(devices)} USBRelay8 device(s)")
for i, device in enumerate(devices):
    print(f"   Device {i+1}: {device}")

device = hid.device()
device.open(0x16c0, 0x05df)
print("✅ Connected to USBRelay8")

def test_command(name, command, duration=2):
    print(f"\n🧪 Testing {name}")
    print(f"   Command: {command}")
    print(f"   Duration: {duration} seconds")

    try:
        device.write(command)
        print(f"   🔴 Command sent - WATCH THE BOARD NOW!")
        time.sleep(duration)
        print(f"   ✅ Test completed")

    except Exception as e:
        print(f"   ❌ Error: {e}")

try:
    print("\n" + "="*50)
    print("🔍 BASIC CONNECTIVITY TEST")
    print("="*50)

    # Test 1: Simple commands
    test_command("Simple ON", [0x01], 3)
    test_command("Simple OFF", [0x00], 3)

    print("\n" + "="*50)
    print("🔍 EXTENDED PROTOCOL TESTING")
    print("="*50)

    # Test 2: Different report lengths
    test_command("1-byte ON", [0x01], 3)
    test_command("2-byte ON", [0x00, 0x01], 3)
    test_command("3-byte ON", [0x00, 0x01, 0x01], 3)
    test_command("4-byte ON", [0x00, 0x01, 0x01, 0x01], 3)
    test_command("8-byte ON", [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01], 3)

    print("\n" + "="*50)
    print("🔍 ALTERNATIVE COMMAND FORMATS")
    print("="*50)

    # Test 3: Different command structures
    test_command("Format A", [0x00, 0x01, 0x01, 0x01], 3)  # Report, Cmd, Relay, State
    test_command("Format B", [0x00, 0x02, 0x01, 0x01], 3)  # Report, Cmd2, Relay, State
    test_command("Format C", [0x01, 0x01, 0x01, 0x01], 3)  # Report1, Cmd, Relay, State
    test_command("Format D", [0xFF, 0x01, 0x01, 0x01], 3)  # ReportFF, Cmd, Relay, State

    print("\n" + "="*50)
    print("🔍 BITMASK TESTING")
    print("="*50)

    # Test 4: Different bit positions
    test_command("Bit 0 (Relay 1)", [0x01], 3)
    test_command("Bit 1 (Relay 2)", [0x02], 3)
    test_command("Bit 2 (Relay 3)", [0x04], 3)
    test_command("Bit 3 (Relay 4)", [0x08], 3)
    test_command("All Bits", [0xFF], 3)

    print("\n" + "="*50)
    print("🔍 FINAL TEST - ALL RELAYS ON")
    print("="*50)

    # Test 5: Turn all relays on
    test_command("ALL RELAYS ON", [0xFF], 5)
    test_command("ALL RELAYS OFF", [0x00], 3)

    print("\n✅ All tests completed!")
    print("💡 If you saw NO LED activity, there might be:")
    print("   - Wrong vendor/product ID")
    print("   - Different HID protocol")
    print("   - Hardware issue")
    print("   - Permission problem")

    print("\n⏰ Waiting 5 seconds before disconnecting...")
    time.sleep(5)

except Exception as e:
    print(f"❌ Error: {e}")
finally:
    device.close()
    print("\n🔌 Disconnected")
