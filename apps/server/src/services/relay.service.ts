import { SerialPort } from 'serialport';
import { Buffer } from 'buffer';
import { relayConfig } from '../config/relay.config';

export interface RelayState {
  readonly slotNumber: number;
  readonly isOn: boolean;
  readonly lastUpdated: Date;
}

export interface RelayConnectionStatus {
  readonly connected: boolean;
  readonly port?: string;
  readonly error?: string;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

// Internal state
let port: SerialPort | null = null;
const relayStates = new Map<number, boolean>();
let connectionState: ConnectionState = 'disconnected';
let reconnectAttempts = 0;

const validSlotNumbers = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const maxReconnectAttempts = relayConfig.maxReconnectAttempts;

// Helper functions
const initializeRelayStates = (): void => {
  validSlotNumbers.forEach((slotNumber) => {
    relayStates.set(slotNumber, false);
  });
  console.log('🔄 Initialized relay states (all OFF)');
};

const findRelayPort = (ports: any[]): any | undefined => {
  return ports.find(
    (port) =>
      (port.vendorId === relayConfig.ftdiVendorId && port.productId === relayConfig.ftdiProductId) ||
      (port.vendorId === relayConfig.ch340VendorId && port.productId === relayConfig.ch340ProductId) ||
      (port.vendorId === relayConfig.usbrelayVendorId && port.productId === relayConfig.usbrelayProductId),
  );
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

const setupEventHandlers = (): void => {
  if (!port) return;

  port.on('open', () => {
    console.log('✅ Relay board connected successfully');
    connectionState = 'connected';
    reconnectAttempts = 0;
  });

  port.on('error', (error) => {
    console.error('❌ Relay board error:', error);
    connectionState = 'disconnected';
    handleConnectionFailure();
  });

  port.on('close', () => {
    console.log('🔌 Relay board disconnected');
    connectionState = 'disconnected';
    handleConnectionFailure();
  });
};
const openPort = async (): Promise<void> => {
  if (!port) throw new Error('Port not initialized');

  return new Promise<void>((resolve, reject) => {
    port!.open((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const createSerialConnection = async (relayPort: any): Promise<void> => {
  port = new SerialPort({
    path: relayPort.path,
    baudRate: relayConfig.baudRate,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    autoOpen: false,
  });

  setupEventHandlers();
  await openPort();
};

connectToRelayBoard = async (): Promise<void> => {
  if (connectionState === 'connected') return;

  connectionState = 'connecting';
  console.log('🔌 Searching for relay board...');

  try {
    const ports = await SerialPort.list();
    console.log(
      '📋 Available serial ports:',
      ports.map((p) => ({ path: p.path, manufacturer: p.manufacturer })),
    );

    const relayPort = findRelayPort(ports);
    if (!relayPort) {
      throw new Error('No relay board detected. Please check USB connection.');
    }

    console.log('🎯 Found relay board at:', relayPort.path);
    await createSerialConnection(relayPort);
  } catch (error) {
    connectionState = 'disconnected';
    console.error('❌ Failed to connect to relay board:', error);
    throw error;
  }
};

const validateSlotNumber = (slotNumber: number): void => {
  if (!validSlotNumbers.includes(slotNumber as any)) {
    throw new Error(`Invalid slot number: ${slotNumber}. Must be between 1-8.`);
  }
};

const isConnected = (): boolean => {
  return port !== null && connectionState === 'connected';
};

const sendCommand = async (command: Buffer): Promise<void> => {
  if (!port) throw new Error('Port not available');

  return new Promise<void>((resolve, reject) => {
    port!.write(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const buildRelayCommand = (slotNumber: number, state: boolean): Buffer => {
  // For now, we'll use simple all-on/all-off commands
  // Individual relay control requires more specific protocol documentation
  if (state) {
    // Turn all relays ON
    // prettier-ignore
    return Buffer.from([0xFF, 0xFF]);
  } else {
    // Turn all relays OFF
    return Buffer.from([0x00, 0x00]);
  }

  // TODO: Implement individual relay control when protocol is documented
  // This would involve specific byte sequences for each relay
};

// Public API
export const RelayService = {
  async initialize(): Promise<void> {
    if (!relayConfig.enabled) {
      console.log('🔌 Relay control disabled via configuration');
      return;
    }

    try {
      await connectToRelayBoard();
    } catch (error) {
      console.error('❌ Failed to initialize relay service:', error);
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
      throw new Error('Relay board not connected. Please check hardware connection.');
    }

    try {
      const command = buildRelayCommand(slotNumber, state);
      console.log(`🔌 Sending command to relay ${slotNumber}: ${state ? 'ON' : 'OFF'}`, command);

      await sendCommand(command);
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
        port: port?.path,
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
      // After connection attempt, check if we're now connected
      return (connectionState as ConnectionState) === 'connected';
    } catch (error) {
      console.error('❌ Failed to ensure connection:', error);
      return false;
    }
  },

  async disconnect(): Promise<void> {
    if (!port) return;

    return new Promise<void>((resolve) => {
      port!.close(() => {
        console.log('🔌 Relay board disconnected');
        resolve();
      });
    }).finally(() => {
      port = null;
      connectionState = 'disconnected';
    });
  },

  // Utility methods for bulk operations
  async toggleAllRelays(state: boolean): Promise<void> {
    const promises = validSlotNumbers.map((slotNumber) => RelayService.toggleRelay(slotNumber, state));
    await Promise.all(promises);
  },

  async turnAllRelaysOn(): Promise<void> {
    await RelayService.toggleAllRelays(true);
  },

  async turnAllRelaysOff(): Promise<void> {
    await RelayService.toggleAllRelays(false);
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
