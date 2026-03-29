export type {
  BulkRelayResponse,
  DisconnectRelayResponse,
  ReconnectResponse,
  RelayState,
  RelayStatus,
  ToggleRelayResponse,
} from 'api/endpoints';
export { useDisconnectRelay } from './useDisconnectRelay';
export { useGetRelayState } from './useGetRelayState';
export { useGetRelayStates } from './useGetRelayStates';
export { useGetRelayStatus } from './useGetRelayStatus';
export { useInitializeRelay } from './useInitializeRelay';
export { useReconnectRelay } from './useReconnectRelay';
export type { RelayConnectionState } from './relay.store';
export { probeRelayConnection, relayConnectionStore } from './relay.store';
export { useRelayConnection } from './useRelayConnection';
export { useStableRelayStates } from './useStableRelayStates';
export { useToggleRelay } from './useToggleRelay';
export { useTurnAllRelaysOff } from './useTurnAllRelaysOff';
export { useTurnAllRelaysOn } from './useTurnAllRelaysOn';

export const GET_RELAY_STATUS_QUERYKEY = ['get-relay-status'] as const;
export const GET_RELAY_STATES_QUERYKEY = ['get-relay-states'] as const;
export const GET_RELAY_STATE_QUERYKEY = ['get-relay-state'] as const;
export const POST_RELAY_TOGGLE_QUERYKEY = ['relays', 'toggle'] as const;
export const POST_RELAY_TURN_ALL_ON_QUERYKEY = ['post-relay-turn-all-on'] as const;
export const POST_RELAY_TURN_ALL_OFF_QUERYKEY = ['post-relay-turn-all-off'] as const;
export const POST_RELAY_RECONNECT_QUERYKEY = ['post-relay-reconnect'] as const;
export const POST_RELAY_DISCONNECT_QUERYKEY = ['post-relay-disconnect'] as const;
export const POST_RELAY_INIT_QUERYKEY = ['post-relay-init'] as const;
