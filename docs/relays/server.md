# Relay System — Server

## USBRelayService

`apps/server/src/services/usbrelay.service.ts`

Singleton that owns the HID device handle(s). All relay operations go through this service.

### Key methods

| Method | Description |
| ------ | ----------- |
| `initialize()` | Scans for HID devices, opens handles. Called on server startup and via `POST /api/relay/init`. |
| `getConnectionStatus()` | Returns `{ connected, port, message }`. Does not do I/O — reads in-memory handle state. |
| `toggleRelay(slotNumber, state)` | Sends ON/OFF HID command for a single relay channel. |
| `turnAllRelaysOn()` | Sends single bulk `0xfe` command to all boards. |
| `turnAllRelaysOff()` | Sends single bulk `0xfc` command to all boards. |
| `getAllRelayStates()` | Returns in-memory state map `{ slotNumber, isOn, lastUpdated }[]`. |
| `ensureConnection()` | Reconnects if disconnected. |
| `disconnect()` | Closes HID handles. |

In-memory relay state is updated optimistically on every `toggleRelay` call and reset on disconnect.

## API routes

`apps/server/src/routes/relay/`

| Method | Path | Handler | Notes |
| ------ | ---- | ------- | ----- |
| `GET` | `/relay/status` | `getRelayStatus` | Fast — no HID I/O, reads in-memory state |
| `GET` | `/relay/states` | `getRelayStates` | Returns all 16 in-memory relay states |
| `GET` | `/relay/state/:slotNumber` | `getRelayState` | Single relay state |
| `POST` | `/relay/init` | `initializeRelay` | Scans USB, opens HID handles |
| `POST` | `/relay/toggle/:slotNumber/:state` | `toggleRelay` | Per-relay on/off |
| `POST` | `/relay/all-on` | `turnAllRelaysOn` | Bulk HID `0xfe` — single write |
| `POST` | `/relay/all-off` | `turnAllRelaysOff` | Bulk HID `0xfc` — single write |
| `POST` | `/relay/reconnect` | `reconnectRelay` | Calls `ensureConnection()` |
| `POST` | `/relay/disconnect` | `disconnectRelay` | Closes HID handles |

### Error handling philosophy

Relay routes prefer **soft failures** where possible: a disconnected board returns `{ success: true, warning: "..." }` rather than a 5xx, so the client UI can degrade gracefully without triggering React Query error states that would disable polling.

## Initialization lifecycle

```
Server starts
  → USBRelayService.initialize() runs after listen()
    → HID scan, handles open, in-memory state populated

Client admin page mounts (relay functionality enabled)
  → POST /api/relay/init  (via useInitializeRelay, once per mount)
    → idempotent — skips if already initialized

User clicks Reconnect
  → POST /api/relay/reconnect
    → ensureConnection() → HID scan if handles are closed
```

`POST /api/relay/init` is safe to call multiple times; the service is idempotent when already connected.
