import hid
import time

print("🔍 Simple USBRelay8 Test")
print("=" * 30)

try:
    # Try to enumerate and open
    devices = hid.enumerate(0x16c0, 0x05df)
    print(f"Found {len(devices)} devices")
    
    if devices:
        device_info = devices[0]
        print(f"Device path: {device_info['path']}")
        
        # Try different opening methods
        device = hid.device()
        
        print("Trying device.open()...")
        try:
            device.open(0x16c0, 0x05df)
            print("✅ Opened with vendor/product ID")
        except Exception as e:
            print(f"❌ Failed: {e}")
            
            print("Trying device.open_path()...")
            try:
                device.open_path(device_info['path'])
                print("✅ Opened with device path")
            except Exception as e2:
                print(f"❌ Failed: {e2}")
                exit(1)
        
        # If we get here, we're connected
        print("\n🧪 Testing relay control...")
        
        # Try to turn relay 1 OFF
        print("Sending OFF command: [0x00]")
        device.write([0x00])
        time.sleep(2)
        print("💡 Check if Relay 1 LED turned OFF")
        
        # Try to turn relay 1 ON
        print("Sending ON command: [0x01]")
        device.write([0x01])
        time.sleep(2)
        print("💡 Check if Relay 1 LED turned ON")
        
        # Turn OFF again
        print("Sending OFF command: [0x00]")
        device.write([0x00])
        time.sleep(2)
        print("💡 Check if Relay 1 LED turned OFF")
        
        device.close()
        print("✅ Test completed")
        
except Exception as e:
    print(f"❌ Error: {e}")
