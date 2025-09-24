export { useGetRelayStates } from './useGetRelayStates';
export { useGetRelayState } from './useGetRelayState';
export { useGetRelayStatus } from './useGetRelayStatus';
export { useToggleRelay } from './useToggleRelay';
export { useTurnAllRelaysOn } from './useTurnAllRelaysOn';
export { useTurnAllRelaysOff } from './useTurnAllRelaysOff';
export { useReconnectRelay } from './useReconnectRelay';
export { useDisconnectRelay } from './useDisconnectRelay';

export type { RelayState } from './useGetRelayStates';

export const GET_RELAY_STATUS_QUERYKEY = ['get-relay-status'] as const;
export const GET_RELAY_STATES_QUERYKEY = ['get-relay-states'] as const;
export const GET_RELAY_STATE_QUERYKEY = ['get-relay-state'] as const;
export const POST_RELAY_TOGGLE_QUERYKEY = ['relays', 'toggle'] as const;
export const POST_RELAY_TURN_ALL_ON_QUERYKEY = ['post-relay-turn-all-on'] as const;
export const POST_RELAY_TURN_ALL_OFF_QUERYKEY = ['post-relay-turn-all-off'] as const;
export const POST_RELAY_RECONNECT_QUERYKEY = ['post-relay-reconnect'] as const;
export const POST_RELAY_DISCONNECT_QUERYKEY = ['post-relay-disconnect'] as const;
