import { env } from 'env.server';

export const relayConfig = {
  enabled: env.RELAY_ENABLED,
  numRelays: Number(env.RELAY_NUM_RELAYS),
  port: env.RELAY_PORT,
  baudRate: env.RELAY_BAUD_RATE,
  timeout: env.RELAY_TIMEOUT,
  maxReconnectAttempts: env.RELAY_RECONNECT_ATTEMPTS,
  // FTDI chip identifiers for device detection
  ftdiVendorId: '0403',
  ftdiProductId: '6001',
  // CH340 chip identifiers (alternative)
  ch340VendorId: '1a86',
  ch340ProductId: '7523',
  // USBRelay8 chip identifiers (your board)
  usbrelayVendorId: '16c0',
  usbrelayProductId: '05df',
};

export type RelayConfig = typeof relayConfig;
