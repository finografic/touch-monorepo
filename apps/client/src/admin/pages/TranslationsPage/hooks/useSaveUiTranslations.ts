import { useCallback } from 'react';
import type { RegionLocale } from '@workspace/config/i18n.config';

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

      return {
        savedItems: [...created, ...updated],
      };
    },
    [supportedLanguages, createTranslationUi, updateTranslationUi, toast, queryClient],
  );

  return {
    save,
    isLoading: createTranslationUi.isPending || updateTranslationUi.isPending,
  };
};

