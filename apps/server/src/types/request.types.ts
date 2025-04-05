import type { ConstUpperEnumOf } from 'types/utility.types';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export const REQUEST_METHOD: ConstUpperEnumOf<RequestMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

export const { GET, POST, PUT, DELETE, OPTIONS } = REQUEST_METHOD;
