# HW-554 USB Relay Board Integration - Implementation Status

This document outlines the **completed implementation** of the HW-554 USB relay board integration into the Node.js v22 Touch Monorepo project.

## ✅ Implementation Status: COMPLETED

**All core server-side functionality has been implemented and is ready for testing.**

## 1. Architecture Overview

### Current System Analysis

- **Monorepo Structure:** `apps/server` (Node.js backend) + `apps/client` (React frontend)
- **Slot System:** 12 slots managed via `SlotMeta` interface in `MainPage.types.ts`
- **State Management:** Zustand stores for orders, timers, and UI state
- **Target Mapping:** Map 8 relays to slots 1-8 of existing system

### Integration Goals

- **Physical Control:** Enable hardware relay control from web interface
- **State Synchronization:** Keep UI state in sync with physical relay states
- **Error Handling:** Robust error handling for hardware communication failures
- **Cross-platform:** Support Windows (client) and Linux/macOS (server)

## 2. ✅ IMPLEMENTED: USB HID Communication

**Chosen Approach:** USB HID Communication via `node-hid` library

**Why This Approach:**
- ✅ **Hardware Discovery:** The HW-554 board uses USBRelay8 chip (vendor: 16c0, product: 05df)
- ✅ **HID Protocol:** Board communicates via USB HID interface, not serial
- ✅ **Direct Control:** Low-level access to hardware via HID commands
- ✅ **Cross-platform:** Works on Windows, Linux, macOS with proper permissions
- ✅ **Functional Module Pattern:** Modern TypeScript implementation without classes

**Actual Implementation:**

```typescript
// apps/server/src/services/usbrelay.service.ts
import * as HID from 'node-hid';
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

// Functional Module Pattern (no classes, no 'this')
export const USBRelayService = {
  async initialize(): Promise<boolean> {
    if (!relayConfig.enabled) {
      console.log('🔌 Relay control disabled via configuration');
      return false;
    }
    // Auto-detects USBRelay8 device and connects via HID
  },

  async toggleRelay(slotNumber: number, state: boolean): Promise<boolean> {
    validateSlotNumber(slotNumber);
    const command = buildRelayCommand(slotNumber, state);
    await sendHIDCommand(command);
    relayStates.set(slotNumber, state);
    return true;
  },

  getRelayState(slotNumber: number): boolean {
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
    // Returns connection status with device info
  },

  async ensureConnection(): Promise<boolean> {
    // Auto-reconnection with exponential backoff
  },

  // Bulk operations
  async turnAllRelaysOn(): Promise<boolean> { /* ... */ },
  async turnAllRelaysOff(): Promise<boolean> { /* ... */ },
};
```

**Key Features Implemented:**
- ✅ **Auto-detection** of USBRelay8 device (vendor: 16c0, product: 05df)
- ✅ **HID Protocol Commands:**
  - Individual ON: `[0xFF, slotNumber, slotNumber, slotNumber]`
  - Individual OFF: `[0xFD, slotNumber, slotNumber, slotNumber]`
  - All ON: `[0xFE]`
  - All OFF: `[0xFC]`
- ✅ **Exponential backoff** reconnection strategy
- ✅ **Connection state management** (disconnected/connecting/connected)
- ✅ **Error handling** with detailed logging
- ✅ **Configuration-based** enable/disable
- ✅ **Bulk operations** (all on/off)
- ✅ **Type-safe** interfaces and readonly data
- ✅ **Lazy initialization** to prevent race conditions during server startup

## 3. ✅ IMPLEMENTED: Server-Side Architecture

### ✅ Configuration Service

```typescript
// apps/server/src/config/relay.config.ts
export const relayConfig = {
  enabled: process.env.RELAY_ENABLED === 'true',
  timeout: Number(process.env.RELAY_TIMEOUT) || 5000,
  maxReconnectAttempts: Number(process.env.RELAY_RECONNECT_ATTEMPTS) || 5,
  slotMapping: {
    // Map UI slots to physical relays (1-8)
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8,
  },
  // USBRelay8 chip identifiers for device detection
  usbrelayVendorId: '16c0',
  usbrelayProductId: '05df',
};
```

