import { useMemo } from 'react';
import { useGetAllTranslations } from 'queries/translations';
import { TranslationsDto } from '../utils/translationsProduct.dto';
import { useIsMutating } from '@tanstack/react-query';
import { useAppConfig } from 'providers/AppConfigProvider';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsSection } from '../translationsProduct.types';

export interface UseProductTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: TranslationsSection[];
}

export const useProductTranslationData = (): UseProductTranslationData => {
  const { data: translations, isLoading: translationsLoading } = useGetAllTranslations();
  const { supportedLanguages } = useAppConfig();
  const isMutating = useIsMutating();

  const sections = useMemo<TranslationsSection[]>(() => {
    if (!translations || supportedLanguages.length === 0) return [];

    const mapItems = (items: any[]) => items.map((item) => TranslationsDto.fromApi(item, supportedLanguages));

    return [
      {
        key: 'drinkTypes',
        title: 'admin.pages.translations.content.drinkTypes.title',
        description: 'admin.pages.translations.content.drinkTypes.description',
        items: mapItems(translations.drinkTypes ?? []),
      },
      {
        key: 'drinkSubtypes',
        title: 'admin.pages.translations.content.drinkSubtypes.title',
        description: 'admin.pages.translations.content.drinkSubtypes.description',
        items: mapItems(translations.drinkSubtypes ?? []),
      },
      {
        key: 'volumes',
        title: 'admin.pages.translations.content.volumes.title',
        description: 'admin.pages.translations.content.volumes.description',
        items: mapItems(translations.volumes ?? []),
      },
      {
        key: 'containerTypes',
        title: 'admin.pages.translations.content.containerTypes.title',
        description: 'admin.pages.translations.content.containerTypes.description',
        items: mapItems(translations.containerTypes ?? []),
      },
    ];
  }, [translations, supportedLanguages, translationsLoading, isMutating]);

  return {
    isLoading: translationsLoading,
    supportedLanguages: (supportedLanguages || []) as RegionLocale[], // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};
