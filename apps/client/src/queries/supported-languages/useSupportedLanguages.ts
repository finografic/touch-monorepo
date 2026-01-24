import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EndpointsSupportedLanguages } from 'api/endpoints';

import type { SupportedLanguage } from 'types/models/supported-language.model';
import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
import type { SupportedLanguageUpdate } from './supported-languages.types';

// import type { SupportedLanguageInput, SupportedLanguageUpdate } from './supported-languages.types';

// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { EndpointsSupportedLanguages } from 'api/endpoints';

// import type { SupportedLanguage } from 'types/models/supported-language.model';
// import { ADMIN_DATA_QUERY_CONFIG } from 'config/api';
// import type { SupportedLanguageInput, SupportedLanguageUpdate } from './supported-languages.types';

// Query keys
export const supportedLanguagesKeys = {
  all: ['supportedLanguages'] as const,
  lists: () => [...supportedLanguagesKeys.all, 'list'] as const,
  list: (filters: string) => [...supportedLanguagesKeys.lists(), { filters }] as const,
  details: () => [...supportedLanguagesKeys.all, 'detail'] as const,
  detail: (id: string) => [...supportedLanguagesKeys.details(), id] as const,
  translationStatus: (isoCode: string) => [...supportedLanguagesKeys.all, 'translationStatus', isoCode] as const,
};

// Get all supported languages
export const useGetSupportedLanguages = () => {
  return useQuery<SupportedLanguage[]>({
    queryKey: supportedLanguagesKeys.lists(),
    queryFn: EndpointsSupportedLanguages.getAll,
    ...ADMIN_DATA_QUERY_CONFIG, // Use admin-specific caching strategy
  });
};

// Get single supported language
export const useGetSupportedLanguage = (id: string) => {
  return useQuery<SupportedLanguage>({
    queryKey: supportedLanguagesKeys.detail(id),
    queryFn: () => EndpointsSupportedLanguages.getById(id),
    enabled: !!id,
  });
};

// Create supported language
export const useCreateSupportedLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EndpointsSupportedLanguages.create,
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
      EndpointsSupportedLanguages.update(id, data),
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
    mutationFn: EndpointsSupportedLanguages.delete,
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
      EndpointsSupportedLanguages.update(id, { isActive }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
    },
  });
};

// Get translation status for a language (with polling)
export const useTranslationStatus = (isoCode: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: supportedLanguagesKeys.translationStatus(isoCode || ''),
    queryFn: () => EndpointsSupportedLanguages.getTranslationStatus(isoCode!),
    enabled: enabled && !!isoCode,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll every 2 seconds if translation is in progress
      if (data?.status === 'pending' || data?.status === 'in-progress') {
        return 2000;
      }
      // Stop polling if completed or failed
      return false;
    },
  });
};
