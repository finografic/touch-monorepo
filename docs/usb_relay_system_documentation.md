# USB Relay Control System Documentation

## Overview

The USB Relay Control System provides hardware control for the HW-554 USB relay board (8 channels) within the Touch Monorepo project. This system enables web-based control of physical relays through a modern React frontend and Node.js backend architecture.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐    USB HID    ┌─────────────────┐
│   React Client  │◄──────────────►│  Node.js Server │◄─────────────►│  HW-554 Board   │
│                 │                │                 │               │  (8 Relays)     │
│ - AdminRelaysPage│                │ - USBRelayService│               │                 │
│ - React Query   │                │ - API Routes    │               │                 │
│ - Smart Polling │                │ - HID Protocol  │               │                 │
└─────────────────┘                └─────────────────┘               └─────────────────┘
```

### Component Relationships

1. **Client-Side (React)**
   - `AdminRelaysPage`: Main UI for relay control
   - `RelayPageWrapper`: Handles lazy initialization
   - React Query hooks: API communication and state management
   - Smart polling: Automatic error handling and recovery

2. **Server-Side (Node.js)**
   - `USBRelayService`: Core hardware communication service
   - API routes: RESTful endpoints for relay control
   - HID protocol: Direct USB communication with hardware

3. **Hardware Layer**
   - HW-554 USB relay board with USBRelay8 chip
   - 8 individual relays (channels 1-8)
   - USB HID interface for communication

## Hardware Communication Protocol

### USBRelay8 HID Protocol

The HW-554 board uses a specific HID protocol for relay control:

#### Device Identification

- **Vendor ID**: `16c0`
- **Product ID**: `05df`
- **Interface**: USB HID (Human Interface Device)

#### Command Structure

| Command | Hex Code | Description |
|---------|----------|-------------|
| Individual ON | `[0xFF, slotNumber, slotNumber, slotNumber]` | Turn specific relay ON |
| Individual OFF | `[0xFD, slotNumber, slotNumber, slotNumber]` | Turn specific relay OFF |
| All ON | `[0xFE]` | Turn all relays ON |
| All OFF | `[0xFC]` | Turn all relays OFF |

#### Example Commands

```javascript
// Turn relay 1 ON
device.write([0xFF, 0x01, 0x01, 0x01]);

// Turn relay 3 OFF
device.write([0xFD, 0x03, 0x03, 0x03]);

// Turn all relays ON
device.write([0xFE]);

// Turn all relays OFF
device.write([0xFC]);
```

## Server-Side Implementation

### USBRelayService

The core service handles all hardware communication:

```typescript
// apps/server/src/services/usbrelay.service.ts
export const USBRelayService = {
  // Initialize connection to hardware
  async initialize(): Promise<boolean> {
    // Auto-detect USBRelay8 device
    // Establish HID connection
    // Return connection status
  },

  // Control individual relays
  async toggleRelay(slotNumber: number, state: boolean): Promise<boolean> {
    // Validate slot number (1-8)
    // Build HID command
    // Send command to hardware
    // Update internal state
  },

  // Bulk operations
  async turnAllRelaysOn(): Promise<boolean> { /* ... */ },
  async turnAllRelaysOff(): Promise<boolean> { /* ... */ },

  // Status and state management
  getRelayStates(): RelayState[] { /* ... */ },
  getStatus(): RelayConnectionStatus { /* ... */ },
  isConnected(): boolean { /* ... */ },
};
```

### API Endpoints

RESTful API endpoints provide web access to relay control:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/relay/init` | POST | Initialize relay service (lazy loading) |
| `/api/relay/toggle/{slotNumber}/{state}` | POST | Toggle individual relay |
| `/api/relay/states` | GET | Get all relay states |
| `/api/relay/status` | GET | Get connection status |
| `/api/relay/all-on` | POST | Turn all relays ON |
| `/api/relay/all-off` | POST | Turn all relays OFF |
| `/api/relay/reconnect` | POST | Manual reconnection |
| `/api/relay/disconnect` | POST | Manual disconnection |

### Error Handling

The service implements comprehensive error handling:

1. **Connection Failures**: Exponential backoff retry strategy
2. **Device Errors**: Graceful degradation with error reporting
3. **Permission Errors**: Clear error messages for HID access issues
4. **Network Errors**: Client-side polling stops automatically

## Client-Side Implementation

### React Query Integration

The client uses React Query for efficient API communication:

```typescript
// Smart polling with automatic error handling
const useGetRelayStates = () => {
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  const query = useQuery({
    queryKey: GET_RELAY_STATES_QUERYKEY,
    queryFn: fetchRelayStates,
    refetchInterval: isPollingEnabled ? 2000 : false, // Smart polling
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Auto-disable polling on network errors
  useEffect(() => {
    if (query.error?.message?.includes('Network Error')) {
      setIsPollingEnabled(false);
    }
  }, [query.error]);

  return { ...query, isPollingEnabled, enablePolling, disablePolling };
};
```

### Smart Polling System

The client implements intelligent polling that:

1. **Automatically stops** when server is unreachable
2. **Provides retry mechanism** for manual reconnection
3. **Shows polling status** in the UI
4. **Resumes polling** when connection is restored

### Lazy Initialization

To prevent race conditions during server startup:

