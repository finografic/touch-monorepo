// Re-export API types
export * from './api.types';

export interface ApiResponse<T> {
  data: T;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
