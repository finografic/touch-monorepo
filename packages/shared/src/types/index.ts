// Re-export API types
export * from './api.types';

export interface ApiResponse<T> {
  data: T;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  // TODO: omitted axios error props
  // config?: InternalAxiosRequestConfig<D>,
  // request?: any,
  // response?: AxiosResponse<T, D>,
  details?: unknown; // TODO: non-axios error prop
}

/*
export class AxiosError<T = unknown, D = any> extends Error {
  constructor(
      message?: string,
      code?: string,
      config?: InternalAxiosRequestConfig<D>,
      request?: any,
      response?: AxiosResponse<T, D>
  );
  config?: InternalAxiosRequestConfig<D>;
  code?: string;
  request?: any;
  response?: AxiosResponse<T, D>;
  isAxiosError: boolean;
  status?: number;
  toJSON: () => object;
  cause?: Error;
  static from<T = unknown, D = any>(
    error: Error | unknown,
    code?: string,
    config?: InternalAxiosRequestConfig<D>,
    request?: any,
    response?: AxiosResponse<T, D>,
    customProps?: object,
)
*/
