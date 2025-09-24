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
// Helper function to read actual hardware state (if possible)
const readHardwareState = async (): Promise<Map<number, boolean>> => {
  const hardwareStates = new Map<number, boolean>();

  if (!isConnected()) {
    console.log('🔌 Cannot read hardware state - device not connected');
    return hardwareStates;
  }

  try {
    // Note: USBRelay8 doesn't support reading relay states
    // We'll need to track state changes instead
    console.log('⚠️  USBRelay8 does not support reading relay states');
    console.log('💡 Server will initialize with all relays OFF');

    // Initialize all relays as OFF (hardware state unknown)
    validSlotNumbers.forEach((slotNumber) => {
      hardwareStates.set(slotNumber, false);
    });
  } catch (error) {
    console.error('❌ Error reading hardware state:', error);
  }

  return hardwareStates;
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
    // USBRelay8 uses direct HID commands (no padding needed)
    device.write(command);
    console.log('📤 Sent HID command:', command);
  } catch (error) {
    console.error('❌ Failed to send HID command:', error);
    throw error;
  }
};

const buildRelayCommand = (slotNumber: number, state: boolean): number[] => {
  // USBRelay8 uses specific protocol:
  // Individual relay: [0xFF, relay_number, relay_number, relay_number] for ON
  //                   [0xFD, relay_number, relay_number, relay_number] for OFF
  // All relays:       [0xFE] for ON, [0xFC] for OFF

  if (state) {
    // Turn relay ON
    return [0xff, slotNumber, slotNumber, slotNumber];
  } else {
    // Turn relay OFF
    return [0xfd, slotNumber, slotNumber, slotNumber];
  }
};

// Public API
export const USBRelayService = {
  async initialize(): Promise<boolean> {
    if (!relayConfig.enabled) {
      console.log('🔌 Relay control disabled via configuration');
      return false;
    }

    // Check if already initialized
    if (isConnected()) {
      console.log('🔌 USBRelay service already initialized');
      return false;
    }

    try {
      await connectToRelayBoard();
      console.log('✅ USBRelay service initialized successfully');
      return true;
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
    if (!relayConfig.enabled) {
      console.log(`🔌 All relays would be ${state ? 'ON' : 'OFF'} (disabled)`);
      validSlotNumbers.forEach((slotNumber) => {
        relayStates.set(slotNumber, state);
      });
      return;
    }

    if (!isConnected()) {
      throw new Error('USBRelay8 not connected. Please check hardware connection.');
    }

    try {
      const command = state ? [0xfe] : [0xfc]; // All ON or All OFF
      console.log(`🔌 Sending HID command to all relays: ${state ? 'ON' : 'OFF'}`, command);

      await sendHIDCommand(command);

      // Update all relay states
      validSlotNumbers.forEach((slotNumber) => {
        relayStates.set(slotNumber, state);
      });

      console.log(`✅ All relays set to ${state ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error('❌ Failed to control all relays:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to control all relays: ${errorMessage}`);
    }
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
const initializeRelayStates = async (): Promise<void> => {
  try {
    const hardwareStates = await readHardwareState();

    // Update relay states from hardware (or default to OFF)
    validSlotNumbers.forEach((slotNumber) => {
      const hardwareState = hardwareStates.get(slotNumber) ?? false;
      relayStates.set(slotNumber, hardwareState);
    });

    console.log('🔄 Initialized relay states from hardware');
    console.log(
      '📊 Current states:',
      Array.from(relayStates.entries())
        .map(([slot, state]) => `Relay ${slot}: ${state ? 'ON' : 'OFF'}`)
        .join(', '),
    );
  } catch (error) {
    console.error('❌ Error initializing relay states:', error);
    // Fallback to all OFF
    validSlotNumbers.forEach((slotNumber) => {
      relayStates.set(slotNumber, false);
    });
    console.log('🔄 Fallback: Initialized relay states (all OFF)');
  }
};

initializeRelayStates();
