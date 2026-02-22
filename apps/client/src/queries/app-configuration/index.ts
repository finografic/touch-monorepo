export const APP_CONFIGURATION_QUERY_KEYS = {
  all: ['app-configuration'] as const,
  lists: () => [...APP_CONFIGURATION_QUERY_KEYS.all, 'list'] as const,
  list: () => [...APP_CONFIGURATION_QUERY_KEYS.lists()] as const,
  details: () => [...APP_CONFIGURATION_QUERY_KEYS.all, 'detail'] as const,
  detail: (key: string) => [...APP_CONFIGURATION_QUERY_KEYS.details(), key] as const,
};

export * from './useGetAppConfigurationByKey';
export * from './useGetAppConfigurations';
export * from './useGetSlotSpecialConfig';
export * from './useUpdateAppConfiguration';
export * from './useUpdateSlotSpecialConfig';
