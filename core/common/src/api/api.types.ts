import type { AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: number;
}

export interface ApiResponse_DEV<T> {
  data: T;
}

// Extend AxiosResponse but keep our additional fields
export interface ApiResponse<T> extends Omit<AxiosResponse<T>, 'data'> {
  data: T;
  message?: string;
  timestamp: number;
}
