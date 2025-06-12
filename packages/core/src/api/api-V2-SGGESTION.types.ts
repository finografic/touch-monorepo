import type { AxiosResponse } from 'axios';

export interface ApiResponseData<T> {
  data: T;
  message?: string;
  timestamp?: number;
  // ... other standard server response fields
}

// Complete response type extending Axios
export interface ApiResponse<T> extends Omit<AxiosResponse<ApiResponseData<T>>, 'data'> {
  data: ApiResponseData<T>; // Override Axios's data with your structured data
  // Keep other Axios fields:
  // status: number
  // statusText: string
  // headers: {...}
  // config: {...}
}
