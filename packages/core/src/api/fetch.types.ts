/**
 * Fetch Client Types
 *
 * Shared types for fetch-based HTTP clients.
 * These types are framework-agnostic and can be used across applications.
 */

/**
 * Request configuration interface
 * Extends native RequestInit with additional features
 */
export interface FetchRequestConfig extends RequestInit {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** URL query parameters */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Override base URL for specific requests */
  baseURL?: string;
}

/**
 * Normalized response interface
 * Provides consistent structure for all HTTP responses
 */
export interface FetchResponse<T = any> {
  /** Response data */
  data: T;
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response headers */
  headers: Headers;
  /** Whether response was successful (2xx status) */
  ok: boolean;
}

/**
 * Custom error class for fetch-based API errors
 * Contains additional context about failed requests
 */
export class FetchError extends Error {
  constructor(
    message: string,
    /** HTTP status code (0 for network errors) */
    public status: number,
    /** Response data if available */
    public data?: any,
    /** Whether error is retryable */
    public isRetryable: boolean = false,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

