import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supportedLanguagesEndpoints } from 'api/endpoints';
import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
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
  return useQuery<SupportedLanguage[]>({
    queryKey: supportedLanguagesKeys.lists(),
    queryFn: supportedLanguagesEndpoints.getAll,
    ...ADMIN_DATA_QUERY_CONFIG, // Use admin-specific caching strategy
  });
};

// Get single supported language
export const useGetSupportedLanguage = (id: string) => {
  return useQuery<SupportedLanguage>({
    queryKey: supportedLanguagesKeys.detail(id),
    queryFn: () => supportedLanguagesEndpoints.getById(id),
    enabled: !!id,
  });
};

// Create supported language
export const useCreateSupportedLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportedLanguagesEndpoints.create,
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
      supportedLanguagesEndpoints.update(id, data),
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
    mutationFn: supportedLanguagesEndpoints.delete,
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
      supportedLanguagesEndpoints.update(id, { isActive }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
    },
  });
};
