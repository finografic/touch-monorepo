import type { ErrorCode } from '../constants/errors';
import { z } from 'zod';

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    issues?: Array<{
      code: string;
      path: string[];
      message: string;
    }>;
  };
}

export interface ValidationError {
  code: 'VALIDATION_ERROR';
  message: string;
  issues: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export interface NetworkError {
  code: 'NETWORK_ERROR';
  message: string;
  status?: number;
  isRetryable: boolean;
}

export interface RateLimitError {
  code: 'RATE_LIMIT_ERROR';
  message: string;
  retryAfter: number;
  isRetryable: true;
}

export type ApplicationError = ValidationError | NetworkError | RateLimitError;

// Zod schema for validation
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
    issues: z
      .array(
        z.object({
          code: z.string(),
          path: z.array(z.string()),
          message: z.string(),
        }),
      )
      .optional(),
  }),
});
