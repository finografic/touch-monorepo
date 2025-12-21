import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';
import type {
  BulkRelayResponse,
  DisconnectRelayResponse,
  ReconnectResponse,
  RelayState,
  RelayStateResponse,
  RelayStatesResponse,
  RelayStatus,
  ToggleRelayResponse,
} from 'types/relay.types';

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Relays API endpoints
 *
 * Controls USB relay board for slot management.
 * Includes connection management, state queries, and toggle operations.
 */
export const relaysEndpoints = {
  /**
   * Get relay connection status
   */
  getStatus: async (): Promise<RelayStatus> => {
    try {
      return await api.get<RelayStatus>('/relay/status');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get states of all relays
   */
  getAllStates: async (): Promise<RelayState[]> => {
    try {
      const data = await api.get<RelayStatesResponse>('/relay/states');
      return data.states;
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Get state of a single relay by slot number
   */
  getState: async (slotNumber: number): Promise<RelayState> => {
    try {
      const data = await api.get<RelayStateResponse>(`/relay/state/${slotNumber}`);
      return data.state;
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Toggle a relay on/off
   */
  toggle: async (slotNumber: number, state: 'on' | 'off'): Promise<ToggleRelayResponse> => {
    try {
      return await api.post<ToggleRelayResponse>(`/relay/toggle/${slotNumber}/${state}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Turn all relays on
   */
  turnAllOn: async (): Promise<BulkRelayResponse> => {
    try {
      return await api.post<BulkRelayResponse>('/relay/all-on');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Turn all relays off
   */
  turnAllOff: async (): Promise<BulkRelayResponse> => {
    try {
      return await api.post<BulkRelayResponse>('/relay/all-off');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Disconnect from relay board
   */
  disconnect: async (): Promise<DisconnectRelayResponse> => {
    try {
      return await api.post<DisconnectRelayResponse>('/relay/disconnect');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Reconnect to relay board
   */
  reconnect: async (): Promise<ReconnectResponse> => {
    try {
      return await api.post<ReconnectResponse>('/relay/reconnect');
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Initialize relay connection
   */
  initialize: async (): Promise<{ success: boolean; message: string }> => {
    try {
      return await api.post<{ success: boolean; message: string }>('/relay/initialize');
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;

