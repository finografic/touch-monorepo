/**
 * Relay connection store — vanilla Zustand, lives outside React.
 *
 * Polls /relay/status every 10 s and writes connection state into a
 * vanilla store. Components read this store via `useRelayConnection()`
 * so they only re-render when `connected` (or another subscribed field)
 * actually changes — not on every React Query tick.
 *
 * The interval starts the moment this module is first imported, so
 * bootstrap it early (e.g. a side-effect import in App.tsx).
 */

import { subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { getApiUrl } from 'api/fetch.client';

// ─── State ────────────────────────────────────────────────────────────────────

export interface RelayConnectionState {
  connected: boolean;
  port: string | undefined;
  message: string | undefined;
  lastChecked: number;
  /** True when the server itself could not be reached (ECONNREFUSED / network) */
  networkError: boolean;
}

export const relayConnectionStore = createStore<RelayConnectionState>()(
  subscribeWithSelector<RelayConnectionState>(() => ({
    connected: false,
    port: undefined,
    message: undefined,
    lastChecked: 0,
    networkError: false,
  })),
);

// ─── Connection-change side effects ───────────────────────────────────────────

relayConnectionStore.subscribe(
  (s) => s.connected,
  (connected, wasConnected) => {
    if (!connected && wasConnected) console.warn('🔌 Relay board disconnected');
    if (connected && !wasConnected) console.info('✅ Relay board reconnected');
  },
);

// ─── Probe ────────────────────────────────────────────────────────────────────

const RELAY_STATUS_URL = `${getApiUrl()}/relay/status`;
const PROBE_TIMEOUT_MS = 5_000;
const POLL_INTERVAL_MS = 10_000;

export async function probeRelayConnection(): Promise<void> {
  try {
    const response = await fetch(RELAY_STATUS_URL, {
      method: 'GET',
      credentials: 'include',
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    relayConnectionStore.setState({
      connected: data.connected ?? false,
      port: data.port,
      message: data.message,
      lastChecked: Date.now(),
      networkError: false,
    });
  } catch {
    const wasNetworkError = relayConnectionStore.getState().networkError;

    relayConnectionStore.setState({
      connected: false,
      lastChecked: Date.now(),
      networkError: true,
    });

    if (!wasNetworkError) {
      console.warn('🔴 Relay status probe failed – server unreachable?');
    }
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

// Re-check immediately when the tab regains visibility
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') probeRelayConnection();
});

// Initial probe fires on first import; subsequent probes every 10 s
probeRelayConnection();
setInterval(probeRelayConnection, POLL_INTERVAL_MS);