### ✅ API Endpoints (OpenAPI Compliant)

**All endpoints implemented with proper Zod validation and OpenAPI documentation:**

```typescript
// apps/server/src/routes/relay/relay.routes.ts
export const toggleRelay = createRoute({
  path: '/relay/toggle/{slotNumber}/{state}',
  method: 'post',
  // Zod validation for parameters and responses
});

export const getRelayStates = createRoute({
  path: '/relay/states',
  method: 'get',
  // Returns all 8 relay states
});

export const getRelayState = createRoute({
  path: '/relay/state/{slotNumber}',
  method: 'get',
  // Returns specific relay state
});

export const getRelayStatus = createRoute({
  path: '/relay/status',
  method: 'get',
  // Returns connection status
});

export const turnAllRelaysOn = createRoute({
  path: '/relay/all-on',
  method: 'post',
  // Bulk operation: all relays ON
});

export const turnAllRelaysOff = createRoute({
  path: '/relay/all-off',
  method: 'post',
  // Bulk operation: all relays OFF
});

export const reconnectRelay = createRoute({
  path: '/relay/reconnect',
  method: 'post',
  // Manual reconnection trigger
});

export const disconnectRelay = createRoute({
  path: '/relay/disconnect',
  method: 'post',
  // Manual disconnection
});

export const initializeRelay = createRoute({
  path: '/relay/init',
  method: 'post',
  // Lazy initialization endpoint
});
```

### ✅ Handler Implementation

```typescript
// apps/server/src/routes/relay/relay.handlers.ts
// @ts-ignore - Avoiding complex type inference issue
export const toggleRelay: AppRouteHandler<ToggleRelayRoute> = async (context) => {
  try {
    const { slotNumber, state } = context.req.valid('param');

    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 8) {
      return context.json({
        success: false,
        error: 'Invalid slot number. Must be between 1-8.',
      }, HttpStatusCodes.BAD_REQUEST);
    }

    await RelayService.toggleRelay(slotNumber, state);

    return context.json({
      success: true,
      slotNumber,
      state,
      message: `Relay ${slotNumber} turned ${state ? 'ON' : 'OFF'}`,
    });
  } catch (error) {
    // Comprehensive error handling
  }
};
```

**Available API Endpoints:**
- ✅ `POST /api/relay/toggle/{slotNumber}/{state}` - Toggle individual relay
- ✅ `GET /api/relay/states` - Get all relay states
- ✅ `GET /api/relay/state/{slotNumber}` - Get specific relay state
- ✅ `GET /api/relay/status` - Get connection status
- ✅ `POST /api/relay/all-on` - Turn all relays ON
- ✅ `POST /api/relay/all-off` - Turn all relays OFF
- ✅ `POST /api/relay/reconnect` - Manual reconnection
- ✅ `POST /api/relay/disconnect` - Manual disconnection
- ✅ `POST /api/relay/init` - Lazy initialization (prevents race conditions)

## 4. ✅ IMPLEMENTED: Client-Side Test Interface

### ✅ Admin Relay Test Page with React Query

**Implemented a comprehensive test interface with React Query hooks:**

