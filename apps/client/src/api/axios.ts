import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '@workspace/core/api';

// TypeScript now knows API_URL exists and is a string
const { API_URL } = process.env;

if (!API_URL) {
  throw new Error('API_URL is not defined in process.env');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // TODO: necessary with tanstack query ??
  // TODO: or how to integreate with tanstack query ??
  // timeout: 15000, // 15 seconds
  // withCredentials: true
});

// ======================================================================== //
/*
// TODO: necessary with tanstack query ??
// TODO: or how to integreate with tanstack query ??

https://www.npmjs.com/package/axios-retry

import axiosRetry from 'axios-retry';

axiosRetry(api, { retries: 3 });
axiosRetry(api, { retries: 3, maxRequests: 10, perMilliseconds: 1000 });

*/
// ======================================================================== //

const testErrorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    log('TEST_ERROR_HANDLER: axios error', 'blue');
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      log('TEST_ERROR_HANDLER: axiosError.response', 'blue', {
        status: axiosError.response.status,
        statusText: axiosError.response.statusText,
        data: axiosError.response.data,
      });
      throw new Error(`A Error (${axiosError.response.status}): ${JSON.stringify(axiosError.response.data)}`);
    } else if (axiosError.request) {
      log('TEST_ERROR_HANDLER: axiosError.request', 'blue', axiosError.message);
      throw new Error(`RPC Request Failed: ${axiosError.message}`);
    }
  }
  log('TEST_ERROR_HANDLER: not axios error', 'blue', error);
  // throw error;
};

// ======================================================================== //

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // TODO: TESTING (NON-ERROR RESPONSE ERRORS)

    if (response.data.error) {
      log('(AXIOS) TEST_SUCCESS_ERROR: response.data.error', 'yellow', response.data.error);
      // return { ...response.data.errors }
    }

    if (response.data.errors) {
      log('(AXIOS) TEST_SUCCESS_ERROR: response.data.errors', 'yellow', response.data.errors);
      // return { ...response.data.errors }
    }

    if (response.data.message) {
      log('(AXIOS) TEST_SUCCESS_ERROR: response.data.message', 'yellow', response.data.message);
      // return { error: response.data.message }
    }

    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // NOTE: using ErrorResponse type sets AxiosError.data to ErrorResponse { message, code, details } - TODO: CHANGE ??

    // TODO: TESTING (AXIOS ERROR HANDLING)
    testErrorHandler(error);

    // TODO: TESTING (NON-ERROR RESPONSE ERRORS)
    if (error.response?.data) {
      log('(AXIOS) TEST_ERROR: error.response.data', 'orange', error.response.data);
      // return error.response.data
    }

    if (error.response?.data?.message) {
      log('(AXIOS) TEST_ERROR: error.response.data.message', 'orange', error.response.data.message);
      // return { error: rerror.response.data.message }
    }

    const TEST_NEW_ERROR_REJECT =
      error instanceof axios.AxiosError
        ? new Error(error.response?.data ? JSON.stringify(error.response?.data) : error.message)
        : error;

    log('(AXIOS) TEST_NEW_ERROR_REJECT', 'red', TEST_NEW_ERROR_REJECT);

    return Promise.reject({ ...error });
  },
);

// ======================================================================== //
// TODO: IDEAS..

/*
const get = async <Response>(url: string, options?: PirschHttpOptions): Promise<Response> => {
  try {
      const result = await api.get<Response>(url, this.createOptions({ ...options }));
      return result.data;
  } catch (error: unknown) {
      const exception = await this.toApiError(error);

      throw exception;
  }
}

const post = async <Response, Data extends object = object>(
  url: string,
  data: Data,
  options?: PirschHttpOptions
): Promise<Response> {
  try {
      const result = await this.httpClient.post<Response>(url, data, this.createOptions(options ?? {}));
      return result.data;
  } catch (error: unknown) {
      const exception = await this.toApiError(error);
      throw exception;
  }
}

const toApiError = async (error: unknown): Promise<PirschApiError> => {
  if (error instanceof PirschApiError) {
      return error;
  }

  if (error instanceof AxiosError) {
      return new PirschApiError(error.response?.status ?? 400, error.response?.data as PirschApiErrorResponse);
  }

  if (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response && 'data' in error.response) {
      return new PirschApiError(error.response.status as number ?? 400, error.response?.data as PirschApiErrorResponse);
  }

  if (error instanceof Error) {
      return new PirschUnknownApiError(error.message);
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
      return new PirschUnknownApiError(error.message);
  }

  return new PirschUnknownApiError(JSON.stringify(error));
}
  */
