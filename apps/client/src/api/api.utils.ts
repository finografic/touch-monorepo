// @ts-nocheck
import axios, { HttpStatusCode } from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ApplicationError, ErrorResponse, ZodErrorResponse } from '@workspace/core/api';
import { AXIOS_ERROR_CODE_MAP, ERROR_CODES, ERROR_MESSAGES, errorResponseSchema } from '@workspace/core/api';
import cloneDeep from 'lodash/cloneDeep';

// ======================================================================== //

// Custom HTTP Exception class for better error handling
export class HttpException extends Error {
  constructor(
    message: string,
    public cause: {
      response?: {
        data?: unknown;
        status?: number;
        headers?: Record<string, string>;
      };
    },
  ) {
    super(message);
    this.name = 'HttpException';
  }
}

// ======================================================================== //

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      status === ERROR_CODES.REQUEST_TIMEOUT ||
      status === ERROR_CODES.TOO_MANY_REQUESTS ||
      status === ERROR_CODES.INTERNAL_SERVER_ERROR ||
      status === ERROR_CODES.BAD_GATEWAY ||
      status === ERROR_CODES.SERVICE_UNAVAILABLE ||
      status === ERROR_CODES.GATEWAY_TIMEOUT
    );
  }
  return false;
};

export const transformAxiosError = (error: unknown): ApplicationError => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Try to parse as ZodErrorResponse
      try {
        const validatedError = errorResponseSchema.parse(data);
        if (validatedError.error.issues) {
          return {
            code: 'VALIDATION_ERROR',
            message: validatedError.error.message,
            issues: validatedError.error.issues,
          };
        }
      } catch {
        // If not a valid ZodErrorResponse, continue with standard error handling
      }

      // Handle rate limiting
      if (status === ERROR_CODES.TOO_MANY_REQUESTS) {
        const retryAfter = Number(error.response.headers['retry-after']) || 60;
        return {
          code: 'RATE_LIMIT_ERROR',
          message: ERROR_MESSAGES[ERROR_CODES.TOO_MANY_REQUESTS],
          retryAfter,
          isRetryable: true,
        };
      }

      // Handle network errors
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES[status] || error.message,
        status,
        isRetryable: isRetryableError(error),
      };
    }

    // Handle request errors (no response received)
    return {
      code: 'NETWORK_ERROR',
      message: ERROR_MESSAGES.NETWORK_ERROR,
      isRetryable: true,
    };
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message,
      isRetryable: false,
    };
  }

  // Handle unknown errors
  return {
    code: 'NETWORK_ERROR',
    message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
    isRetryable: false,
  };
};

// ======================================================================== //

/**
 * Transforms any error (Axios or otherwise) into our standardized ErrorResponse format
 */
export const transformError = (error: unknown): ErrorResponse => {
  const axiosError = error as AxiosError;
  return {
    message: axiosError.message || 'An unknown error occurred',
    code: axiosError.code as keyof typeof AXIOS_ERROR_CODE_MAP,
    status:
      axiosError.response?.status ||
      AXIOS_ERROR_CODE_MAP[axiosError.code as keyof typeof AXIOS_ERROR_CODE_MAP] ||
      500,
  };
};

// ======================================================================== //

/*
// TODO: IDEA ??
// global simple Axios error handler
export function handleApiError(err: AxiosError | unknown) {
  // @ts-ignore
  const msg = err.response?.data?.message ?? err.message;
  console.error('AXIOS', msg);
}
*/

// ======================================================================== //

/*
const extractErrors = (response: AxiosResponse): Record<string, any> => {
  if (!response.data || typeof response.data !== 'object') {
    return { error: Form.errorMessage };
  }

  if (response.data.errors) {
    return { ...response.data.errors };
  }

  if (response.data.message) {
    return { error: response.data.message };
  }

  return { ...response.data };
};
*/

// ======================================================================== //
// TODO: SOMETHING LIKE THIS, MAYBE ??

/*
    export class APIError extends Error {
      constructor(
        public err: AxiosError,
        public code: string,
        public response: any,
      ) {
        super('Conso API a répondu avec une erreur');
      }

      toString() {
        return (
          `Conso API a répondu avec une erreur\nCode: ${this.code}\nRéponse : ` +
          JSON.stringify(this.response, null, 4)
        );
      }
    }
    if (err.response) {
      throw new APIError(err, err.response.status, err.response.data);
    }
    if (err.request) {
      throw new Error(`Aucune réponse de Conso API\nRequête : ` + JSON.stringify(err.request, null, 4));
    }
    throw new Error(`Impossible d'appeler Conso API\nErreur : ${err.message}`);
    */

// ======================================================================== //
