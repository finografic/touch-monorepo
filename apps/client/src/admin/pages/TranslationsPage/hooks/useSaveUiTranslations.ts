import { useCallback } from 'react';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { useTranslation } from 'react-i18next';

import { useCreateTranslationUi, useUpdateTranslationUi } from 'queries/translations-ui';

import type { TranslationUiFormItem } from '../translations.types';
import { TranslationsUiDto } from '../utils/translations.dto';
import { useToast } from 'components/Toast/ToastContext';
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { useQueryClient } from '@tanstack/react-query';
import { GET_TRANSLATIONS_UI_QUERYKEY } from 'queries/translations-ui';

export const useSaveUiTranslations = (supportedLanguages: RegionLocale[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { i18n } = useTranslation();

  const createTranslationUi = useCreateTranslationUi();
  const updateTranslationUi = useUpdateTranslationUi();

  const save = useCallback(
    async ({ items }: { items: TranslationUiFormItem[] }) => {
      const created: TranslationUiFormItem[] = [];
      const updated: TranslationUiFormItem[] = [];

      for (const item of items) {
        const payload = TranslationsUiDto.toApi(item, supportedLanguages);

        // CREATE
        if (item.id.startsWith('temp-')) {
          const entity = await createTranslationUi.mutateAsync({
            key: payload.key,
            translations: payload.translations,
            description: payload.description || undefined,
            isActive: true,
          });

          created.push({ ...item, id: entity.id });
          continue;
        }

        // UPDATE (ONLY items passed in)
        await updateTranslationUi.mutateAsync({
          id: item.id,
          updates: {
            key: payload.key,
            translations: payload.translations,
            description: payload.description || undefined,
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

      // Invalidate translations UI queries
      await queryClient.invalidateQueries({
        queryKey: GET_TRANSLATIONS_UI_QUERYKEY,
      });

      // Reload i18next resources to reflect changes immediately
      // Determine which namespaces to reload based on saved items
      const namespacesToReload = new Set<string>();
      for (const item of [...created, ...updated]) {
        if (item.key.startsWith('buttons.') || item.key.startsWith('tables.')) {
          namespacesToReload.add('ui');
        } else if (item.key.startsWith('time.')) {
          namespacesToReload.add('time');
        }
      }

      // Reload each affected namespace
      for (const ns of namespacesToReload) {
        await i18n.reloadResources(i18n.language, ns);
      }

      return {
        savedItems: [...created, ...updated],
      };
    },
    [supportedLanguages, createTranslationUi, updateTranslationUi, toast, queryClient, i18n],
  );

  return {
    save,
    isLoading: createTranslationUi.isPending || updateTranslationUi.isPending,
  };
};

