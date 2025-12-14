import { useMemo } from 'react';
import { useGetTranslationsUi } from 'queries/translations-ui';
import { useGetSupportedLanguages } from 'queries/supported-languages';
import { TranslationsUiDto } from '../utils/translations.dto';
import { useIsMutating } from '@tanstack/react-query';

import type { LanguageInfo } from 'types/models/supported-language.model';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { SectionData } from '../translations.types';

export interface UseUiTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: SectionData[];
}

export const useUiTranslationData = (): UseUiTranslationData => {
  const { data: translations, isLoading: translationsLoading } = useGetTranslationsUi();
  const { data: languages, isLoading: languagesLoading } = useGetSupportedLanguages();
  const isMutating = useIsMutating();

  const supportedLanguages = useMemo<RegionLocale[]>(() => {
    if (!languages) return [];
    return languages.map((language: LanguageInfo) => language.isoCode as RegionLocale);
  }, [languages]);

  const sections = useMemo<SectionData[]>(() => {
    if (!translations || supportedLanguages.length === 0) return [];

    const mapItems = (items: any[]) => items.map((item) => TranslationsUiDto.fromApi(item, supportedLanguages));

    return [
      {
        key: 'all',
        title: 'admin.pages.translationsUi.content.all.title',
        description: 'admin.pages.translationsUi.content.all.description',
        items: mapItems(translations ?? []),
      },
    ];
  }, [translations, supportedLanguages, translationsLoading, isMutating]);

  return {
    isLoading: translationsLoading || languagesLoading,
    supportedLanguages, // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};

