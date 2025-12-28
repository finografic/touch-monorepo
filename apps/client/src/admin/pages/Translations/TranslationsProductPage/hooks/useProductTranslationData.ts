import { useMemo } from 'react';
import type { RegionLocale } from '@workspace/config/i18n.config';

import { useIsMutating } from '@tanstack/react-query';

import { useAppConfig } from 'providers/AppConfigProvider';
import { useGetAllTranslations } from 'queries/translations';

import type { SectionKey, TranslationsSection } from '../translationsProduct.types';
import { TranslationsDto } from '../utils/translationsProduct.dto';

export interface UseProductTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: TranslationsSection[];
}

export const useProductTranslationData = ({
  domain,
  groups,
}: {
  domain: string;
  groups: string[];
}): UseProductTranslationData => {
  const { data: translations, isLoading: translationsLoading } = useGetAllTranslations();
  const { supportedLanguages } = useAppConfig();
  const isMutating = useIsMutating();

  const sections = useMemo<TranslationsSection[]>(() => {
    if (!translations || supportedLanguages.length === 0) return [];

    const mapItems = (items: any[]) => items.map((item) => TranslationsDto.fromApi(item, supportedLanguages));

    // Map of group keys to their data and metadata
    const sectionMap: Record<string, { data: any[]; title: string; description: string }> = {
      drinkTypes: {
        data: translations.drinkTypes ?? [],
        title: 'admin.pages.translations.content.drinkTypes.title',
        description: 'admin.pages.translations.content.drinkTypes.description',
      },
      drinkSubtypes: {
        data: translations.drinkSubtypes ?? [],
        title: 'admin.pages.translations.content.drinkSubtypes.title',
        description: 'admin.pages.translations.content.drinkSubtypes.description',
      },
      volumes: {
        data: translations.volumes ?? [],
        title: 'admin.pages.translations.content.volumes.title',
        description: 'admin.pages.translations.content.volumes.description',
      },
      containerTypes: {
        data: translations.containerTypes ?? [],
        title: 'admin.pages.translations.content.containerTypes.title',
        description: 'admin.pages.translations.content.containerTypes.description',
      },
    };

    // Filter sections based on groups param, maintaining order from groups array
    return groups
      .filter((group) => sectionMap[group])
      .map((group) => ({
        group: group as SectionKey,
        title: sectionMap[group].title,
        description: sectionMap[group].description,
        items: mapItems(sectionMap[group].data),
      }));
  }, [translations, supportedLanguages, translationsLoading, isMutating, groups, domain]);

  return {
    isLoading: translationsLoading,
    supportedLanguages: (supportedLanguages || []) as RegionLocale[], // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};
