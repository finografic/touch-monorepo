import hid
import time

print("🔍 USBRelay8 Path Test")
print("=" * 30)

# Find USBRelay8 device
devices = hid.enumerate(0x16c0, 0x05df)
if not devices:
    print("❌ USBRelay8 not found")
    exit(1)

print(f"✅ Found {len(devices)} USBRelay8 device(s)")
device_info = devices[0]
print(f"   Device path: {device_info['path']}")
print(f"   Vendor ID: 0x{device_info['vendor_id']:04x}")
print(f"   Product ID: 0x{device_info['product_id']:04x}")

try:
    # Try opening with the exact path
    device = hid.device()
    device.open_path(device_info['path'])
    print("✅ Connected using device path!")
    
    # Test a simple command
    print("\n🧪 Testing relay control...")
    device.write([0x00])  # Turn all relays OFF
    print("   ⚪ All relays OFF command sent")
    time.sleep(2)
    
    device.write([0x01])  # Turn relay 1 ON
    print("   🔴 Relay 1 ON command sent")
    time.sleep(3)
    
    device.write([0x00])  # Turn all relays OFF
    print("   ⚪ All relays OFF command sent")
    time.sleep(2)
    
    print("✅ Test completed!")
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    try:
        device.close()
        print("🔌 Disconnected")
    except:
        pass
