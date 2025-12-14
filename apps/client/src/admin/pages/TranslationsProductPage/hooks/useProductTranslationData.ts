import { useMemo } from 'react';
import { useGetAllTranslations } from 'api/hooks/useTranslations';
import { useGetSupportedLanguages } from 'queries/supported-languages';
import { TranslationsDto } from '../utils/translations.dto';
import { useIsMutating } from '@tanstack/react-query';

import type { LanguageInfo } from 'types/models/supported-language.model';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { SectionData } from '../translations.types';

export interface UseProductTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: SectionData[];
}

export const useProductTranslationData = (): UseProductTranslationData => {
  const { data: translations, isLoading: translationsLoading } = useGetAllTranslations();
  const { data: languages, isLoading: languagesLoading } = useGetSupportedLanguages();
  const isMutating = useIsMutating();

  const supportedLanguages = useMemo<RegionLocale[]>(() => {
    if (!languages) return [];
    return languages.map((language: LanguageInfo) => language.isoCode as RegionLocale);
  }, [languages]);

  const sections = useMemo<SectionData[]>(() => {
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
    isLoading: translationsLoading || languagesLoading,
    supportedLanguages, // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};
