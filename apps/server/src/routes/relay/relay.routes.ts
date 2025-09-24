import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { USBRelayService } from '../../services/usbrelay.service';

const tags = ['Relay'];

// Initialize relay service on startup
USBRelayService.initialize().catch((error) => {
  console.error('Failed to initialize USBRelay service:', error);
});

// Schemas
export const relayStateSchema = z.object({
  slotNumber: z.number().int().min(1).max(8),
  isOn: z.boolean(),
  lastUpdated: z.string().datetime(),
});

export const relayConnectionStatusSchema = z.object({
  connected: z.boolean(),
  port: z.string().optional(),
  error: z.string().optional(),
});

export const relayToggleResponseSchema = z.object({
  success: z.boolean(),
  slotNumber: z.number().int().min(1).max(8),
  state: z.boolean(),
  message: z.string(),
});

export const relayStatesResponseSchema = z.object({
  success: z.boolean(),
  states: z.array(relayStateSchema),
  count: z.number().int(),
});

export const relayStatusResponseSchema = z.object({
  success: z.boolean(),
  connected: z.boolean(),
  port: z.string().optional(),
  error: z.string().optional(),
});

// Error schemas
const errorMessageSchema = z.object({
  success: z.boolean(),
  error: z.string(),
});

// Routes
export const toggleRelay = createRoute({
  path: '/relay/toggle/{slotNumber}/{state}',
  method: 'post',
  tags,
  request: {
    params: z.object({
      slotNumber: z.string().transform((val) => Number.parseInt(val)),
      state: z.string().transform((val) => val === 'true'),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(relayToggleResponseSchema, 'Relay toggled successfully'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorMessageSchema, 'Invalid slot number'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export const getRelayStates = createRoute({
  path: '/relay/states',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(relayStatesResponseSchema, 'All relay states retrieved'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export const getRelayState = createRoute({
  path: '/relay/state/{slotNumber}',
  method: 'get',
  tags,
  request: {
    params: z.object({
      slotNumber: z.string().transform((val) => Number.parseInt(val)),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        slotNumber: z.number().int().min(1).max(8),
        state: z.boolean(),
        message: z.string(),
      }),
      'Relay state retrieved',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorMessageSchema, 'Invalid slot number'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export const getRelayStatus = createRoute({
  path: '/relay/status',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(relayStatusResponseSchema, 'Relay connection status'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export const turnAllRelaysOn = createRoute({
  path: '/relay/all-on',
  method: 'post',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      'All relays turned ON',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export const turnAllRelaysOff = createRoute({
  path: '/relay/all-off',
  method: 'post',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      'All relays turned OFF',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export const reconnectRelay = createRoute({
  path: '/relay/reconnect',
  method: 'post',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      'Successfully reconnected to relay board',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export const disconnectRelay = createRoute({
  path: '/relay/disconnect',
  method: 'post',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      'Successfully disconnected from relay board',
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(errorMessageSchema, 'Server error'),
  },
});

export type ToggleRelayRoute = typeof toggleRelay;
export type GetRelayStatesRoute = typeof getRelayStates;
export type GetRelayStateRoute = typeof getRelayState;
export type GetRelayStatusRoute = typeof getRelayStatus;
export type TurnAllRelaysOnRoute = typeof turnAllRelaysOn;
export type TurnAllRelaysOffRoute = typeof turnAllRelaysOff;
export type ReconnectRelayRoute = typeof reconnectRelay;
export type DisconnectRelayRoute = typeof disconnectRelay;
