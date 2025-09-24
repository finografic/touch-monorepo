import HID from 'node-hid';

console.log('🔍 Looking for USBRelay8...');

// Find the USBRelay8 device
const devices = HID.devices();
const relayDevice = devices.find(device => 
  device.vendorId === 0x16c0 && device.productId === 0x05df
);

if (!relayDevice) {
  console.log('❌ USBRelay8 not found');
  process.exit(1);
}

console.log('✅ Found USBRelay8:', relayDevice);

// Open the device
const device = new HID.HID(relayDevice.path);
console.log('🔌 Connected to USBRelay8');

// Test relay 1 ON
console.log('🔴 Turning relay 1 ON...');
device.write([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);

setTimeout(() => {
  // Test relay 1 OFF
  console.log('⚪ Turning relay 1 OFF...');
  device.write([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  
  setTimeout(() => {
    device.close();
    console.log('🔌 Disconnected');
  }, 1000);
}, 2000);
