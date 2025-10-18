import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from './zod-errors';

export const ERROR_CODES = {
  // HTTP Status based
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
  FORBIDDEN: StatusCodes.FORBIDDEN,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  CONFLICT: StatusCodes.CONFLICT,
  UNPROCESSABLE_ENTITY: StatusCodes.UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,

  // Custom application codes
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',

  // Zod specific
  ...ZOD_ERROR_CODES,
} as const;

export const ERROR_MESSAGES = {
  // HTTP Status based
  [ERROR_CODES.BAD_REQUEST]: ReasonPhrases.BAD_REQUEST,
  [ERROR_CODES.UNAUTHORIZED]: ReasonPhrases.UNAUTHORIZED,
  [ERROR_CODES.FORBIDDEN]: ReasonPhrases.FORBIDDEN,
  [ERROR_CODES.NOT_FOUND]: ReasonPhrases.NOT_FOUND,
  [ERROR_CODES.CONFLICT]: ReasonPhrases.CONFLICT,
  [ERROR_CODES.UNPROCESSABLE_ENTITY]: ReasonPhrases.UNPROCESSABLE_ENTITY,
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: ReasonPhrases.INTERNAL_SERVER_ERROR,

  // Custom application messages
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation error occurred',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error occurred',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out',
  [ERROR_CODES.RATE_LIMIT_ERROR]: 'Too many requests',

  // Zod specific
  ...ZOD_ERROR_MESSAGES,
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
export type ErrorMessage = keyof typeof ERROR_MESSAGES;
