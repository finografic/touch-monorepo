export const ORDERS_READABLE_QUERY_KEYS = {
  all: ['orders-readable'] as const,
  lists: () => [...ORDERS_READABLE_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...ORDERS_READABLE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...ORDERS_READABLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDERS_READABLE_QUERY_KEYS.details(), id] as const,
};

export * from './useCreateOrder';
export * from './useGetOrderReadableById';
export * from './useGetOrdersReadable';
export * from './useUpdateOrder';
export * from './useUpdateTemperatureProfiles';