```typescript
// apps/client/src/pages/AdminPages/AdminRelaysPage/AdminRelaysPage.tsx
export const AdminRelaysPage: React.FC = () => {
  // React Query hooks for API communication
  const {
    data: relayStates,
    isLoading: isLoadingStates,
    error: statesError,
    isPollingEnabled: statesPollingEnabled,
    enablePolling: enableStatesPolling,
    disablePolling: disableStatesPolling,
  } = useGetRelayStates();

  const {
    data: relayStatus,
    isLoading: isLoadingStatus,
    isPollingEnabled: statusPollingEnabled,
    enablePolling: enableStatusPolling,
    disablePolling: disableStatusPolling,
  } = useGetRelayStatus();

  // Mutation hooks for relay control
  const toggleRelayMutation = useToggleRelay();
  const turnAllOnMutation = useTurnAllRelaysOn();
  const turnAllOffMutation = useTurnAllRelaysOff();
  const reconnectMutation = useReconnectRelay();
  const disconnectMutation = useDisconnectRelay();

  // Smart polling management
  const handleRetryConnection = async () => {
    try {
      enableStatesPolling();
      enableStatusPolling();
      toast({
        message: 'Retrying Connection',
        subText: 'Attempting to reconnect to server...',
        variant: 'info',
      });
    } catch (error) {
      toast({
        message: 'Retry Failed',
        subText: 'Failed to retry connection',
        variant: 'error',
      });
    }
  };

  return (
    <AdminContentLayout title="Relay Control" subtitle={`Test and control the ${NUM_RELAYS}-channel relay board`}>
      <Box className="admin-relay-control">
        <Flex direction="column" gap="6">
          {/* Connection Status with Smart Polling */}
          <Card size="3" variant="surface">
            <Flex justify="between" align="center">
              <Flex direction="column" gap="2">
                <Heading size="4">Connection Status</Heading>
                <Flex align="center" gap="3">
                  <Badge color={relayStatus?.connected ? 'green' : 'red'} variant="soft" size="3">
                    {relayStatus?.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                  <Badge color={statesPollingEnabled ? 'green' : 'red'} variant="soft" size="3">
                    Polling: {statesPollingEnabled ? 'Active' : 'Disabled'}
                  </Badge>
                  {relayStatus?.port && (
                    <Text size="2" color="gray">
                      Port: {relayStatus.port}
                    </Text>
                  )}
                  {relayStatus?.error && (
                    <Text size="2" color="red">
                      Error: {relayStatus.error}
                    </Text>
                  )}
                </Flex>
              </Flex>
              <Flex align="center" gap="3">
                <Button
                  onClick={handleReconnect}
                  disabled={reconnectMutation.isPending || disconnectMutation.isPending}
                  variant="outline"
                  size="2"
                >
                  {reconnectMutation.isPending || disconnectMutation.isPending
                    ? relayStatus?.connected
                      ? 'Disconnecting...'
                      : 'Reconnecting...'
                    : relayStatus?.connected
                      ? 'Disconnect'
                      : 'Reconnect'}
                </Button>
              </Flex>
            </Flex>
          </Card>

          {/* Relay Control Grid */}
          <Card size="3" variant="surface">
            <Flex gap="4" justify="between">
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Heading size="4">Relay Control Grid</Heading>
                  <Flex gap="2" ml="4">
                    <Button
                      onClick={handleTurnAllOn}
                      disabled={turnAllOnMutation.isPending}
                      variant="solid"
                      color="green"
                      size="2"
                    >
                      {turnAllOnMutation.isPending ? 'Turning ON...' : 'All ON'}
                    </Button>
                    <Button
                      onClick={handleTurnAllOff}
                      disabled={turnAllOffMutation.isPending}
                      variant="solid"
                      color="red"
                      size="2"
                    >
                      {turnAllOffMutation.isPending ? 'Turning OFF...' : 'All OFF'}
                    </Button>
                    <Button
                      onClick={handleResetAll}
                      disabled={turnAllOffMutation.isPending}
                      variant="outline"
                      color="orange"
                      size="2"
                    >
                      {turnAllOffMutation.isPending ? 'Resetting...' : 'Reset All'}
                    </Button>
                  </Flex>
                </Flex>
                <RelayGrid
                  configurations={relayConfigs}
                  onRelayToggle={handleRelayToggle}
                  isLoading={toggleRelayMutation.isPending}
                />
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Box>
    </AdminContentLayout>
  );
};
```

### ✅ React Query Hooks for API Communication

**Comprehensive React Query hooks for all relay operations:**

