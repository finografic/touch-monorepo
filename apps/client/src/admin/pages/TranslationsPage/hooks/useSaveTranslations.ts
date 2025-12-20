import { useCallback } from 'react';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';
import { transformFetchError } from '@workspace/core/api';

import type { TranslationUiFormItem } from '../translations.types';
import { TranslationsDto } from '../../../utils/translations.dto';
import { useToast } from 'components/Toast/ToastContext';
import type { TranslationDomain } from './useGetTranslations';

export const useSaveTranslations = ({
  domain,
  supportedLanguages,
}: {
  domain: TranslationDomain;
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
    async ({ items }: { items: TranslationUiFormItem[] }) => {
      const created: TranslationUiFormItem[] = [];
      const updated: TranslationUiFormItem[] = [];

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
      await queryClient.invalidateQueries({
        queryKey: [`translations-${domain}`],
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
