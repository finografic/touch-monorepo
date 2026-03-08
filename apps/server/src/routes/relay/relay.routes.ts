import * as v from 'valibot';
import * as HttpStatusCodes from 'stoker/http-status-codes';

import { json, route } from 'lib/openapi.helpers';

const tags = ['Relay'];

// Note: USBRelayService initialization moved to server startup (after listening)

// Schemas
export const relayStateSchema = v.object({
  slotNumber:  v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(8)),
  isOn:        v.boolean(),
  lastUpdated: v.string(),
});

export const relayConnectionStatusSchema = v.object({
  connected: v.boolean(),
  port:      v.optional(v.string()),
  error:     v.optional(v.string()),
});

export const relayToggleResponseSchema = v.object({
  success:     v.boolean(),
  slotNumber:  v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(8)),
  state:       v.boolean(),
  message:     v.string(),
});

export const relayStatesResponseSchema = v.object({
  success: v.boolean(),
  states:  v.array(relayStateSchema),
  count:   v.pipe(v.number(), v.integer()),
});

export const relayStatusResponseSchema = v.object({
  success:   v.boolean(),
  connected: v.boolean(),
  port:      v.optional(v.string()),
  error:     v.optional(v.string()),
});

// Error schemas
const errorMessageSchema = v.object({
  success: v.boolean(),
  error:   v.string(),
});

// Routes
export const toggleRelay = route('/relay/toggle/:slotNumber/:state', {
  tags,
  description: 'Toggle a relay on or off',
  responses: {
    [HttpStatusCodes.OK]:                    json(relayToggleResponseSchema, 'Relay toggled successfully'),
    [HttpStatusCodes.BAD_REQUEST]:           json(errorMessageSchema, 'Invalid slot number'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const getRelayStates = route('/relay/states', {
  tags,
  description: 'Get all relay states',
  responses: {
    [HttpStatusCodes.OK]:                    json(relayStatesResponseSchema, 'All relay states retrieved'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const getRelayState = route('/relay/state/:slotNumber', {
  tags,
  description: 'Get a single relay state',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({
        success:    v.boolean(),
        slotNumber: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(8)),
        state:      v.boolean(),
        message:    v.string(),
      }),
      'Relay state retrieved',
    ),
    [HttpStatusCodes.BAD_REQUEST]:           json(errorMessageSchema, 'Invalid slot number'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const getRelayStatus = route('/relay/status', {
  tags,
  description: 'Get relay connection status',
  responses: {
    [HttpStatusCodes.OK]:                    json(relayStatusResponseSchema, 'Relay connection status'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const turnAllRelaysOn = route('/relay/all-on', {
  tags,
  description: 'Turn all relays ON',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({ success: v.boolean(), message: v.string() }),
      'All relays turned ON',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const turnAllRelaysOff = route('/relay/all-off', {
  tags,
  description: 'Turn all relays OFF',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({ success: v.boolean(), message: v.string() }),
      'All relays turned OFF',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const reconnectRelay = route('/relay/reconnect', {
  tags,
  description: 'Reconnect to relay board',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({ success: v.boolean(), message: v.string() }),
      'Successfully reconnected to relay board',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const disconnectRelay = route('/relay/disconnect', {
  tags,
  description: 'Disconnect from relay board',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({ success: v.boolean(), message: v.string() }),
      'Successfully disconnected from relay board',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});

export const initializeRelay = route('/relay/init', {
  tags,
  description: 'Initialize relay service',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.object({ success: v.boolean(), message: v.string(), initialized: v.boolean() }),
      'Relay service initialized successfully',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: json(errorMessageSchema, 'Server error'),
  },
});