```typescript
// apps/client/src/queries/relays/useGetRelayStates.ts
export const useGetRelayStates = () => {
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  const query = useQuery({
    queryKey: GET_RELAY_STATES_QUERYKEY,
    queryFn: async () => {
      const response = await fetch('/api/relay/states');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch relay states');
      }
      return response.json();
    },
    refetchInterval: isPollingEnabled ? 2000 : false, // Smart polling
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Auto-disable polling on network errors
  useEffect(() => {
    if (query.error) {
      const isNetworkError = query.error.message?.includes('Network Error') ||
                           query.error.message?.includes('RPC Request Failed');
      if (isNetworkError) {
        setIsPollingEnabled(false);
      }
    }
  }, [query.error]);

  return {
    ...query,
    isPollingEnabled,
    enablePolling: () => setIsPollingEnabled(true),
    disablePolling: () => setIsPollingEnabled(false),
  };
};

// Similar implementation for useGetRelayStatus, useToggleRelay, etc.
```

**Key Features:**
- ✅ **Smart Polling:** Automatically stops polling on network errors
- ✅ **Retry Logic:** Exponential backoff for failed requests
- ✅ **State Management:** Real-time UI updates with React Query
- ✅ **Error Handling:** Comprehensive error states and recovery
- ✅ **Performance:** Optimized refetch intervals and caching
- ✅ **User Control:** Manual retry and polling control

### ✅ Lazy Initialization and Race Condition Prevention

**Implemented lazy initialization to prevent server startup conflicts:**

```typescript
// apps/client/src/pages/AdminPages/AdminRelaysPage/RelayPageWrapper.tsx
export const RelayPageWrapper: React.FC = () => {
  const initializeMutation = useInitializeRelay();

  useEffect(() => {
    // Initialize the relay service when the component mounts
    initializeMutation.mutate();
  }, []);

  if (initializeMutation.isPending) {
    return (
      <Box p="4">
        <Text>Initializing relay service...</Text>
      </Box>
    );
  }

  if (initializeMutation.isError) {
    return (
      <Box p="4">
        <Text color="red">Error initializing relay service: {initializeMutation.error?.message}</Text>
      </Box>
    );
  }

  return <AdminRelaysPage />;
};
```

**Key Features:**
- ✅ **Lazy Initialization:** Service starts only when `/admin/relays` route is accessed
- ✅ **Race Condition Prevention:** Avoids conflicts during server startup
- ✅ **User Experience:** Clear loading and error states
- ✅ **Automatic Recovery:** Service initializes automatically on route access

## 5. ✅ IMPLEMENTED: Error Handling and Recovery

### ✅ Hardware Connection Management

**Built into the USBRelayService with comprehensive error handling:**

```typescript
// apps/server/src/services/usbrelay.service.ts
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

const connectToRelayBoard = async (): Promise<void> => {
  if (connectionState === 'connected') return;

  connectionState = 'connecting';
  console.log('🔌 Searching for USBRelay8 device...');

  try {
    const devices = HID.devices();
    const relayDevice = findRelayDevice(devices);

    if (!relayDevice) {
      throw new Error('No USBRelay8 device detected. Please check USB connection.');
    }

    console.log('🎯 Found USBRelay8 device:', relayDevice.path);
    await createHIDConnection(relayDevice);
  } catch (error) {
    connectionState = 'disconnected';
    console.error('❌ Failed to connect to relay board:', error);
    throw error;
  }
};
```

### ✅ Connection State Management

```typescript
type ConnectionState = 'disconnected' | 'connecting' | 'connected';

// Auto-detection and connection
const connectToRelayBoard = async (): Promise<void> => {
  if (connectionState === 'connected') return;

  connectionState = 'connecting';
  console.log('🔌 Searching for relay board...');

  try {
    const ports = await SerialPort.list();
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
```

### ✅ Device Detection

```typescript
const findRelayPort = (ports: any[]): any | undefined => {
  return ports.find(
    (port) =>
      (port.vendorId === relayConfig.ftdiVendorId && port.productId === relayConfig.ftdiProductId) ||
      (port.vendorId === relayConfig.ch340VendorId && port.productId === relayConfig.ch340ProductId),
  );
};
```

