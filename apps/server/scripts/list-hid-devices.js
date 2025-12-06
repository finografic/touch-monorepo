#!/usr/bin/env node

/**
 * Script to list all HID devices, specifically USBRelay8 devices
 * Run with: node scripts/list-hid-devices.js
 */

import * as HID from 'node-hid';

console.log('🔍 Scanning for HID devices...\n');

try {
  const devices = HID.devices();

  // Filter for USBRelay8 devices (vendorId: 0x16C0, productId: 0x05DF)
  const USBRELAY_VENDOR_ID = 0x16C0;
  const USBRELAY_PRODUCT_ID = 0x05DF;

  const relayDevices = devices.filter(
    (device) => device.vendorId === USBRELAY_VENDOR_ID && device.productId === USBRELAY_PRODUCT_ID
  );

  console.log(`Found ${relayDevices.length} USBRelay8 device(s):\n`);

  if (relayDevices.length === 0) {
    console.log('❌ No USBRelay8 devices found.');
    console.log('\nAll HID devices:');
    devices.forEach((device, index) => {
      if (device.vendorId && device.productId) {
        console.log(`  ${index + 1}. ${device.manufacturer || 'Unknown'} ${device.product || 'Unknown'}`);
        console.log(`     Vendor ID: 0x${device.vendorId.toString(16).toUpperCase()}`);
        console.log(`     Product ID: 0x${device.productId.toString(16).toUpperCase()}`);
        console.log(`     Path: ${device.path || 'N/A'}\n`);
      }
    });
  } else {
    relayDevices.forEach((device, index) => {
      console.log(`Device ${index + 1} (Board ${index + 1}):`);
      console.log(`  Manufacturer: ${device.manufacturer || 'N/A'}`);
      console.log(`  Product: ${device.product || 'N/A'}`);
      console.log(`  Vendor ID: 0x${device.vendorId.toString(16).toUpperCase()}`);
      console.log(`  Product ID: 0x${device.productId.toString(16).toUpperCase()}`);
      console.log(`  Path: ${device.path || 'N/A'}`);
      console.log(`  Serial Number: ${device.serialNumber || 'N/A'}`);
      console.log(`  Interface: ${device.interface || 'N/A'}\n`);
    });
  }

  // Also show all HID devices for debugging
  console.log(`\n📋 Total HID devices found: ${devices.length}`);

} catch (error) {
  console.error('❌ Error listing HID devices:', error);
  process.exit(1);
}

