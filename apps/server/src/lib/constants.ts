import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

export const TEMPERATURE_RANGES = {
  CONSUMPTION: {
    MIN: 3,
    MAX: 8,
  },
  FREEZING: {
    MIN: -10,
    MAX: 0,
  },
} as const;

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: 'Required',
  EXPECTED_NUMBER: 'Expected number, received nan',
  NO_UPDATES: 'No updates provided',
  TEMPERATURE_CONSUMPTION_RANGE: `Temperature consumption must be between ${TEMPERATURE_RANGES.CONSUMPTION.MIN}°C and ${TEMPERATURE_RANGES.CONSUMPTION.MAX}°C`,
  TEMPERATURE_FREEZING_RANGE: `Temperature freezing must be between ${TEMPERATURE_RANGES.FREEZING.MIN}°C and ${TEMPERATURE_RANGES.FREEZING.MAX}°C`,
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: 'invalid_updates',
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
