import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { relayConnectionStore, type RelayConnectionState } from './relay.store';

/**
 * Reads relay connection state from the vanilla Zustand store.
 * Components only re-render when a subscribed field actually changes —
 * no re-renders from React Query ticks or unrelated store updates.
 */
export const useRelayConnection = (): RelayConnectionState => {
  return useStore(
    relayConnectionStore,
    useShallow((s) => ({
      connected: s.connected,
      port: s.port,
      message: s.message,
      lastChecked: s.lastChecked,
      networkError: s.networkError,
    })),
  );
};
