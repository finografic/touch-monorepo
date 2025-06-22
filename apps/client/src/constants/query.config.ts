/**
 * Query configuration constants for different types of data
 *
 * In DEVELOPMENT mode:
 * - Admin queries: Always refetch (staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true)
 * - Persistence: Admin queries excluded from localStorage cache
 * - Hard refresh: Always fetches fresh data
 *
 * In PRODUCTION mode:
 * - Admin queries: 30s cache, refetch on mount only
 * - User queries: 5min cache
 * - Static data: 15min cache
 */

// Development mode - always fetch fresh data
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

// Development override config
export const DEV_QUERY_CONFIG = {
  staleTime: 0, // Always stale
  gcTime: 30 * 1000, // 30 seconds
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

// User-facing data (can be cached longer)
export const USER_DATA_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
} as const;

// Admin data (changes more frequently, shorter cache)
export const ADMIN_DATA_QUERY_CONFIG = IS_DEVELOPMENT
  ? DEV_QUERY_CONFIG // In dev: always fresh
  : {
      staleTime: 30 * 1000, // 30 seconds in production
      gcTime: 2 * 60 * 1000, // 2 minutes
      refetchOnMount: true,
      refetchOnWindowFocus: false, // Less aggressive in production
    };

// Static/reference data (rarely changes, can cache longer)
export const STATIC_DATA_QUERY_CONFIG = {
  staleTime: 15 * 60 * 1000, // 15 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
} as const;

// Real-time data (always fresh)
export const REALTIME_DATA_QUERY_CONFIG = {
  staleTime: 0, // Always stale
  gcTime: 1 * 60 * 1000, // 1 minute
  refetchOnMount: true,
  refetchOnWindowFocus: true,
} as const;
