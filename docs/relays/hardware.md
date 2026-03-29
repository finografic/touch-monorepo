# Relay Hardware

## Devices

Two identical **USBRelay8** boards are connected simultaneously.

| Property | Value |
| -------- | ----- |
| Product | USBRelay8 |
| Vendor | www.dcttech.com |
| Vendor ID | `0x16c0` |
| Product ID | `0x05df` |
| Interface | USB HID (up to 1.5 Mb/s) |
| Channels per board | 8 |
| Total channels | 16 |
| Current draw | 20 mA each |

macOS location IDs observed in the field:

```
Board A  0x08320000 / USB Address 5
Board B  0x08310000 / USB Address 6
```

## Relay → slot mapping

Relays 1–8 are on Board A; relays 9–16 are on Board B. Each relay number maps to a slot number via the `relayNumber` field in `slot_configurations`. The mapping is one-to-one — a relay can only be assigned to one slot and vice versa.

```
Board A  relay  1–8   →  slot_configurations.relayNumber 1–8
Board B  relay  9–16  →  slot_configurations.relayNumber 9–16
```

Unassigned slots have `relayNumber: null` and are inert (no HID command is sent for them).

## HID protocol

Commands are 9-byte HID feature reports: `[reportId, cmd, channel, padding×6]`.

| Action | Command byte | Channel |
| ------ | ------------ | ------- |
| Turn relay ON | `0xff` | relay number |
| Turn relay OFF | `0xfd` | relay number |
| Turn ALL ON | `0xfe` | `0x00` |
| Turn ALL OFF | `0xfc` | `0x00` |

The `0xfe`/`0xfc` bulk commands address the entire board in a single HID write, replacing the previous 16-loop approach that issued 16 individual HID writes per bulk action.

## Connection detection

The server does not receive a hardware interrupt when a board is plugged or unplugged. Connection state is determined by:

1. `USBRelayService.initialize()` — scans for HID devices matching vendor/product IDs at startup or on explicit reconnect.
2. `GET /api/relay/status` — returns `{ connected, port, message }` based on whether an open HID handle exists.
3. Client polling — `relay.store.ts` probes `/api/relay/status` every 10 seconds and on tab visibility change.
