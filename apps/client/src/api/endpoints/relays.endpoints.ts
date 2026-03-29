import { transformFetchError } from '@workspace/core/api';

import { api } from 'api';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Relay state for a single slot
 */
export interface RelayState {
  slotNumber: number;
  isOn: boolean;
  lastUpdated: string;
}

/**
 * Response when getting all relay states
 */
export interface RelayStatesResponse {
  success: boolean;
  states: RelayState[];
  count: number;
}

/**
 * Response when getting a single relay state
 */
export interface RelayStateResponse {
  success: boolean;
  slotNumber: number;
  state: boolean;
}

/**
 * Response for relay connection status
 */
export interface RelayStatus {
  success: boolean;
  connected: boolean;
  port?: string;
  message?: string;
}

/**
 * Response when toggling a relay
 */
export interface ToggleRelayResponse {
  success: boolean;
  slotNumber: number;
  state: boolean;
  message?: string;
}

/**
 * Input for toggling a relay
 */
export interface ToggleRelayInput {
  slotNumber: number;
  state: boolean;
}

/**
 * Response for bulk relay operations
 */
export interface BulkRelayResponse {
  success: boolean;
  message: string;
}

/**
 * Response when disconnecting from relay
 */
export interface DisconnectRelayResponse {
  success: boolean;
  message: string;
}

/**
 * Response when reconnecting to relay
 */
export interface ReconnectResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * Relays API endpoints
 *
 * Controls USB relay board for slot management.
 * Includes connection management, state queries, and toggle operations.
 */
export const RelaysEndpoints = {
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
   * Returns just the boolean state value
   */
  getState: async (slotNumber: number): Promise<boolean> => {
    try {
      const data = await api.get<RelayStateResponse>(`/relay/state/${slotNumber}`);
      return data.state;
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  /**
   * Toggle a relay on/off
   * @param slotNumber - Relay slot number (1-16)
   * @param state - true for ON, false for OFF
   */
  toggle: async (slotNumber: number, state: boolean): Promise<ToggleRelayResponse> => {
    try {
      // Convert boolean to 'true'/'false' string for API URL
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
      return await api.post<{ success: boolean; message: string }>('/relay/init');
    } catch (error) {
      throw transformFetchError(error);
    }
  },
} as const;
