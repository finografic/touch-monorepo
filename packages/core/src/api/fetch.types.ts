/**
 * Fetch Client Types
 *
 * Shared types for fetch-based HTTP clients.
 * These types are framework-agnostic and can be used across applications.
 */

/**
 * Request configuration. Extends native RequestInit with additional features.
 *
 * @property timeout - Request timeout in milliseconds
 * @property params - URL query parameters
 * @property baseURL - Override base URL for specific requests
 */
export interface FetchRequestConfig extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
  baseURL?: string;
}

/**
 * Normalized response. Provides consistent structure for all HTTP responses.
 *
 * @property data - Response payload
 * @property status - HTTP status code
 * @property statusText - HTTP status text
 * @property headers - Response headers
 * @property ok - True when status is 2xx
 */
export interface FetchResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

/**
 * Fetch-based API error with request context.
 *
 * @param message - Error message
 * @param status - HTTP status code (0 for network errors)
 * @param data - Response body if available
 * @param isRetryable - Whether the request can be retried
 */
export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
    public isRetryable: boolean = false,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}
