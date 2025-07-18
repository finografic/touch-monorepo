import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '../constants/zod-errors';

export const ERROR_CODES = {
  // HTTP Status based
  BAD_REQUEST: HttpStatusCodes.BAD_REQUEST,
  UNAUTHORIZED: HttpStatusCodes.UNAUTHORIZED,
  FORBIDDEN: HttpStatusCodes.FORBIDDEN,
  NOT_FOUND: HttpStatusCodes.NOT_FOUND,
  CONFLICT: HttpStatusCodes.CONFLICT,
  UNPROCESSABLE_ENTITY: HttpStatusCodes.UNPROCESSABLE_ENTITY,
  REQUEST_TIMEOUT: HttpStatusCodes.REQUEST_TIMEOUT,
  TOO_MANY_REQUESTS: HttpStatusCodes.TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR: HttpStatusCodes.INTERNAL_SERVER_ERROR,
  BAD_GATEWAY: HttpStatusCodes.BAD_GATEWAY,
  SERVICE_UNAVAILABLE: HttpStatusCodes.SERVICE_UNAVAILABLE,
  GATEWAY_TIMEOUT: HttpStatusCodes.GATEWAY_TIMEOUT,

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
  [ERROR_CODES.BAD_REQUEST]: HttpStatusPhrases.BAD_REQUEST,
  [ERROR_CODES.UNAUTHORIZED]: HttpStatusPhrases.UNAUTHORIZED,
  [ERROR_CODES.FORBIDDEN]: HttpStatusPhrases.FORBIDDEN,
  [ERROR_CODES.NOT_FOUND]: HttpStatusPhrases.NOT_FOUND,
  [ERROR_CODES.CONFLICT]: HttpStatusPhrases.CONFLICT,
  [ERROR_CODES.UNPROCESSABLE_ENTITY]: HttpStatusPhrases.UNPROCESSABLE_ENTITY,
  [ERROR_CODES.REQUEST_TIMEOUT]: HttpStatusPhrases.REQUEST_TIMEOUT,
  [ERROR_CODES.TOO_MANY_REQUESTS]: HttpStatusPhrases.TOO_MANY_REQUESTS,
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
  [ERROR_CODES.BAD_GATEWAY]: HttpStatusPhrases.BAD_GATEWAY,
  [ERROR_CODES.SERVICE_UNAVAILABLE]: HttpStatusPhrases.SERVICE_UNAVAILABLE,
  [ERROR_CODES.GATEWAY_TIMEOUT]: HttpStatusPhrases.GATEWAY_TIMEOUT,

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
