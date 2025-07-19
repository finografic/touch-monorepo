// @ts-nocheck
import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ApplicationError, ErrorResponse } from '@workspace/core/api';
import {
  transformAxiosError as coreTransformAxiosError,
  isRetryableError as coreIsRetryableError,
} from '@workspace/core/api';

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

// Re-export core error handling functions
export const isRetryableError = coreIsRetryableError;
export const transformAxiosError = coreTransformAxiosError;

// ======================================================================== //

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
