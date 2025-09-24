import hid
import time

print("🔍 USBRelay8 Read Test - Trying to read status")
print("=" * 50)

# Find USBRelay8 device
devices = hid.enumerate(0x16c0, 0x05df)
if not devices:
    print("❌ USBRelay8 not found")
    exit(1)

device = hid.device()
device.open(0x16c0, 0x05df)
print("✅ Connected to USBRelay8")

try:
    print("\n🧪 Testing read capability...")
    
    # Try to read from device
    try:
        data = device.read(8)  # Try to read 8 bytes
        print(f"✅ Read successful: {data}")
    except Exception as e:
        print(f"❌ Read failed: {e}")
    
    print("\n🧪 Testing write then read...")
    
    # Write a command and try to read response
    device.write([0x01])  # Turn relay 1 on
    time.sleep(0.1)
    
    try:
        data = device.read(8)
        print(f"✅ Read after write: {data}")
    except Exception as e:
        print(f"❌ Read after write failed: {e}")
    
    print("\n⏰ Waiting 5 seconds...")
    time.sleep(5)
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    device.close()
    print("\n🔌 Disconnected")
