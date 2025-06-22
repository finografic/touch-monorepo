import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EndpointHelper } from 'api/api.endpoints';
import { ADMIN_DATA_QUERY_CONFIG } from 'constants/query.config';
import type { SupportedLanguage } from 'types/models/supported-language.model';
import type { SupportedLanguageInput, SupportedLanguageUpdate } from './supported-languages.types';

// Query keys
export const supportedLanguagesKeys = {
  all: ['supportedLanguages'] as const,
  lists: () => [...supportedLanguagesKeys.all, 'list'] as const,
  list: (filters: string) => [...supportedLanguagesKeys.lists(), { filters }] as const,
  details: () => [...supportedLanguagesKeys.all, 'detail'] as const,
  detail: (id: string) => [...supportedLanguagesKeys.details(), id] as const,
};

// Get all supported languages
export const useGetSupportedLanguages = () => {
  return useQuery({
    queryKey: supportedLanguagesKeys.lists(),
    queryFn: async () => {
      const response = await EndpointHelper.getSupportedLanguages();
      return response.data || response; // Handle both wrapped and unwrapped responses
    },
    ...ADMIN_DATA_QUERY_CONFIG, // Use admin-specific caching strategy
  });
};

// Get single supported language
export const useGetSupportedLanguage = (id: string) => {
  return useQuery({
    queryKey: supportedLanguagesKeys.detail(id),
    queryFn: () => EndpointHelper.getSupportedLanguage?.(id),
    enabled: !!id,
  });
};

// Create supported language
export const useCreateSupportedLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupportedLanguageInput) => EndpointHelper.createSupportedLanguage?.(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
    },
  });
};

// Update supported language
export const useUpdateSupportedLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupportedLanguageUpdate }) =>
      EndpointHelper.updateSupportedLanguage?.(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
    },
  });
};

// Delete supported language
export const useDeleteSupportedLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => EndpointHelper.deleteSupportedLanguage?.(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
    },
  });
};

// Toggle isActive status for supported language
export const useToggleSupportedLanguageActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      EndpointHelper.updateSupportedLanguage?.(id, { isActive }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
    },
  });
};
