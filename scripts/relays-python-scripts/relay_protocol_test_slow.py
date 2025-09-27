import hid
import time

print("🔍 Testing USBRelay8 Protocols - One at a Time")
print("=" * 60)

# Find USBRelay8 device
devices = hid.enumerate(0x16c0, 0x05df)
if not devices:
    print("❌ USBRelay8 not found")
    exit(1)

device = hid.device()
device.open(0x16c0, 0x05df)
print("✅ Connected to USBRelay8")

def test_protocol(name, on_command, off_command, relay_num):
    print(f"\n🧪 Testing {name} - Relay {relay_num}")
    print(f"   ON Command:  {on_command}")
    print(f"   OFF Command: {off_command}")
    
    try:
        # Turn relay ON
        print(f"   🔴 Turning Relay {relay_num} ON...")
        device.write(on_command)
        time.sleep(3)  # Leave ON for 3 seconds
        
        # Turn relay OFF
        print(f"   ⚪ Turning Relay {relay_num} OFF...")
        device.write(off_command)
        time.sleep(1)  # Brief pause
        
        print(f"   ✅ {name} test completed")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")

try:
    # Protocol 1: Our current approach (bitmask)
    print("\n📋 Protocol 1: Bitmask (Current)")
    test_protocol("Protocol 1", [0x01], [0x00], 1)
    
    # Protocol 2: Report ID + Bitmask
    print("\n📋 Protocol 2: Report ID + Bitmask")
    test_protocol("Protocol 2", [0x00, 0x01], [0x00, 0x00], 2)
    
    # Protocol 3: Report ID + Command + Relay + State
    print("\n📋 Protocol 3: Report ID + Command + Relay + State")
    test_protocol("Protocol 3", [0x00, 0x01, 0x01, 0x01], [0x00, 0x01, 0x01, 0x00], 3)
    
    # Protocol 4: Alternative command codes
    print("\n📋 Protocol 4: Alternative Command Codes")
    test_protocol("Protocol 4", [0x00, 0x02, 0x01, 0x01], [0x00, 0x02, 0x01, 0x00], 4)
    
    # Protocol 5: 8-byte format (common for HID)
    print("\n📋 Protocol 5: 8-byte HID Report")
    test_protocol("Protocol 5", [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01], [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 5)
    
    print("\n✅ All protocols tested!")
    print("💡 Check your relay board LEDs to see which protocol works!")
    print("⏰ Waiting 5 seconds before disconnecting...")
    time.sleep(5)
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    device.close()
    print("\n🔌 Disconnected")
