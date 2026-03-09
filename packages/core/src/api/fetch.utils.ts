/**
 * Fetch-based transformation and utility functions
 * - URL building utilities
 * - Response normalization utilities
 */

import type { FetchResponse } from './fetch.types';
import { FetchError } from './fetch.types';

/**
 * Builds URL with query parameters
 * Handles endpoints with or without leading slashes correctly
 *
 * @example
 * // in:   buildUrl('http://localhost:4040/api', 'users', { page: 1 })
 * // out: 'http://localhost:4040/api/users?page=1'
 */
export function buildUrl(
  baseURL: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | null | undefined>,
): string {
  const baseUrlObj = new URL(baseURL);

  // Remove leading slash from endpoint if present (to make it relative)
  // This ensures the baseURL's path (e.g., /api) is preserved
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  const basePath = baseUrlObj.pathname.endsWith('/')
    ? baseUrlObj.pathname.slice(0, -1) // Remove trailing slash
    : baseUrlObj.pathname;
  const fullPathname = `${basePath}/${normalizedEndpoint}`;

  const url = new URL(fullPathname, baseUrlObj.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Normalizes fetch response to consistent structure
 * Parses JSON response body into a consistent format
 *
 * @throws {FetchError} If response cannot be parsed as JSON
 */
export async function normalizeResponse<T>(response: Response): Promise<FetchResponse<T>> {
  let data: T;

  try {
    const text = await response.text();
    if (!text.trim()) {
      data = {} as T;
    } else {
      data = JSON.parse(text) as T;
    }
  } catch (parseError) {
    throw new FetchError(
      `Failed to parse response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
      response.status,
      undefined,
      false,
    );
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    ok: response.ok,
  };
}
