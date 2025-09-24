import * as HID from 'node-hid';
import { relayConfig } from '../config/relay.config';

export interface RelayState {
  readonly slotNumber: number;
  readonly isOn: boolean;
  readonly lastUpdated: Date;
}

export interface RelayConnectionStatus {
  readonly connected: boolean;
  readonly device?: string;
  readonly error?: string;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

// Internal state
let device: any = null;
const relayStates = new Map<number, boolean>();
let connectionState: ConnectionState = 'disconnected';
let reconnectAttempts = 0;

const validSlotNumbers = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const maxReconnectAttempts = relayConfig.maxReconnectAttempts;

// USBRelay8 HID protocol constants
const USBRELAY_VENDOR_ID = 0x16c0;
const USBRELAY_PRODUCT_ID = 0x05df;

// Helper functions
const initializeRelayStates = (): void => {
  validSlotNumbers.forEach((slotNumber) => {
    relayStates.set(slotNumber, false);
  });
  console.log('🔄 Initialized relay states (all OFF)');
};

const findRelayDevice = (): any => {
  try {
    const devices = HID.devices();
    const relayDevice = devices.find(
      (device: any) => device.vendorId === USBRELAY_VENDOR_ID && device.productId === USBRELAY_PRODUCT_ID,
    );

    if (!relayDevice) {
      return null;
    }

    console.log('🎯 Found USBRelay8 device:', {
      vendorId: relayDevice.vendorId?.toString(16),
      productId: relayDevice.productId?.toString(16),
      manufacturer: relayDevice.manufacturer,
      product: relayDevice.product,
      path: relayDevice.path,
    });

    return new HID.HID(relayDevice.path!);
  } catch (error) {
    console.error('❌ Error finding relay device:', error);
    return null;
  }
};

// Forward declaration
let connectToRelayBoard: () => Promise<void>;

const handleConnectionFailure = (): void => {
  reconnectAttempts++;
  if (reconnectAttempts < maxReconnectAttempts) {
    const delay = 2 ** reconnectAttempts * 1000; // Exponential backoff
    console.log(
      `🔄 Attempting reconnection in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`,
    );
    setTimeout(() => connectToRelayBoard(), delay);
  } else {
    console.error('❌ Max reconnection attempts reached. Relay board unavailable.');
  }
};

connectToRelayBoard = async (): Promise<void> => {
  if (connectionState === 'connected') return;

  connectionState = 'connecting';
  console.log('🔌 Searching for USBRelay8 device...');

  try {
    device = findRelayDevice();
    if (!device) {
      throw new Error('No USBRelay8 device detected. Please check USB connection.');
    }

    connectionState = 'connected';
    reconnectAttempts = 0;
    console.log('✅ USBRelay8 connected successfully');
  } catch (error) {
    connectionState = 'disconnected';
    console.error('❌ Failed to connect to USBRelay8:', error);
    throw error;
  }
};

const validateSlotNumber = (slotNumber: number): void => {
  if (!validSlotNumbers.includes(slotNumber as any)) {
    throw new Error(`Invalid slot number: ${slotNumber}. Must be between 1-8.`);
  }
};

const isConnected = (): boolean => {
  return device !== null && connectionState === 'connected';
};

const sendHIDCommand = async (command: number[]): Promise<void> => {
  if (!device) throw new Error('Device not available');

  try {
    // USBRelay8 typically uses 8-byte HID reports
    // Format: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, relay_mask]
    const report = new Array(8).fill(0);
    report[7] = command[0] || 0; // Relay mask in last byte

    device.write(report);
    console.log('📤 Sent HID command:', report);
  } catch (error) {
    console.error('❌ Failed to send HID command:', error);
    throw error;
  }
};

const buildRelayCommand = (slotNumber: number, state: boolean): number[] => {
  // USBRelay8 uses bitmask for relay control
  // Each relay corresponds to a bit position (0-7 for relays 1-8)
  const bitPosition = slotNumber - 1; // Convert 1-8 to 0-7
  const relayMask = 1 << bitPosition;

  if (state) {
    // Turn relay ON - set the bit
    return [relayMask];
  } else {
    // Turn relay OFF - clear the bit
    return [0];
  }
};

// Public API
export const USBRelayService = {
  async initialize(): Promise<void> {
    if (!relayConfig.enabled) {
      console.log('🔌 Relay control disabled via configuration');
      return;
    }

    try {
      await connectToRelayBoard();
    } catch (error) {
      console.error('❌ Failed to initialize USBRelay service:', error);
      throw error;
    }
  },

  async toggleRelay(slotNumber: number, state: boolean): Promise<void> {
    validateSlotNumber(slotNumber);

    if (!relayConfig.enabled) {
      console.log(`🔌 Relay ${slotNumber} would be ${state ? 'ON' : 'OFF'} (disabled)`);
      relayStates.set(slotNumber, state);
      return;
    }

    if (!isConnected()) {
      throw new Error('USBRelay8 not connected. Please check hardware connection.');
    }

    try {
      const command = buildRelayCommand(slotNumber, state);
      console.log(`🔌 Sending HID command to relay ${slotNumber}: ${state ? 'ON' : 'OFF'}`, command);

      await sendHIDCommand(command);
      relayStates.set(slotNumber, state);
      console.log(`✅ Relay ${slotNumber} set to ${state ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error(`❌ Failed to control relay ${slotNumber}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to control relay ${slotNumber}: ${errorMessage}`);
    }
  },

  getRelayState(slotNumber: number): boolean {
    validateSlotNumber(slotNumber);
    return relayStates.get(slotNumber) ?? false;
  },

  getAllRelayStates(): readonly RelayState[] {
    return validSlotNumbers.map((slotNumber) => ({
      slotNumber,
      isOn: relayStates.get(slotNumber) ?? false,
      lastUpdated: new Date(),
    }));
  },

  getConnectionStatus(): RelayConnectionStatus {
    if (!relayConfig.enabled) {
      return { connected: false, error: 'Relay control disabled' };
    }

    if (connectionState === 'connected') {
      return {
        connected: true,
        device: 'USBRelay8 (HID)',
      };
    }

    return {
      connected: false,
      error: `Connection state: ${connectionState}`,
    };
  },

  async ensureConnection(): Promise<boolean> {
    if (!relayConfig.enabled) {
      console.log('🔌 Relay control disabled - cannot ensure connection');
      return false;
    }

    if (connectionState === 'connected') return true;

    try {
      await connectToRelayBoard();
      return (connectionState as ConnectionState) === 'connected';
    } catch (error) {
      console.error('❌ Failed to ensure connection:', error);
      return false;
    }
  },

  async disconnect(): Promise<void> {
    if (!device) return;

    try {
      device.close();
      console.log('🔌 USBRelay8 disconnected');
    } finally {
      device = null;
      connectionState = 'disconnected';
    }
  },

  // Utility methods for bulk operations
  async toggleAllRelays(state: boolean): Promise<void> {
    const promises = validSlotNumbers.map((slotNumber) => USBRelayService.toggleRelay(slotNumber, state));
    await Promise.all(promises);
  },

  async turnAllRelaysOn(): Promise<void> {
    await USBRelayService.toggleAllRelays(true);
  },

  async turnAllRelaysOff(): Promise<void> {
    await USBRelayService.toggleAllRelays(false);
  },

  // Getters for readonly access
  get isEnabled(): boolean {
    return relayConfig.enabled;
  },

  get currentConnectionState(): ConnectionState {
    return connectionState;
  },

  get relayCount(): number {
    return validSlotNumbers.length;
  },
};

// Initialize relay states on module load
initializeRelayStates();
