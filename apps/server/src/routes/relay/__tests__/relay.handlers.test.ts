import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Context } from 'hono';

// Mock the USBRelayService
vi.mock('../../services/usbrelay.service', () => ({
  USBRelayService: {
    initialize: vi.fn(),
    toggleRelay: vi.fn(),
    toggleAllRelays: vi.fn(),
    getRelayStates: vi.fn(),
    getStatus: vi.fn(),
    disconnect: vi.fn(),
    isConnected: vi.fn(),
  },
}));

import { USBRelayService } from '../../services/usbrelay.service';
import {
  toggleRelay,
  toggleAllRelays,
  getRelayStates,
  getRelayStatus,
  disconnectRelay,
  initializeRelay,
} from '../../routes/relay/relay.handlers';

describe('Relay API Handlers', () => {
  let mockContext: Partial<Context>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockContext = {
      json: vi.fn().mockReturnThis(),
      req: {
        json: vi.fn(),
      } as any,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('toggleRelay', () => {
    it('should toggle relay ON successfully', async () => {
      const mockToggleRelay = vi.mocked(USBRelayService.toggleRelay);
      mockToggleRelay.mockResolvedValue(true);

      mockContext.req!.json = vi.fn().mockResolvedValue({
        slotNumber: 1,
        state: true,
      });

      await toggleRelay(mockContext as Context);

      expect(mockToggleRelay).toHaveBeenCalledWith(1, true);
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: 'Relay 1 turned ON',
        slotNumber: 1,
        state: true,
      });
    });

    it('should toggle relay OFF successfully', async () => {
      const mockToggleRelay = vi.mocked(USBRelayService.toggleRelay);
      mockToggleRelay.mockResolvedValue(true);

      mockContext.req!.json = vi.fn().mockResolvedValue({
        slotNumber: 2,
        state: false,
      });

      await toggleRelay(mockContext as Context);

      expect(mockToggleRelay).toHaveBeenCalledWith(2, false);
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: 'Relay 2 turned OFF',
        slotNumber: 2,
        state: false,
      });
    });

    it('should handle toggle failure', async () => {
      const mockToggleRelay = vi.mocked(USBRelayService.toggleRelay);
      mockToggleRelay.mockRejectedValue(new Error('Device not connected'));

      mockContext.req!.json = vi.fn().mockResolvedValue({
        slotNumber: 1,
        state: true,
      });

      await toggleRelay(mockContext as Context);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: 'Device not connected',
        },
        500,
      );
    });
  });

  describe('toggleAllRelays', () => {
    it('should turn all relays ON successfully', async () => {
      const mockToggleAllRelays = vi.mocked(USBRelayService.toggleAllRelays);
      mockToggleAllRelays.mockResolvedValue(true);

      mockContext.req!.json = vi.fn().mockResolvedValue({ state: true });

      await toggleAllRelays(mockContext as Context);

      expect(mockToggleAllRelays).toHaveBeenCalledWith(true);
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: 'All relays turned ON',
        state: true,
      });
    });

    it('should turn all relays OFF successfully', async () => {
      const mockToggleAllRelays = vi.mocked(USBRelayService.toggleAllRelays);
      mockToggleAllRelays.mockResolvedValue(true);

      mockContext.req!.json = vi.fn().mockResolvedValue({ state: false });

      await toggleAllRelays(mockContext as Context);

      expect(mockToggleAllRelays).toHaveBeenCalledWith(false);
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: 'All relays turned OFF',
        state: false,
      });
    });

    it('should handle toggle all failure', async () => {
      const mockToggleAllRelays = vi.mocked(USBRelayService.toggleAllRelays);
      mockToggleAllRelays.mockRejectedValue(new Error('Write failed'));

      mockContext.req!.json = vi.fn().mockResolvedValue({ state: true });

      await toggleAllRelays(mockContext as Context);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: 'Write failed',
        },
        500,
      );
    });
  });

  describe('getRelayStates', () => {
    it('should return relay states successfully', async () => {
      const mockStates = [
        { slotNumber: 1, isOn: false },
        { slotNumber: 2, isOn: true },
        { slotNumber: 3, isOn: false },
      ];
      const mockGetRelayStates = vi.mocked(USBRelayService.getRelayStates);
      mockGetRelayStates.mockResolvedValue(mockStates);

      await getRelayStates(mockContext as Context);

      expect(mockGetRelayStates).toHaveBeenCalledOnce();
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        states: mockStates,
      });
    });

    it('should handle get states failure', async () => {
      const mockGetRelayStates = vi.mocked(USBRelayService.getRelayStates);
      mockGetRelayStates.mockRejectedValue(new Error('Not connected'));

      await getRelayStates(mockContext as Context);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: 'Not connected',
        },
        500,
      );
    });
  });

  describe('getRelayStatus', () => {
    it('should return connection status successfully', async () => {
      const mockStatus = {
        connected: true,
        port: '/dev/hidraw0',
        error: null,
      };
      const mockGetStatus = vi.mocked(USBRelayService.getStatus);
      mockGetStatus.mockResolvedValue(mockStatus);

      await getRelayStatus(mockContext as Context);

      expect(mockGetStatus).toHaveBeenCalledOnce();
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        ...mockStatus,
      });
    });

    it('should handle get status failure', async () => {
      const mockGetStatus = vi.mocked(USBRelayService.getStatus);
      mockGetStatus.mockRejectedValue(new Error('Service error'));

      await getRelayStatus(mockContext as Context);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: 'Service error',
        },
        500,
      );
    });
  });

  describe('disconnectRelay', () => {
    it('should disconnect successfully', async () => {
      const mockDisconnect = vi.mocked(USBRelayService.disconnect);
      mockDisconnect.mockResolvedValue(true);

      await disconnectRelay(mockContext as Context);

      expect(mockDisconnect).toHaveBeenCalledOnce();
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: 'Successfully disconnected from relay board',
      });
    });

    it('should handle disconnect failure', async () => {
      const mockDisconnect = vi.mocked(USBRelayService.disconnect);
      mockDisconnect.mockRejectedValue(new Error('Already disconnected'));

      await disconnectRelay(mockContext as Context);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: 'Already disconnected',
        },
        500,
      );
    });
  });

  describe('initializeRelay', () => {
    it('should initialize successfully', async () => {
      const mockInitialize = vi.mocked(USBRelayService.initialize);
      mockInitialize.mockResolvedValue(true);

      await initializeRelay(mockContext as Context);

      expect(mockInitialize).toHaveBeenCalledOnce();
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: 'Relay service initialized successfully',
        initialized: true,
      });
    });

    it('should handle already initialized', async () => {
      const mockInitialize = vi.mocked(USBRelayService.initialize);
      mockInitialize.mockResolvedValue(false);

      await initializeRelay(mockContext as Context);

      expect(mockInitialize).toHaveBeenCalledOnce();
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: 'Relay service already initialized',
        initialized: false,
      });
    });

    it('should handle initialization failure', async () => {
      const mockInitialize = vi.mocked(USBRelayService.initialize);
      mockInitialize.mockRejectedValue(new Error('Device not found'));

      await initializeRelay(mockContext as Context);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: 'Device not found',
        },
        500,
      );
    });
  });
});
