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

    // Filter items by section prefix
    const filterByPrefix = (prefix: string) => {
      return translations.filter((item) => item.key.startsWith(prefix));
    };

    return [
      {
        key: 'buttons',
        title: 'admin.pages.translationsUi.content.buttons.title',
        description: 'admin.pages.translationsUi.content.buttons.description',
        items: mapItems(filterByPrefix('buttons.')),
      },
      {
        key: 'tables',
        title: 'admin.pages.translationsUi.content.tables.title',
        description: 'admin.pages.translationsUi.content.tables.description',
        items: mapItems(filterByPrefix('tables.')),
      },
      {
        key: 'time',
        title: 'admin.pages.translationsUi.content.time.title',
        description: 'admin.pages.translationsUi.content.time.description',
        items: mapItems(filterByPrefix('time.')),
      },
    ];
  }, [translations, supportedLanguages, translationsLoading, isMutating]);

  return {
    isLoading: translationsLoading || languagesLoading,
    supportedLanguages, // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};

