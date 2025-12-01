/**
 * Normalized API Response interface
 * 
 * This is the standard response format from the server.
 * The client automatically unwraps this to return just `data` directly.
 * 
 * @example
 * // Server returns: { data: User, message?: string, timestamp: number }
 * // Client receives: User (just the data)
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: number;
}

/**
 * Development-only response format (without timestamp)
 */
export interface ApiResponse_DEV<T> {
  data: T;
}