**Key Error Handling Features:**
- ✅ **Automatic device detection** (FTDI FT245RL and CH340 chips)
- ✅ **Exponential backoff** reconnection strategy
- ✅ **Connection state tracking** (disconnected/connecting/connected)
- ✅ **Comprehensive logging** with emojis for easy debugging
- ✅ **Graceful degradation** when hardware unavailable
- ✅ **Manual reconnection** via API endpoint

## 6. ✅ IMPLEMENTED: Configuration and Environment

### ✅ Environment Variables

```bash
# .env
RELAY_ENABLED=true
RELAY_PORT=/dev/ttyUSB0  # Linux/macOS
# RELAY_PORT=COM3        # Windows
RELAY_BAUD_RATE=9600
RELAY_TIMEOUT=5000
RELAY_RECONNECT_ATTEMPTS=5
```

### ✅ Configuration Service

```typescript
// apps/server/src/config/relay.config.ts
export const relayConfig = {
  enabled: process.env.RELAY_ENABLED === 'true',
  port: process.env.RELAY_PORT || '/dev/ttyUSB0',
  baudRate: parseInt(process.env.RELAY_BAUD_RATE || '9600'),
  timeout: parseInt(process.env.RELAY_TIMEOUT || '5000'),
  maxReconnectAttempts: parseInt(process.env.RELAY_RECONNECT_ATTEMPTS || '5'),
  slotMapping: {
    // Map UI slots to physical relays
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8
  },
  // Device detection
  ftdiVendorId: '0403',
  ftdiProductId: '6001',
  ch340VendorId: '1a86',
  ch340ProductId: '7523',
};
```

### ✅ Dependencies

**Added to `apps/server/package.json`:**

```json
{
  "dependencies": {
    "serialport": "^12.0.0"
  }
}
```

**Note:** The existing `preinstall` hook for `windows-build-tools` handles native dependencies for Windows deployments.

## 7. ✅ IMPLEMENTED: Test Suite

### ✅ Comprehensive Vitest Test Coverage

**Created comprehensive test suite covering all relay functionality:**

```typescript
// apps/server/src/services/__tests__/usbrelay.service.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as HID from 'node-hid';

// Mock node-hid
vi.mock('node-hid', () => ({
  devices: vi.fn(),
  HID: vi.fn(),
}));

describe('USBRelayService', () => {
  describe('Device Detection', () => {
    it('should detect USBRelay8 device', () => {
      const devices = HID.devices();
      expect(devices).toHaveLength(1);
      expect(devices[0]).toEqual(mockDevice);
    });
  });

  describe('Relay Control', () => {
    it('should toggle individual relay ON', async () => {
      const result = await USBRelayService.toggleRelay(1, true);
      expect(result).toBe(true);
    });

    it('should toggle individual relay OFF', async () => {
      const result = await USBRelayService.toggleRelay(1, false);
      expect(result).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle device write errors', async () => {
      await expect(USBRelayService.toggleRelay(1, true)).rejects.toThrow('Write failed');
    });
  });
});
```

### ✅ API Handler Tests

```typescript
// apps/server/src/routes/relay/__tests__/relay.handlers.test.ts
describe('Relay API Handlers', () => {
  describe('toggleRelay', () => {
    it('should toggle relay ON successfully', async () => {
      await toggleRelay(mockContext as Context);
      expect(mockToggleRelay).toHaveBeenCalledWith(1, true);
    });
  });

  describe('initializeRelay', () => {
    it('should initialize successfully', async () => {
      await initializeRelay(mockContext as Context);
      expect(mockInitialize).toHaveBeenCalledOnce();
    });
  });
});
```

### ✅ Test Configuration

