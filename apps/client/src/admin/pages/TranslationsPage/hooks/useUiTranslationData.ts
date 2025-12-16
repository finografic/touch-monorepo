import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api';
import { transformFetchError } from '@workspace/core/api';
import { useGetSupportedLanguages } from 'queries/supported-languages';
import { TranslationsUiDto } from '../utils/translations.dto';
import { useIsMutating } from '@tanstack/react-query';

import type { LanguageInfo } from 'types/models/supported-language.model';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { SectionData } from '../translations.types';

export type TranslationNamespace = 'ui' | 'app' | 'admin';

export interface UseUiTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: SectionData[];
}

export const useUiTranslationData = (
  namespace: TranslationNamespace = 'ui',
  groups: string[] = ['buttons', 'tables', 'time'],
): UseUiTranslationData => {
  // Fetch translations based on namespace
  const { data: translations, isLoading: translationsLoading } = useQuery({
    queryKey: [`translations-${namespace}`],
    queryFn: async () => {
      try {
        const data = await api.get<any[]>(`/translations-${namespace}`);
        // Return raw data - transformation happens in mapItems where we have supportedLanguages
        return data;
      } catch (error) {
        throw transformFetchError(error);
      }
    },
  });

  const { data: languages, isLoading: languagesLoading } = useGetSupportedLanguages();
  const isMutating = useIsMutating();

  const supportedLanguages = useMemo<RegionLocale[]>(() => {
    if (!languages) return [];
    return languages.map((language: LanguageInfo) => language.isoCode as RegionLocale);
  }, [languages]);

  const sections = useMemo<SectionData[]>(() => {
    if (!translations || supportedLanguages.length === 0) return [];

    const mapItems = (items: any[]) =>
      items.map((item) => TranslationsUiDto.fromApi(item, supportedLanguages));

    // Filter items by section prefix
    const filterByPrefix = (prefix: string) => {
      return translations.filter((item) => item.key.startsWith(`${prefix}.`));
    };

    const namespaceKey = namespace.charAt(0).toUpperCase() + namespace.slice(1);

    return groups.map((group) => ({
      key: group,
      title: `admin.pages.translations${namespaceKey}.content.${group}.title`,
      description: `admin.pages.translations${namespaceKey}.content.${group}.description`,
      items: mapItems(filterByPrefix(group)),
    }));
  }, [translations, supportedLanguages, translationsLoading, isMutating, namespace, groups]);

  return {
    isLoading: translationsLoading || languagesLoading,
    supportedLanguages, // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};
