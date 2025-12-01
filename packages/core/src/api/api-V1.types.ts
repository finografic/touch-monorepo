/**
 * @deprecated Legacy types kept only for backward compatibility.
 *
 * Axios has been removed from the project and the canonical API response
 * types now live in `api.types.ts`. This file simply re-exports those
 * types so any old imports continue to work without pulling in `axios`.
 */
export type { ApiResponse, ApiResponse_DEV } from './api.types';
