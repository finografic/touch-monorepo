import { env } from 'env.server';

// Helper to parse hex string to number (handles '0x16c0' or '16c0' format)
const parseHexString = (hexStr: string): number => {
  // Remove '0x' prefix if present
  const cleaned = hexStr.startsWith('0x') || hexStr.startsWith('0X') ? hexStr.slice(2) : hexStr;
  return parseInt(cleaned, 16);
};

export const relayConfig = {
  enabled: env.RELAY_ENABLED,
  numRelays: env.RELAY_NUM_RELAYS,
  maxReconnectAttempts: env.RELAY_RECONNECT_ATTEMPTS,
  // USBRelay8 chip identifiers (HID-based device detection)
  // Stored as numbers for HID device matching
  usbrelayVendorId: parseHexString(env.USBRELAY_VENDOR_ID),
  usbrelayProductId: parseHexString(env.USBRELAY_PRODUCT_ID),
};

export type RelayConfig = typeof relayConfig;
