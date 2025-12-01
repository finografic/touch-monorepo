/**
 * @deprecated This file is kept for backward compatibility during migration.
 * Use fetch.utils.ts instead for new code.
 *
 * This file re-exports from fetch.utils.ts to maintain compatibility
 * with existing code that imports from api.utils.
 */

// Re-export fetch-based utilities (which are fetch-agnostic)
export {
  isRetryableError,
  transformFetchError,
  transformAxiosError, // Legacy alias for backward compatibility
} from './fetch.utils';

// Custom HTTP Exception class for better error handling
export class HttpException extends Error {
  constructor(
    message: string,
    public cause: {
      response?: {
        data?: unknown;
        status?: number;
        headers?: Record<string, string>;
      };
    },
  ) {
    super(message);
    this.name = 'HttpException';
  }
}
