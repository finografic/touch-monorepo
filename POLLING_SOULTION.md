Interesting idea — using a Zustand vanilla store with `subscribeWithSelector` to drive relay polling outside of React entirely. That's a clean pattern for this.

The key advantage: the heartbeat store ticks independently of React. You'd subscribe to it from your `USBRelayService` layer (or a thin relay store), fire the `/relay/states` fetch on each tick, and only push state into React when something *actually changes*. No re-renders from polling — only from genuine state transitions (relay toggled, board disconnected, etc.).

Here's how I'd shape it:

```typescript
// relay-heartbeat.store.ts
import { subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export const relayHeartbeatStore = createStore()(
  subscribeWithSelector(() => ({
    tick: 0,
    now: Date.now(),
  })),
);

setInterval(() => {
  relayHeartbeatStore.setState((s) => ({
    tick: s.tick + 1,
    now: Date.now(),
  }));
}, 5000);
```

Then a relay store that subscribes to it:

```typescript
// relay.store.ts
import { subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { relayHeartbeatStore } from './relay-heartbeat.store';

interface RelayStoreState {
  states: RelayState[];
  connected: boolean;
  lastChecked: number;
}

export const relayStore = createStore<RelayStoreState>()(
  subscribeWithSelector(() => ({
    states: [],
    connected: false,
    lastChecked: 0,
  })),
);

// Poll on heartbeat tick — no React involvement
relayHeartbeatStore.subscribe(
  (s) => s.tick,
  async () => {
    try {
      const res = await fetch('/api/relay/states');
      const data = await res.json();
      relayStore.setState({
        states: data.states,
        connected: true,
        lastChecked: Date.now(),
      });
    } catch {
      relayStore.setState({ connected: false });
    }
  },
);
```

Then your React components just `useStore(relayStore, (s) => s.states)` — and Zustand's selector equality check means **zero re-renders** unless the actual relay data changes. The 5-second fetch happens regardless, but React only knows about it when there's a real diff.

**To your second point** (detecting connection/disconnection) — this is where it gets nice. You can add a second subscription on the relay store itself:

```typescript
relayStore.subscribe(
  (s) => s.connected,
  (connected, wasConnected) => {
    if (!connected && wasConnected) {
      console.log('🔌 Board disconnected');
      // Could trigger reconnect logic, toast, etc.
    }
    if (connected && !wasConnected) {
      console.log('✅ Board reconnected');
    }
  },
);
```

This gives you connection event detection with no polling hooks in React, no duplicate observers, and no unnecessary renders. The whole mechanism is passive infrastructure — same philosophy as your app heartbeat.

One thing to decide: do you want to keep React Query for mutations (toggle, all-on, all-off) and only move the *polling reads* to this pattern? That's probably the cleanest split — Zustand vanilla for passive state, React Query for user-initiated commands that need loading/error states in the UI.