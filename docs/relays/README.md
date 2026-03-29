# Relay System

The relay system controls two USB-HID relay boards (USBRelay8, dcttech) that physically switch the drink dispensing slots. Control spans both the server (hardware I/O via `node-hid`) and the client (admin UI, connection polling, state management).

## Contents

| File | Covers |
| ---- | ------ |
| [hardware.md](./hardware.md) | USB device specs, board topology, 16-relay mapping |
| [server.md](./server.md) | `USBRelayService`, HID protocol, API routes |
| [client.md](./client.md) | Connection store, polling, query hooks, admin page |

## Quick reference

### How a relay toggle flows

```
Admin UI (RelaysTable)
  → useRelayHandlers → useToggleRelay (mutation)
    → POST /api/relay/toggle/:slotNumber/:state
      → USBRelayService.toggleRelay(slotNumber, state)
        → HID write to board (byte command per channel)
          → mutation onSuccess → invalidate GET_RELAY_STATES_QUERYKEY
            → useGetRelayStates refetches → table updates
```

### How connection status is monitored

```
App.tsx (side-effect import) → relay.store.ts bootstrap
  → probeRelayConnection() fires every 10 s
    → GET /api/relay/status
      → relayConnectionStore.setState({ connected, port, message })
        → useRelayConnection() subscribers re-render (only on change)
```

### Slot → relay mapping

Slots 1–16 each hold a `relayNumber` (1–16 | null) set by the admin in `RelaysTable`. The mapping is stored in the `slot_configurations` DB table and loaded via `useGetSlotConfigurations`. See [hardware.md](./hardware.md) for board topology.