```typescript
// RelayPageWrapper handles initialization when route is accessed
export const RelayPageWrapper: React.FC = () => {
  const initializeMutation = useInitializeRelay();

  useEffect(() => {
    initializeMutation.mutate(); // Initialize on route access
  }, []);

  if (initializeMutation.isPending) {
    return <LoadingState />;
  }

  return <AdminRelaysPage />;
};
```

## Environment Configuration

### Required Environment Variables

```bash
# apps/server/.env
RELAY_ENABLED=true                    # Enable/disable relay control
RELAY_TIMEOUT=5000                   # Connection timeout (ms)
RELAY_RECONNECT_ATTEMPTS=5           # Max reconnection attempts
```

### Device Detection Configuration

```typescript
// apps/server/src/config/relay.config.ts
export const relayConfig = {
  enabled: process.env.RELAY_ENABLED === 'true',
  timeout: Number(process.env.RELAY_TIMEOUT) || 5000,
  maxReconnectAttempts: Number(process.env.RELAY_RECONNECT_ATTEMPTS) || 5,

  // USBRelay8 device identifiers
  usbrelayVendorId: '16c0',
  usbrelayProductId: '05df',

  // Slot mapping (UI slots to physical relays)
  slotMapping: {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8,
  },
};
```

## System Permissions

### macOS Permissions

For HID device access on macOS:

1. **System Preferences** → **Security & Privacy** → **Privacy**
2. **Input Monitoring** → Add Terminal/IDE application
3. **Full Disk Access** → Add Terminal/IDE application (if needed)

### Linux Permissions

For HID device access on Linux:

```bash
# Add user to input group
sudo usermod -a -G input $USER

# Or create udev rule for specific device
echo 'SUBSYSTEM=="hidraw", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", MODE="0666"' | sudo tee /etc/udev/rules.d/99-usbrelay8.rules
sudo udevadm control --reload-rules
```

### Windows Permissions

Windows typically handles HID permissions automatically, but may require:

1. **Device Manager** → Update drivers if needed
2. **Administrator privileges** for Node.js application

## Testing and Development

### Running Tests

```bash
# Run all tests
cd apps/server && pnpm test.run

# Run tests with coverage
cd apps/server && pnpm test.coverage

# Run tests in watch mode
cd apps/server && pnpm test.watch
```

### Test Coverage

The test suite covers:

1. **Service Layer**: USBRelayService functionality
2. **API Handlers**: All endpoint handlers
3. **Error Scenarios**: Device failures, permission errors
4. **Mocking**: Proper mocking of HID dependencies

### Manual Testing

```bash
# Test API endpoints
curl -s http://localhost:4040/api/relay/status
curl -X POST http://localhost:4040/api/relay/toggle/1/true
curl -X POST http://localhost:4040/api/relay/all-off

# Test device detection
lsusb | grep -i "16c0:05df"
```

## Troubleshooting

### Common Issues

1. **Device Not Found**
   - Check USB connection
   - Verify device appears in `lsusb` output
   - Check vendor/product IDs match configuration

2. **Permission Denied**
   - Grant HID device permissions (macOS)
   - Add user to input group (Linux)
   - Run with administrator privileges (Windows)

3. **Connection Failures**
   - Check if device is already in use by another process
   - Restart server to reset connection state
   - Verify external power supply is connected

4. **Polling Issues**
   - Check network connectivity
   - Verify server is running on port 4040
   - Use "Retry Connection" button in UI

### Debug Commands

```bash
# Check device detection
lsusb | grep -i "16c0:05df"

# Test server connectivity
curl -s http://localhost:4040/api/relay/status

# Check server logs
cd apps/server && pnpm dev

# Reset relay board
cd apps/server && pnpm relay.reset
```

## Performance Considerations

### Polling Optimization

- **Smart Polling**: Automatically stops on errors
- **Retry Logic**: Exponential backoff for failed requests
- **Caching**: React Query provides efficient caching
- **Debouncing**: Prevents rapid successive requests

### Resource Management

- **Lazy Loading**: Service initializes only when needed
- **Connection Pooling**: Single HID connection per service instance
- **Memory Management**: Proper cleanup of HID resources
- **Error Recovery**: Automatic reconnection with limits

## Security Considerations

### Access Control

- **Admin Routes**: Relay control restricted to admin users
- **API Validation**: Zod schema validation for all inputs
- **Error Handling**: No sensitive information in error messages

### Hardware Safety

- **State Validation**: Slot numbers validated (1-8)
- **Connection Limits**: Single connection per service
- **Timeout Handling**: Prevents hanging connections
- **Graceful Shutdown**: Proper cleanup on service stop

## Future Enhancements

### Planned Features

1. **WebSocket Integration**: Real-time updates for multiple clients
2. **Scheduled Operations**: Time-based relay control
3. **Logging System**: Comprehensive operation logging
4. **Health Monitoring**: Device health status reporting
5. **Batch Operations**: Complex multi-relay sequences

### Integration Opportunities

1. **Main Application**: Connect to existing slot system
2. **Order Processing**: Automatic relay control based on orders
3. **Timer Integration**: Relay control synchronized with timers
4. **Notification System**: Relay status notifications

---

*This documentation provides a comprehensive guide to understanding, implementing, and maintaining the USB Relay Control System within the Touch Monorepo project.*
