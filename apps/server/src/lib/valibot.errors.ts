import * as v from 'valibot';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { TEMPERATURE_RANGES } from 'config/temperature.config';

export const ERROR_MESSAGES = {
  REQUIRED:                      'Required',
  EXPECTED_NUMBER:               'Expected number, received nan',
  NO_UPDATES:                    'No updates provided',
  TEMPERATURE_CONSUMPTION_RANGE: `Temperature consumption must be between ${TEMPERATURE_RANGES.CONSUMPTION.MIN}°C and ${TEMPERATURE_RANGES.CONSUMPTION.MAX}°C`,
  TEMPERATURE_FREEZING_RANGE:    `Temperature freeze must be between ${TEMPERATURE_RANGES.FREEZING.MIN}°C and ${TEMPERATURE_RANGES.FREEZING.MAX}°C`,
};

export const ERROR_CODES = {
  INVALID_UPDATES: 'invalid_updates',
};

// Simple message object schema — replaces stoker's createMessageObjectSchema()
export const notFoundSchema = v.object({
  message: v.literal(HttpStatusPhrases.NOT_FOUND),
});

// Generic validation error shape — replaces stoker's createErrorSchema()
export const validationErrorSchema = v.object({
  success: v.literal(false),
  error: v.object({
    issues: v.array(
      v.object({
        code:    v.string(),
        path:    v.array(v.union([v.string(), v.number()])),
        message: v.string(),
      }),
    ),
    name: v.string(),
  }),
});
