import type { AxiosResponse, AxiosError } from 'axios';

export interface ErrorResponse extends AxiosError {
  message: string;
}

// Extend AxiosResponse but keep our additional fields
export interface ApiResponse<T> extends Omit<AxiosResponse<T>, 'data'> {
  data: T;
  message?: string;
  timestamp: number;
}