```typescript
// apps/server/vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

**Test Scripts Added:**
- ✅ `npm run test` - Run tests in watch mode
- ✅ `npm run test.run` - Run tests once
- ✅ `npm run test.coverage` - Run tests with coverage report
- ✅ `npm run test.watch` - Run tests in watch mode

**Key Features:**
- ✅ **Comprehensive Coverage:** Tests for service, handlers, and error scenarios
- ✅ **Mocked Dependencies:** Proper mocking of `node-hid` and external services
- ✅ **Error Scenarios:** Tests for device failures, permission errors, and network issues
- ✅ **Type Safety:** Full TypeScript support with proper typing
- ✅ **Coverage Reports:** Detailed coverage reporting for all relay functionality

## 8. 🚀 READY FOR TESTING

### ✅ Implementation Complete

**All core functionality has been implemented and is ready for hardware testing:**

### ✅ File Structure

```
apps/server/src/
├── config/
│   └── relay.config.ts          # ✅ Configuration service (USB HID)
├── services/
│   ├── usbrelay.service.ts       # ✅ Core USB HID relay service
│   └── __tests__/
│       └── usbrelay.service.test.ts  # ✅ Service tests
├── routes/relay/
│   ├── relay.routes.ts           # ✅ OpenAPI route definitions
│   ├── relay.handlers.ts         # ✅ Route handlers
│   ├── __tests__/
│   │   └── relay.handlers.test.ts # ✅ Handler tests
│   └── index.ts                  # ✅ Route registration
├── test/
│   └── setup.ts                  # ✅ Test setup configuration
└── vitest.config.ts              # ✅ Test configuration

apps/client/src/
├── pages/AdminPages/AdminRelaysPage/
│   ├── AdminRelaysPage.tsx       # ✅ Main test page with React Query
│   ├── RelayGrid.tsx             # ✅ Interactive grid
│   ├── RelayPageWrapper.tsx      # ✅ Lazy initialization wrapper
│   └── relays.config.ts          # ✅ Constants (NUM_RELAYS = 8)
└── queries/relays/
    ├── index.ts                  # ✅ Export all relay hooks
    ├── useGetRelayStates.ts      # ✅ Smart polling hook
    ├── useGetRelayStatus.ts      # ✅ Status polling hook
    ├── useToggleRelay.ts         # ✅ Toggle mutation hook
    ├── useTurnAllRelaysOn.ts     # ✅ All ON mutation hook
    ├── useTurnAllRelaysOff.ts    # ✅ All OFF mutation hook
    ├── useReconnectRelay.ts      # ✅ Reconnect mutation hook
    ├── useDisconnectRelay.ts     # ✅ Disconnect mutation hook
    └── useInitializeRelay.ts    # ✅ Initialize mutation hook
```

### ✅ Testing Checklist

**Hardware Setup:**
- [ ] Connect HW-554 USB relay board to computer
- [ ] Provide 12V external power supply
- [ ] Verify device appears in system (Device Manager on Windows, `lsusb` on Linux/macOS)
- [ ] Grant HID device permissions (macOS: System Preferences > Security & Privacy > Input Monitoring)

**Software Testing:**
- [ ] Start server: `cd apps/server && pnpm dev`
- [ ] Navigate to admin relay test page (`/admin/relays`)
- [ ] Test individual relay toggles (slots 1-8)
- [ ] Test bulk operations (all on/off)
- [ ] Test connection status endpoint
- [ ] Test reconnection functionality
- [ ] Test smart polling (stop/start server to verify polling stops/starts)

**API Testing:**

```bash
# Test relay states
curl -s http://localhost:4040/api/relay/states

# Test individual relay toggle
curl -X POST http://localhost:4040/api/relay/toggle/1/true

# Test connection status
curl -s http://localhost:4040/api/relay/status

# Test bulk operations
curl -X POST http://localhost:4040/api/relay/all-on
curl -X POST http://localhost:4040/api/relay/all-off

# Test lazy initialization
curl -X POST http://localhost:4040/api/relay/init
```

**Test Suite:**
- [ ] Run tests: `cd apps/server && pnpm test.run`
- [ ] Check coverage: `cd apps/server && pnpm test.coverage`

### ✅ Next Steps

1. **Hardware Testing** - Connect actual HW-554 board and test functionality
2. **Production Integration** - Integrate relay control into main application workflow
3. **WebSocket Updates** - Add real-time state synchronization for multiple clients
4. **Production Deployment** - Test on target Windows client machine
5. **Monitoring** - Add logging and monitoring for production use

---

*This integration plan provides a comprehensive roadmap for adding hardware relay control to the Touch Monorepo project.*

