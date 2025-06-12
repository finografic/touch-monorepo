import type { AxiosError } from 'axios';
import type { ErrorResponse } from './error.types';
import { AXIOS_ERROR_CODE_MAP } from './error.V1.constants';

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

/**
 * Generates a user-friendly error message based on the error type
 */
export const getErrorMessage = (error: ErrorResponse): string => {
  switch (error.code) {
    case 'ERR_NETWORK':
      return 'Unable to connect to the server. Please check your internet connection.';
    case 'ETIMEDOUT':
      return 'The request timed out. Please try again.';
    case 'ERR_BAD_REQUEST':
      return 'Invalid request. Please try again.';
    case 'ERR_BAD_RESPONSE':
      return 'The server returned an invalid response.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};
