#!/usr/bin/env node

import * as HID from 'node-hid';

console.log('🔧 Pre-startup: Resetting relay board...');

// USBRelay8 HID protocol constants
const USBRELAY_VENDOR_ID = 0x16C0;
const USBRELAY_PRODUCT_ID = 0x05DF;

const resetRelayBoard = async (): Promise<void> => {
  try {
    console.log('🔍 Searching for USBRelay8 device...');

    const devices = HID.devices();
    const relayDevice = devices.find(
      (device: any) => device.vendorId === USBRELAY_VENDOR_ID && device.productId === USBRELAY_PRODUCT_ID,
    );

    if (!relayDevice) {
      console.log('⚠️  USBRelay8 not found - skipping reset');
      return;
    }

    console.log('🎯 Found USBRelay8 device, connecting...');
    const device = new HID.HID(relayDevice.path!);

    console.log('🧹 Sending ALL RELAYS OFF command...');
    device.write([0xFC]); // All relays OFF command

    console.log('⏰ Waiting 1 second for command to process...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('🔌 Disconnecting from relay board...');
    device.close();

    console.log('✅ Relay board reset completed');
  } catch (error) {
    console.error('❌ Error resetting relay board:', error);
    console.log('⚠️  Continuing with server startup...');
  }
};

const killPort4040 = async (): Promise<void> => {
  try {
    console.log('🔪 Killing any processes on port 4040...');
    const { execSync } = await import('child_process');

    try {
      execSync('lsof -ti :4040 | xargs kill -9', { stdio: 'pipe' });
      console.log('✅ Port 4040 cleared');
    } catch (error) {
      console.log('ℹ️  No processes found on port 4040');
    }
  } catch (error) {
    console.error('❌ Error clearing port 4040:', error);
  }
};

const main = async (): Promise<void> => {
  console.log('🚀 Starting pre-startup sequence...');

  // Step 1: Kill any processes on port 4040
  await killPort4040();

  // Step 2: Reset relay board
  await resetRelayBoard();

  console.log('✅ Pre-startup sequence completed');
};

main().catch((error) => {
  console.error('❌ Pre-startup failed:', error);
  process.exit(1);
});
