import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '@touch/shared/types';
import { ERROR_CODE_MAP } from '@touch/shared/types';

export const transformAxiosError = (error: unknown): ErrorResponse => {
  const axiosError = error as AxiosError;
  return {
    message: axiosError.message || 'An unknown error occurred',
    code: axiosError.code as keyof typeof ERROR_CODE_MAP,
    status:
      axiosError.response?.status || ERROR_CODE_MAP[axiosError.code as keyof typeof ERROR_CODE_MAP] || 500,
  };
};
