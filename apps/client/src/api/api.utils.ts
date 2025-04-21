// @ts-nocheck
import axios, { HttpStatusCode } from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '@workspace/shared/types';
import { ERROR_CODE_MAP } from '@workspace/shared';
import cloneDeep from 'lodash/cloneDeep';

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
    log('TEST_NON_AXIOS_ERROR_INSTANCEOF_ERROR: instanceof Error', 'magenta', error.message);
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
