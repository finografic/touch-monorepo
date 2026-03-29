# Relay System — Client

## Connection store (`relay.store.ts`)

`apps/client/src/queries/relays/relay.store.ts`

A **vanilla Zustand store** that polls `/api/relay/status` outside of React. It is the single source of truth for connection state.

```ts
interface RelayConnectionState {
  connected: boolean;
  port:        string | undefined;
  message:     string | undefined;
  lastChecked: number;
  networkError: boolean;  // true when the server itself is unreachable
}
```

### Polling behaviour

| Trigger | Action |
| ------- | ------ |
| Module imported | `probeRelayConnection()` fires immediately |
| Every 10 seconds | `probeRelayConnection()` via `setInterval` |
| Tab becomes visible | `probeRelayConnection()` via `visibilitychange` |
| Fetch fails | `networkError: true`, logged once until recovery |
| `connected` transitions | Logged to console (`🔌` / `✅`) |

The store is bootstrapped via a side-effect import in `App.tsx`:

```ts
import 'queries/relays/relay.store';
```

This means polling starts at app load, before the admin page is ever visited.

### Reading connection state in components

Use `useRelayConnection()` from `queries/relays`:

```ts
const { connected, port, message, networkError } = useRelayConnection();
```

This wraps `useStore(relayConnectionStore, useShallow(...))` so components only re-render when a subscribed field actually changes — not on every probe tick.

To trigger an immediate re-probe (e.g. "Retry" button):

```ts
import { probeRelayConnection } from 'queries/relays';
<Button onClick={() => probeRelayConnection()}>Retry</Button>
```

## Query hooks

All relay query hooks live in `apps/client/src/queries/relays/`.

### `useGetRelayStates`

Fetches all relay on/off states. **No background polling** — connection status is handled by the store. Data stays fresh because mutations invalidate `GET_RELAY_STATES_QUERYKEY` on success.

| Option | Value | Reason |
| ------ | ----- | ------ |
| `refetchInterval` | `false` | Store handles connection; states only change via mutations |
| `refetchOnMount` | `true` | Fresh read when admin page opens |
| `refetchOnWindowFocus` | `false` | Unnecessary; mutations keep cache current |
| `staleTime` | 60 s | Relay states don't self-change |
| `enabled` | `isRelayFunctionalityEnabled` | Guard behind feature flag |

### `useStableRelayStates`

Wraps `useGetRelayStates` and only emits a new data reference when `isOn` values actually change. Prevents cascading re-renders in `AdminRelaysPage` when the query is invalidated/refetched but relay states are unchanged.

### `useGetRelayStatus`

Available but **not used for connection polling** — the store covers that. Still exported for any component that needs the full `RelayStatus` shape from the server.

### `useInitializeRelay`

Calls `POST /api/relay/init`. Called once on `AdminRelaysPage` mount when relay functionality is enabled.

**Important:** Always destructure `mutate` before using in a `useEffect` dependency array:

```ts
// Correct — mutate is a stable function ref
const { mutate: initializeRelay } = useInitializeRelay();
useEffect(() => {
  if (isRelayFunctionalityEnabled) initializeRelay();
}, [isRelayFunctionalityEnabled, initializeRelay]);

// Wrong — full mutation result object changes on every render → infinite loop
const mutation = useInitializeRelay();
useEffect(() => { mutation.mutate(); }, [mutation]);
```

This applies to all `useMutation`-based hooks.

## Admin page components

### `AdminRelaysPage`

`apps/client/src/admin/pages/AdminRelaysPage/AdminRelaysPage.tsx`

Responsibilities:
- Calls `useInitializeRelay` once on mount (when enabled)
- Fetches slot configurations (`useGetSlotConfigurations`)
- Fetches relay states via `useStableRelayStates` — one-time read, refreshed by mutations
- Builds `relayConfigs` (merged slot + state data) for `RelaysTable`
- Owns `useRelayHandlers` and passes `{ handlers, mutations }` to `BulkRelayControls` and `RelaysTable`

Does **not** poll for connection status — `RelaysConnectionStatus` handles that via the store.

### `RelaysConnectionStatus`

`apps/client/src/admin/pages/AdminRelaysPage/RelaysConnectionStatus/RelaysConnectionStatus.tsx`

Reads connection state exclusively from `useRelayConnection()` (the vanilla store). Re-renders only when `connected`, `port`, `message`, or `networkError` changes — not on RQ ticks.

States rendered:
- `networkError: true` → server-unreachable banner + retry button
- Normal → connected/disconnected badge, port, relay functionality toggle, reconnect button

### `RelaysTable`

`apps/client/src/admin/pages/AdminRelaysPage/RelaysTable/RelaysTable.tsx`

- Reads `connected` from `useRelayConnection()` to gate test buttons
- Relay assignment logic documented in `apps/client/src/admin/pages/AdminRelaysPage/docs/README.RelaysAssign.md`

## Feature flag

`isRelayFunctionalityEnabled` (from `useAppConfig`) gates all relay API calls on the client. When disabled:
- `useGetRelayStates` does not run
- `useInitializeRelay` does not fire
- Test buttons and relay toggles are disabled

The connection store polls regardless of this flag — knowing the board is physically disconnected is useful even when the feature is disabled.
