import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as HID from 'node-hid';

// Mock node-hid
vi.mock('node-hid', () => ({
  devices: vi.fn(),
  HID: vi.fn(),
}));

// Mock the USBRelayService module
vi.mock('../usbrelay.service', async () => {
  const actual = await vi.importActual('../usbrelay.service');
  return {
    ...actual,
    USBRelayService: {
      initialize: vi.fn(),
      toggleRelay: vi.fn(),
      toggleAllRelays: vi.fn(),
      getRelayStates: vi.fn(),
      getStatus: vi.fn(),
      disconnect: vi.fn(),
      isConnected: vi.fn(),
    },
  };
});

import { USBRelayService } from '../usbrelay.service';

describe('USBRelayService', () => {
  let mockDevice: any;
  let mockHID: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock device
    mockDevice = {
      path: '/dev/hidraw0',
      vendorId: '16c0',
      productId: '05df',
      manufacturer: '16c0',
      product: 'USBRelay8',
      serialNumber: 'test-serial',
    };

    // Mock HID instance
    mockHID = {
      write: vi.fn(),
      close: vi.fn(),
    };

    // Setup HID mocks
    vi.mocked(HID.devices).mockReturnValue([mockDevice]);
    vi.mocked(HID.HID).mockImplementation(() => mockHID);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Device Detection', () => {
    it('should detect USBRelay8 device', () => {
      const devices = HID.devices();
      expect(devices).toHaveLength(1);
      expect(devices[0]).toEqual(mockDevice);
    });

    it('should handle no devices found', () => {
      vi.mocked(HID.devices).mockReturnValue([]);
      const devices = HID.devices();
      expect(devices).toHaveLength(0);
    });
  });

  describe('Initialization', () => {
    it('should initialize successfully when device is available', async () => {
      const mockInitialize = vi.mocked(USBRelayService.initialize);
      mockInitialize.mockResolvedValue(true);

      const result = await USBRelayService.initialize();
      expect(result).toBe(true);
      expect(mockInitialize).toHaveBeenCalledOnce();
    });

    it('should handle initialization failure', async () => {
      const mockInitialize = vi.mocked(USBRelayService.initialize);
      mockInitialize.mockRejectedValue(new Error('Device not found'));

      await expect(USBRelayService.initialize()).rejects.toThrow('Device not found');
    });
  });

  describe('Relay Control', () => {
    beforeEach(() => {
      // Mock successful initialization
      vi.mocked(USBRelayService.getConnectionStatus).mockReturnValue({ connected: true });
    });

    it('should toggle individual relay ON', async () => {
      const mockToggleRelay = vi.mocked(USBRelayService.toggleRelay);
      mockToggleRelay.mockResolvedValue(undefined);

      const result = await USBRelayService.toggleRelay(1, true);
      expect(result).toBe(true);
      expect(mockToggleRelay).toHaveBeenCalledWith(1, true);
    });

    it('should toggle individual relay OFF', async () => {
      const mockToggleRelay = vi.mocked(USBRelayService.toggleRelay);
      mockToggleRelay.mockResolvedValue(undefined);

      const result = await USBRelayService.toggleRelay(1, false);
      expect(result).toBe(true);
      expect(mockToggleRelay).toHaveBeenCalledWith(1, false);
    });

    it('should handle invalid relay number', async () => {
      const mockToggleRelay = vi.mocked(USBRelayService.toggleRelay);
      mockToggleRelay.mockRejectedValue(new Error('Invalid relay number'));

      await expect(USBRelayService.toggleRelay(0, true)).rejects.toThrow('Invalid relay number');
      await expect(USBRelayService.toggleRelay(9, true)).rejects.toThrow('Invalid relay number');
    });

    it('should turn all relays ON', async () => {
      const mockToggleAllRelays = vi.mocked(USBRelayService.toggleAllRelays);
      mockToggleAllRelays.mockResolvedValue(undefined);

      const result = await USBRelayService.toggleAllRelays(true);
      expect(result).toBe(true);
      expect(mockToggleAllRelays).toHaveBeenCalledWith(true);
    });

    it('should turn all relays OFF', async () => {
      const mockToggleAllRelays = vi.mocked(USBRelayService.toggleAllRelays);
      mockToggleAllRelays.mockResolvedValue(undefined);

      const result = await USBRelayService.toggleAllRelays(false);
      expect(result).toBe(true);
      expect(mockToggleAllRelays).toHaveBeenCalledWith(false);
    });
  });

  describe('Status and State Management', () => {
    it('should get relay states', async () => {
      const mockStates = [
        { slotNumber: 1, isOn: false, lastUpdated: new Date() },
        { slotNumber: 2, isOn: true, lastUpdated: new Date() },
        { slotNumber: 3, isOn: false, lastUpdated: new Date() },
      ];
      const mockGetRelayStates = vi.mocked(USBRelayService.getAllRelayStates);
      mockGetRelayStates.mockReturnValue(mockStates);

      const result = USBRelayService.getAllRelayStates();
      expect(result).toEqual(mockStates);
      expect(mockGetRelayStates).toHaveBeenCalledOnce();
    });

    it('should get connection status', async () => {
      const mockStatus = {
        connected: true,
        device: '/dev/hidraw0',
        error: undefined,
      };
      const mockGetStatus = vi.mocked(USBRelayService.getConnectionStatus);
      mockGetStatus.mockReturnValue(mockStatus);

      const result = USBRelayService.getConnectionStatus();
      expect(result).toEqual(mockStatus);
      expect(mockGetStatus).toHaveBeenCalledOnce();
    });

    it('should handle disconnected state', async () => {
      const mockStatus = {
        connected: false,
        port: null,
        error: 'Connection state: disconnected',
      };
      const mockGetStatus = vi.mocked(USBRelayService.getConnectionStatus);
      mockGetStatus.mockReturnValue(mockStatus);

      const result = USBRelayService.getConnectionStatus();
      expect(result.connected).toBe(false);
      expect(result.error).toBe('Connection state: disconnected');
    });
  });

  describe('Connection Management', () => {
    it('should disconnect successfully', async () => {
      const mockDisconnect = vi.mocked(USBRelayService.disconnect);
      mockDisconnect.mockResolvedValue(undefined);

      const result = await USBRelayService.disconnect();
      expect(result).toBe(true);
      expect(mockDisconnect).toHaveBeenCalledOnce();
    });

    it('should check connection status', () => {
      const mockIsConnected = vi.mocked(USBRelayService.getConnectionStatus);
      mockIsConnected.mockReturnValue({ connected: true });

      const result = USBRelayService.getConnectionStatus();
      expect(result).toBe(true);
      expect(mockIsConnected).toHaveBeenCalledOnce();
    });
  });

  describe('Error Handling', () => {
    it('should handle device write errors', async () => {
      const mockToggleRelay = vi.mocked(USBRelayService.toggleRelay);
      mockToggleRelay.mockRejectedValue(new Error('Write failed'));

      await expect(USBRelayService.toggleRelay(1, true)).rejects.toThrow('Write failed');
    });

    it('should handle device not found errors', async () => {
      const mockInitialize = vi.mocked(USBRelayService.initialize);
      mockInitialize.mockRejectedValue(new Error('No USBRelay8 device found'));

      await expect(USBRelayService.initialize()).rejects.toThrow('No USBRelay8 device found');
    });

    it('should handle permission errors', async () => {
      const mockInitialize = vi.mocked(USBRelayService.initialize);
      mockInitialize.mockRejectedValue(new Error('Permission denied'));

      await expect(USBRelayService.initialize()).rejects.toThrow('Permission denied');
    });
  });
});
