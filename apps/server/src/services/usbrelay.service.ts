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

// Internal state - support multiple boards
let device1: any = null; // Board 1 (relays 1-8)
let device2: any = null; // Board 2 (relays 9-16)
const relayStates = new Map<number, boolean>();
let connectionState: ConnectionState = 'disconnected';
let reconnectAttempts = 0;

// Support up to 16 relays (2 boards of 8 each)
// Relay 1-8: Board 1, channels 1-8
// Relay 9-16: Board 2, channels 1-8
const NUM_RELAYS = relayConfig.numRelays;
const validSlotNumbers = Array.from({ length: NUM_RELAYS }, (_, i) => i + 1) as readonly number[];
const maxReconnectAttempts = relayConfig.maxReconnectAttempts;

// USBRelay8 HID protocol constants (from config)
const USBRELAY_VENDOR_ID = relayConfig.usbrelayVendorId;
const USBRELAY_PRODUCT_ID = relayConfig.usbrelayProductId;

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
    // This initializes all 16 relays (both boards)
    validSlotNumbers.forEach((slotNumber) => {
      hardwareStates.set(slotNumber, false);
    });
  } catch (error) {
    console.error('❌ Error reading hardware state:', error);
  }

  return hardwareStates;
};

const findRelayDevices = (): { device1: any; device2: any } => {
  try {
    const devices = HID.devices();
    const relayDevices = devices.filter(
      (device: any) => device.vendorId === USBRELAY_VENDOR_ID && device.productId === USBRELAY_PRODUCT_ID,
    );

    if (relayDevices.length === 0) {
      return { device1: null, device2: null };
    }

    // Log all found devices
    relayDevices.forEach((relayDevice, index) => {
      console.log(`🎯 Found USBRelay8 device ${index + 1}:`, {
        vendorId: relayDevice.vendorId?.toString(16),
        productId: relayDevice.productId?.toString(16),
        manufacturer: relayDevice.manufacturer,
        product: relayDevice.product,
        path: relayDevice.path,
      });
    });

    // Connect to first device (Board 1)
    const device1 = relayDevices[0] ? new HID.HID(relayDevices[0].path!) : null;

    // Connect to second device if available (Board 2)
    const device2 = relayDevices[1] ? new HID.HID(relayDevices[1].path!) : null;

    if (relayDevices.length === 1) {
      console.log('⚠️  Only one USBRelay8 device found. Relays 9-16 will not work.');
    } else if (relayDevices.length >= 2) {
      console.log('✅ Found 2 USBRelay8 devices. Full 16-relay support enabled.');
    }

    return { device1, device2 };
  } catch (error) {
    console.error('❌ Error finding relay devices:', error);
    return { device1: null, device2: null };
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
  console.log('🔌 Searching for USBRelay8 devices...');

  try {
    const { device1: newDevice1, device2: newDevice2 } = findRelayDevices();

    if (!newDevice1) {
      throw new Error('No USBRelay8 device detected. Please check USB connection.');
    }

    device1 = newDevice1;
    device2 = newDevice2;

    connectionState = 'connected';
    reconnectAttempts = 0;

    if (device2) {
      console.log('✅ USBRelay8 boards connected successfully (2 boards, 16 relays)');
    } else {
      console.log('✅ USBRelay8 board connected successfully (1 board, 8 relays)');
    }
  } catch (error) {
    connectionState = 'disconnected';
    console.error('❌ Failed to connect to USBRelay8:', error);
    throw error;
  }
};

const validateSlotNumber = (slotNumber: number): void => {
  if (slotNumber < 1 || slotNumber > NUM_RELAYS) {
    throw new Error(`Invalid slot number: ${slotNumber}. Must be between 1-${NUM_RELAYS}.`);
  }
};

const isConnected = (): boolean => {
  // Connected if at least board 1 is connected
  return device1 !== null && connectionState === 'connected';
};

const getDeviceForRelay = (slotNumber: number): any => {
  // Relays 1-8 use device1 (Board 1)
  // Relays 9-16 use device2 (Board 2)
  if (slotNumber <= 8) {
    return device1;
  } else {
    return device2;
  }
};

const sendHIDCommand = async (command: number[], targetDevice: any): Promise<void> => {
  if (!targetDevice) throw new Error('Device not available');

  try {
    // USBRelay8 uses direct HID commands (no padding needed)
    targetDevice.write(command);
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
  //
  // For 2 boards:
  // Relay 1-8: Board 1, channels 1-8
  // Relay 9-16: Board 2, channels 1-8 (map to 1-8 on board 2)

  // Map relay number to board channel (1-8)
  const boardChannel = slotNumber <= 8 ? slotNumber : slotNumber - 8;

  if (state) {
    // Turn relay ON
    return [0xff, boardChannel, boardChannel, boardChannel];
  } else {
    // Turn relay OFF
    return [0xfd, boardChannel, boardChannel, boardChannel];
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

    // Get the correct device for this relay
    const targetDevice = getDeviceForRelay(slotNumber);
    if (!targetDevice) {
      const boardNum = slotNumber <= 8 ? 1 : 2;
      throw new Error(`Board ${boardNum} not connected. Relay ${slotNumber} requires board ${boardNum}.`);
    }

    try {
      const command = buildRelayCommand(slotNumber, state);
      const boardNum = slotNumber <= 8 ? 1 : 2;
      console.log(
        `🔌 Sending HID command to relay ${slotNumber} (Board ${boardNum}): ${state ? 'ON' : 'OFF'}`,
        command,
      );

      await sendHIDCommand(command, targetDevice);
      relayStates.set(slotNumber, state);
      console.log(`✅ Relay ${slotNumber} (Board ${boardNum}) set to ${state ? 'ON' : 'OFF'}`);
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
      const boards = [];
      if (device1) boards.push('Board 1');
      if (device2) boards.push('Board 2');
      const deviceInfo = boards.length > 0 ? `USBRelay8 (${boards.join(', ')})` : 'USBRelay8 (HID)';
      return {
        connected: true,
        device: deviceInfo,
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
    if (!device1 && !device2) return;

    try {
      if (device1) {
        device1.close();
        console.log('🔌 USBRelay8 Board 1 disconnected');
      }
      if (device2) {
        device2.close();
        console.log('🔌 USBRelay8 Board 2 disconnected');
      }
    } finally {
      device1 = null;
      device2 = null;
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

      // Send command to both boards
      if (device1) {
        await sendHIDCommand(command, device1);
      }
      if (device2) {
        await sendHIDCommand(command, device2);
      }

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
