/**
 * Modern Fetch-based API Client [Claude v3.5]
 *
 * Replaces Axios with native fetch for better performance and modern patterns.
 * Provides consistent error handling, request/response transformation, and authentication.
 */

import type { ErrorResponse } from '@workspace/core/api';

// Base configuration
const API_BASE_URL = 'http://localhost:4040/api';

// Request configuration interface
interface FetchConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  // Standard fetch options
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: 'include' | 'same-origin' | 'omit';
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  integrity?: string;
  keepalive?: boolean;
  mode?: 'cors' | 'no-cors' | 'same-origin';
  signal?: AbortSignal;
}

// Response wrapper for consistent structure
interface FetchResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
}

// Error class for API errors
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

/**
 * Creates a fetch-based API client with consistent configuration
 */
class FetchClient {
  private baseURL: string;
  private defaultConfig: FetchConfig;

  constructor(baseURL: string = API_BASE_URL, defaultConfig: FetchConfig = {}) {
    this.baseURL = baseURL;
    this.defaultConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Always include cookies for auth
      ...defaultConfig,
    };
  }

  /**
   * Creates a timeout promise that rejects after specified milliseconds
   */
  private createTimeout(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new FetchError('Request timeout', 408)), timeout);
    });
  }

  /**
   * Transforms fetch response to consistent format
   */
  private async transformResponse<T>(response: Response): Promise<FetchResponse<T>> {
    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      ok: response.ok,
    };
  }

  /**
   * Determines if an error is retryable
   */
  private isRetryableError(error: FetchError): boolean {
    // Retry on network errors, 5xx server errors, and 408 timeout
    return (
      error.status === 0 || // Network error
      error.status >= 500 || // Server errors
      error.status === 408 || // Timeout
      error.status === 429 // Rate limiting
    );
  }

  /**
   * Performs exponential backoff retry
   */
  private async retryRequest<T>(
    requestFn: () => Promise<FetchResponse<T>>,
    retries: number,
    retryDelay: number,
  ): Promise<FetchResponse<T>> {
    let lastError: FetchError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as FetchError;

        // Don't retry on last attempt or non-retryable errors
        if (attempt === retries || !this.isRetryableError(lastError)) {
          throw lastError;
        }

        // Wait before retrying (exponential backoff)
        const delay = retryDelay * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Core request method with timeout, retry, and error handling
   */
  private async request<T>(endpoint: string, config: FetchConfig = {}): Promise<FetchResponse<T>> {
    const {
      baseURL = this.baseURL,
      timeout = 10000,
      retries = 3,
      retryDelay = 1000,
      ...fetchConfig
    } = config;

    const url = `${baseURL}${endpoint}`;
    const finalConfig = {
      ...this.defaultConfig,
      ...fetchConfig,
    };

    const requestFn = async (): Promise<FetchResponse<T>> => {
      // Create timeout promise
      const timeoutPromise = this.createTimeout(timeout);

      // Create fetch promise
      const fetchPromise = fetch(url, finalConfig).then(async (response) => {
        const transformed = await this.transformResponse<T>(response);

        if (!response.ok) {
          const error = new FetchError(
            transformed.data?.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            transformed.data,
            this.isRetryableError(new FetchError('', response.status)),
          );
          throw error;
        }

        return transformed;
      });

      // Race between fetch and timeout
      return Promise.race([fetchPromise, timeoutPromise]);
    };

    // Apply retry logic if retries > 0
    if (retries > 0) {
      return this.retryRequest(requestFn, retries, retryDelay);
    }

    return requestFn();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: FetchConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'GET' });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: FetchConfig): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: FetchConfig): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: FetchConfig): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: FetchConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'DELETE' });
    return response.data;
  }

  /**
   * Update default configuration
   */
  setDefaults(config: Partial<FetchConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Get current default configuration
   */
  getDefaults(): FetchConfig {
    return { ...this.defaultConfig };
  }
}

// Create and export the default client instance
export const fetchClient = new FetchClient();

// Export the class for creating custom instances
export { FetchClient };
