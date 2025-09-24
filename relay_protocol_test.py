import hid
import time

print("🔍 Testing Different USBRelay8 Protocols")
print("=" * 50)

# Find USBRelay8 device
devices = hid.enumerate(0x16c0, 0x05df)
if not devices:
    print("❌ USBRelay8 not found")
    exit(1)

device = hid.device()
device.open(0x16c0, 0x05df)
print("✅ Connected to USBRelay8")

def test_protocol(name, command):
    print(f"\n🧪 Testing {name}:")
    print(f"   Command: {command}")
    
    try:
        device.write(command)
        time.sleep(0.5)
        print("   ✅ Command sent")
    except Exception as e:
        print(f"   ❌ Error: {e}")

try:
    # Protocol 1: Our current approach (bitmask)
    print("\n📋 Protocol 1: Bitmask (Current)")
    test_protocol("Relay 1 ON", [0x01])  # Bit 0 = Relay 1
    test_protocol("Relay 1 OFF", [0x00])
    
    # Protocol 2: Report ID + Bitmask
    print("\n📋 Protocol 2: Report ID + Bitmask")
    test_protocol("Relay 1 ON", [0x00, 0x01])
    test_protocol("Relay 1 OFF", [0x00, 0x00])
    
    # Protocol 3: Report ID + Command + Relay + State
    print("\n📋 Protocol 3: Report ID + Command + Relay + State")
    test_protocol("Relay 1 ON", [0x00, 0x01, 0x01, 0x01])
    test_protocol("Relay 1 OFF", [0x00, 0x01, 0x01, 0x00])
    
    # Protocol 4: Different command codes
    print("\n📋 Protocol 4: Alternative Command Codes")
    test_protocol("Relay 1 ON", [0x00, 0x02, 0x01, 0x01])
    test_protocol("Relay 1 OFF", [0x00, 0x02, 0x01, 0x00])
    
    # Protocol 5: 8-byte format (common for HID)
    print("\n📋 Protocol 5: 8-byte HID Report")
    test_protocol("Relay 1 ON", [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01])
    test_protocol("Relay 1 OFF", [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    
    print("\n✅ All protocols tested!")
    print("💡 Check your relay board LEDs to see which protocol works!")
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    device.close()
    print("\n🔌 Disconnected")
