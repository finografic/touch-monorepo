/**
 * @deprecated Legacy experimental types kept only for backward compatibility.
 *
 * Axios has been removed from the project; the canonical response types now
 * live in `api.types.ts`. This file now only re-exports those types so any
 * old imports continue to work without bringing back `axios` as a dependency.
 */
export type { ApiResponse } from './api.types';
