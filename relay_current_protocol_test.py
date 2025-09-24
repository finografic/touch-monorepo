import hid
import time

print("🔍 Testing Current Protocol - Confirmed Working!")
print("=" * 50)

# Find USBRelay8 device
devices = hid.enumerate(0x16c0, 0x05df)
if not devices:
    print("❌ USBRelay8 not found")
    exit(1)

device = hid.device()
device.open(0x16c0, 0x05df)
print("✅ Connected to USBRelay8")

def test_relay(relay_num, bit_value, duration=3):
    print(f"\n🧪 Testing Relay {relay_num}")
    print(f"   Bit value: 0x{bit_value:02x} ({bit_value})")
    
    try:
        # Turn relay ON
        print(f"   🔴 Turning Relay {relay_num} ON...")
        device.write([bit_value])
        time.sleep(duration)
        
        # Turn relay OFF
        print(f"   ⚪ Turning Relay {relay_num} OFF...")
        device.write([0x00])
        time.sleep(1)
        
        print(f"   ✅ Relay {relay_num} test completed")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")

try:
    # Test each relay individually
    test_relay(1, 0x01)  # Bit 0 = Relay 1
    test_relay(2, 0x02)  # Bit 1 = Relay 2
    test_relay(3, 0x04)  # Bit 2 = Relay 3
    test_relay(4, 0x08)  # Bit 3 = Relay 4
    test_relay(5, 0x10)  # Bit 4 = Relay 5
    test_relay(6, 0x20)  # Bit 5 = Relay 6
    test_relay(7, 0x40)  # Bit 6 = Relay 7
    test_relay(8, 0x80)  # Bit 7 = Relay 8
    
    print("\n🎉 All individual relays tested!")
    print("💡 Check which relay numbers had LEDs turn ON")
    
    print("\n⏰ Waiting 5 seconds before disconnecting...")
    time.sleep(5)
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    device.close()
    print("\n🔌 Disconnected")
