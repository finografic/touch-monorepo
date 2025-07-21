export const SLOT_CONFIGURATIONS_QUERY_KEYS = {
  all: ['slot-configurations'] as const,
  lists: () => [...SLOT_CONFIGURATIONS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: string) => [...SLOT_CONFIGURATIONS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...SLOT_CONFIGURATIONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (slotNumber: number) => [...SLOT_CONFIGURATIONS_QUERY_KEYS.details(), slotNumber] as const,
};

export * from './useBulkUpdateSlotConfigurations';
export * from './useCreateSlotConfiguration';
export * from './useDeleteSlotConfiguration';
export * from './useGetSlotConfiguration';
export * from './useGetSlotConfigurations';
export * from './useResetSlotConfigurations';
export * from './useUpdateSlotConfiguration';
