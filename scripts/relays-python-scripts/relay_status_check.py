import hid
import time

print("🔍 USBRelay8 Status Check - Why is Relay 1 ON?")
print("=" * 60)

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
print(f"   Manufacturer: {device_info.get('manufacturer_string', 'Unknown')}")
print(f"   Product: {device_info.get('product_string', 'Unknown')}")

try:
    # Try to open the device
    device = hid.device()
    device.open_path(device_info['path'])
    print("✅ Connected to USBRelay8")
    
    print("\n🔍 CURRENT STATUS:")
    print("   Relay 1 LED is ON (as you observed)")
    print("   This suggests Relay 1 is currently ACTIVE")
    
    print("\n🧪 ATTEMPTING TO TURN RELAY 1 OFF:")
    
    # Try different OFF commands
    off_commands = [
        ([0x00], "Simple OFF (0x00)"),
        ([0x00, 0x00], "2-byte OFF"),
        ([0x00, 0x00, 0x00, 0x00], "4-byte OFF"),
        ([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], "8-byte OFF"),
    ]
    
    for command, description in off_commands:
        print(f"\n   Testing {description}: {command}")
        try:
            device.write(command)
            print(f"   ✅ Command sent - CHECK LED NOW!")
            time.sleep(2)
            print(f"   💡 Did Relay 1 LED turn OFF?")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n🧪 ATTEMPTING TO TURN ALL RELAYS OFF:")
    try:
        device.write([0x00])
        print("   ✅ All relays OFF command sent")
        time.sleep(2)
        print("   💡 Check if Relay 1 LED turned OFF")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n🧪 TESTING READ CAPABILITY:")
    try:
        # Try to read status from device
        data = device.read(8)
        print(f"   ✅ Read successful: {data}")
    except Exception as e:
        print(f"   ❌ Read failed: {e}")
    
    print("\n⏰ Waiting 5 seconds before disconnecting...")
    time.sleep(5)
    
except Exception as e:
    print(f"❌ Error connecting: {e}")
    print("\n💡 This might be a permission issue on macOS")
    print("   Try running with: sudo python relay_status_check.py")
finally:
    try:
        device.close()
        print("🔌 Disconnected")
    except:
        pass
