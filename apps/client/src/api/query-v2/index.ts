export * from './builder';
export * from './types';

// Common query helpers
export const CommonQueries = {
  pagination: (page: number, size: number) => ({
    $skip: (page - 1) * size,
    $limit: size,
  }),
  sortDesc: (field: string) => ({
    $sort: { [field]: -1 },
  }),
  sortAsc: (field: string) => ({
    $sort: { [field]: 1 },
  }),
} as const;
