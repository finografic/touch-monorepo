# server build errors


📅 Sep 27, 2025 (approx)


```typescript
@workspace/server:build: src/routes/relay/__tests__/relay.handlers.test.ts:2:10 - error TS1485: 'Context' resolves to a type-only declaration and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
@workspace/server:build:
@workspace/server:build: 2 import { Context } from 'hono';
@workspace/server:build:            ~~~~~~~
@workspace/server:build:
@workspace/server:build:   ../../node_modules/.pnpm/hono@4.9.2/node_modules/hono/dist/types/index.d.ts:24:15
@workspace/server:build:     24 export type { Context, ContextVariableMap, ContextRenderer, ExecutionContext } from './context';
@workspace/server:build:                      ~~~~~~~
@workspace/server:build:     'Context' was exported here.
@workspace/server:build:
@workspace/server:build: src/routes/relay/__tests__/relay.handlers.test.ts:17:33 - error TS2307: Cannot find module '../../services/usbrelay.service' or its corresponding type declarations.
@workspace/server:build:
@workspace/server:build: 17 import { USBRelayService } from '../../services/usbrelay.service';
@workspace/server:build:                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@workspace/server:build:
@workspace/server:build: src/routes/relay/__tests__/relay.handlers.test.ts:25:8 - error TS2307: Cannot find module '../../routes/relay/relay.handlers' or its corresponding type declarations.
@workspace/server:build:
@workspace/server:build: 25 } from '../../routes/relay/relay.handlers';
@workspace/server:build:           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:97:33 - error TS2551: Property 'isConnected' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'. Did you mean 'disconnect'?
@workspace/server:build:
@workspace/server:build: 97       vi.mocked(USBRelayService.isConnected).mockReturnValue(true);
@workspace/server:build:                                    ~~~~~~~~~~~
@workspace/server:build:
@workspace/server:build:   src/services/usbrelay.service.ts:259:9
@workspace/server:build:     259   async disconnect(): Promise<void> {
@workspace/server:build:                 ~~~~~~~~~~
@workspace/server:build:     'disconnect' is declared here.
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:102:41 - error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'void'.
@workspace/server:build:
@workspace/server:build: 102       mockToggleRelay.mockResolvedValue(true);
@workspace/server:build:                                             ~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:111:41 - error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'void'.
@workspace/server:build:
@workspace/server:build: 111       mockToggleRelay.mockResolvedValue(true);
@workspace/server:build:                                             ~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:128:45 - error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'void'.
@workspace/server:build:
@workspace/server:build: 128       mockToggleAllRelays.mockResolvedValue(true);
@workspace/server:build:                                                 ~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:137:45 - error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'void'.
@workspace/server:build:
@workspace/server:build: 137       mockToggleAllRelays.mockResolvedValue(true);
@workspace/server:build:                                                 ~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:152:60 - error TS2551: Property 'getRelayStates' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'. Did you mean 'getRelayState'?
@workspace/server:build:
@workspace/server:build: 152       const mockGetRelayStates = vi.mocked(USBRelayService.getRelayStates);
@workspace/server:build:                                                                ~~~~~~~~~~~~~~
@workspace/server:build:
@workspace/server:build:   src/services/usbrelay.service.ts:211:3
@workspace/server:build:     211   getRelayState(slotNumber: number): boolean {
@workspace/server:build:           ~~~~~~~~~~~~~
@workspace/server:build:     'getRelayState' is declared here.
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:155:44 - error TS2551: Property 'getRelayStates' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'. Did you mean 'getRelayState'?
@workspace/server:build:
@workspace/server:build: 155       const result = await USBRelayService.getRelayStates();
@workspace/server:build:                                                ~~~~~~~~~~~~~~
@workspace/server:build:
@workspace/server:build:   src/services/usbrelay.service.ts:211:3
@workspace/server:build:     211   getRelayState(slotNumber: number): boolean {
@workspace/server:build:           ~~~~~~~~~~~~~
@workspace/server:build:     'getRelayState' is declared here.
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:166:55 - error TS2339: Property 'getStatus' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'.
@workspace/server:build:
@workspace/server:build: 166       const mockGetStatus = vi.mocked(USBRelayService.getStatus);
@workspace/server:build:                                                           ~~~~~~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:169:44 - error TS2339: Property 'getStatus' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'.
@workspace/server:build:
@workspace/server:build: 169       const result = await USBRelayService.getStatus();
@workspace/server:build:                                                ~~~~~~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:180:55 - error TS2339: Property 'getStatus' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'.
@workspace/server:build:
@workspace/server:build: 180       const mockGetStatus = vi.mocked(USBRelayService.getStatus);
@workspace/server:build:                                                           ~~~~~~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:183:44 - error TS2339: Property 'getStatus' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'.
@workspace/server:build:
@workspace/server:build: 183       const result = await USBRelayService.getStatus();
@workspace/server:build:                                                ~~~~~~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:192:40 - error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'void'.
@workspace/server:build:
@workspace/server:build: 192       mockDisconnect.mockResolvedValue(true);
@workspace/server:build:                                            ~~~~
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:200:57 - error TS2551: Property 'isConnected' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'. Did you mean 'disconnect'?
@workspace/server:build:
@workspace/server:build: 200       const mockIsConnected = vi.mocked(USBRelayService.isConnected);
@workspace/server:build:                                                             ~~~~~~~~~~~
@workspace/server:build:
@workspace/server:build:   src/services/usbrelay.service.ts:259:9
@workspace/server:build:     259   async disconnect(): Promise<void> {
@workspace/server:build:                 ~~~~~~~~~~
@workspace/server:build:     'disconnect' is declared here.
@workspace/server:build:
@workspace/server:build: src/services/__tests__/usbrelay.service.test.ts:203:38 - error TS2551: Property 'isConnected' does not exist on type '{ initialize(): Promise<boolean>; toggleRelay(slotNumber: number, state: boolean): Promise<void>; getRelayState(slotNumber: number): boolean; getAllRelayStates(): readonly RelayState[]; ... 8 more ...; readonly relayCount: number; }'. Did you mean 'disconnect'?
@workspace/server:build:
@workspace/server:build: 203       const result = USBRelayService.isConnected();
@workspace/server:build:                                          ~~~~~~~~~~~
@workspace/server:build:
@workspace/server:build:   src/services/usbrelay.service.ts:259:9
@workspace/server:build:     259   async disconnect(): Promise<void> {
@workspace/server:build:                 ~~~~~~~~~~
@workspace/server:build:     'disconnect' is declared here.
@workspace/server:build:
@workspace/server:build: src/test/setup.ts:4:1 - error TS2304: Cannot find name 'beforeEach'.
@workspace/server:build:
@workspace/server:build: 4 beforeEach(() => {
@workspace/server:build:   ~~~~~~~~~~
@workspace/server:build:
@workspace/server:build:
@workspace/server:build: Found 18 errors in 3 files.
@workspace/server:build:
@workspace/server:build: Errors  Files
@workspace/server:build:      3  src/routes/relay/__tests__/relay.handlers.test.ts:2
@workspace/server:build:     14  src/services/__tests__/usbrelay.service.test.ts:97
@workspace/server:build:      1  src/test/setup.ts:4
@workspace/server:build:  ELIFECYCLE  Command failed with exit code 1.
@workspace/server:build: ERROR: command finished with error: command (/Users/justin/repos-finografic/touch-monorepo/apps/server) /opt/homebrew/opt/node@22/bin/pnpm run build exited (1)
@workspace/server#build: command (/Users/justin/repos-finografic/touch-monorepo/apps/server) /opt/homebrew/opt/node@22/bin/pnpm run build exited (1)

 Tasks:    4 successful, 5 total
Cached:    0 cached, 5 total
  Time:    14.672s
Failed:    @workspace/server#build

 ERROR  run failed: command  exited (1)
 ELIFECYCLE  Command failed with exit code 1.
ERROR: "reset.build" exited with 1.
ERROR: "reset" exited with 1.
✖  Error building interactive interface
 ~/repos-finografic/touch-monorepo   master ⇡8 *140 !5 ❯
```
