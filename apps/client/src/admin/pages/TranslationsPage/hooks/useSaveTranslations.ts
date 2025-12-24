import { useCallback } from 'react';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { TranslationsFormItem } from '../../TranslationPages/types/translations.types';
import { TranslationsDto } from '../utils/translations.dto';
import { useToast } from 'components/Toast/ToastContext';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';
import { GET_TRANSLATIONS_QUERYKEY } from 'queries/translations';

export const useSaveTranslations = ({
  domain,
  supportedLanguages,
}: {
  domain: I18nTranslationsDomain;
  supportedLanguages: RegionLocale[];
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { i18n } = useTranslation();

  const createMutation = useMutation({
    mutationFn: async (data: {
      key: string;
      translations: Record<string, string>;
      description?: string;
      isActive?: boolean;
    }) => {
      const response = await api.post<any>(`/translations/${domain}`, data);
      // Return raw response - DTO transformation happens in useGetTranslations
      return response?.data || response;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { key?: string; translations?: Record<string, string>; description?: string };
    }) => {
      const response = await api.patch<any>(`/translations/${domain}/${id}`, updates);
      // Return raw response - DTO transformation happens in useGetTranslations
      return response?.data || response;
    },
  });

  const save = useCallback(
    async ({ items }: { items: TranslationsFormItem[] }) => {
      const created: TranslationsFormItem[] = [];
      const updated: TranslationsFormItem[] = [];

      for (const item of items) {
        const payload = TranslationsDto.toApi(item, supportedLanguages);

        // CREATE
        if (item.id.startsWith('temp-')) {
          const entity = await createMutation.mutateAsync({
            key: payload.key,
            translations: payload.translations,
            isActive: true,
          });

          created.push({ ...item, id: entity.id });
          continue;
        }

        // UPDATE (ONLY items passed in)
        await updateMutation.mutateAsync({
          id: item.id,
          updates: {
            key: payload.key,
            translations: payload.translations,
          },
        });

        updated.push(item);
      }

      if (created.length || updated.length) {
        toast({
          variant: 'success',
          message: `Saved ${created.length} created, ${updated.length} updated`,
        });
      }

      // Invalidate translations queries
      // Use the same query key pattern as useGetTranslations
      // This will match queries like [...GET_TRANSLATIONS_QUERYKEY, domain, location.pathname]
      await queryClient.invalidateQueries({
        queryKey: [...GET_TRANSLATIONS_QUERYKEY, domain],
      });

      // Reload i18next resources to reflect changes immediately
      // All translations are served under 'translations' domain
      await i18n.reloadResources(i18n.language, 'translations');

      return {
        savedItems: [...created, ...updated],
      };
    },
    [domain, supportedLanguages, createMutation, updateMutation, toast, queryClient, i18n],
  );

  return {
    save,
    isLoading: createMutation.isPending || updateMutation.isPending,
  };
};
