// @ts-nocheck
import axios, { HttpStatusCode } from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '@workspace/shared/types';
import { ERROR_CODE_MAP } from '@workspace/shared';
import cloneDeep from 'lodash/cloneDeep';
import type { ApiErrorResponse, ApplicationError } from '@workspace/shared/types/errors';
import { ERROR_CODES, ERROR_MESSAGES } from '@workspace/shared/constants/errors';
import { errorResponseSchema } from '@workspace/shared/types/errors';

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

export const transformAxiosError__V2 = (error: unknown): ApplicationError => {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Try to parse as ApiErrorResponse
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
        // If not a valid ApiErrorResponse, continue with standard error handling
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

export const transformAxiosError = (error: unknown): ErrorResponse => {
  // ======================================================================== //
  // TODO: TESTING AXIOS ERROR HANDLING...

  if (error instanceof axios.AxiosError) {
    // handle axios error
    if (error.status === HttpStatusCode.Unauthorized) {
      log('TEST_AXIOS_ERROR: unauthorized', 'magenta', error);
    } else {
      // throw new Error(error.message);
    }
    log('TEST_AXIOS_ERROR: code ?? data', 'magenta', error.response?.status ?? 400, error.response?.data);
    log('TEST_AXIOS_ERROR: error.toJSON()', 'magenta', cloneDeep(error).toJSON());
    log('TEST_AXIOS_ERROR: error.response?.data', 'magenta', error.response?.data);
  }

  if (error instanceof Error) {
    log('TEST_NON_AXIOS_ERROR_INSTANCEOF_ERROR: instanceof Error', 'red', error.message);
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'status' in error.response &&
    'data' in error.response
  ) {
    log(
      'TEST_NON_AXIOS_UNKOWN_ERROR:',
      'magenta',
      (error.response.status as number) ?? 400,
      error.response?.data,
    );
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    log('TEST_NON_AXIOS_ERROR: unknown error', 'magenta', error.message);
  }

  // ======================================================================== //
  // TODO: ORIGNAL INSTANCE.. REFACTOR / MAKE MORE ROBUST  / CAUTION: THROWING ERRORS when CAN RETRY !!!

  const axiosError = error as AxiosError;
  return {
    message: axiosError.message || 'An unknown error occurred',
    code: axiosError.code as keyof typeof ERROR_CODE_MAP,
    status:
      axiosError.response?.status || ERROR_CODE_MAP[axiosError.code as keyof typeof ERROR_CODE_MAP] || 500,
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
