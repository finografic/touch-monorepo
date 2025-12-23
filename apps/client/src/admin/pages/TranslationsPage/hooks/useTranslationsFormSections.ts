import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { api } from 'api';
import { transformFetchError } from '@workspace/core/api';
import { TranslationsDto } from '../utils/translations.dto';
import { useAppConfig } from 'providers/AppConfigProvider';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsSection } from '../translations.types';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';
import { GET_TRANSLATIONS_QUERYKEY } from 'queries/translations';

export interface UseUiTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: TranslationsSection[];
}

export const useTranslationsFormSections = ({
  translations,
  groups = ['buttons', 'tables', 'time'],
}: {
  translations: any[];
  groups?: string[];
}): UseUiTranslationData => {
  const appConfig = useAppConfig();
  const supportedLanguages = appConfig.supportedLanguages as RegionLocale[];

  const sections = useMemo<TranslationsSection[]>(() => {
    // Don't wait for supportedLanguages - we can create sections without them
    // The DTO transformation will handle empty languages gracefully
    if (!translations || !Array.isArray(translations) || translations.length === 0) {
      return [];
    }

    const mapItems = (items: any[]) => {
      // Always use DTO transformation - it handles empty languages gracefully
      // If languages aren't loaded yet, use empty array (DTO will still work)
      const languagesToUse = supportedLanguages && supportedLanguages.length > 0 ? supportedLanguages : [];
      return items.map((item) => TranslationsDto.fromApi(item, languagesToUse));
    };

    // Filter items by section prefix
    // For admin/app domains, keys are structured as: domain.pages.*, domain.components.*, etc.
    // For ui domain, keys are structured as: buttons.*, tables.*, time.* (no domain prefix)
    const filterByPrefix = (group: string) => {
      // Admin/App domains: keys are domain.group.* (e.g., admin.pages.*, app.components.*)
      return translations.filter((item) => item.key?.startsWith(`${domain}.${group}.`));
    };

    const domainKey = domain.charAt(0).toUpperCase() + domain.slice(1);

    const result = groups.map((group) => {
      const filteredItems = filterByPrefix(group);
      return {
        key: group,
        title: `admin.pages.translations${domainKey}.content.${group}.title`,
        description: `admin.pages.translations${domainKey}.content.${group}.description`,
        items: mapItems(filteredItems),
      };
    });

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[useGetTranslations]', {
        domain,
        groups,
        translationsCount: translations.length,
        sectionsCount: result.length,
        sectionsWithItems: result.filter((s) => s.items.length > 0).length,
        sampleKeys: translations.slice(0, 3).map((t) => t.key),
      });
    }

    return result;
  }, [translations, supportedLanguages, domain, groups]);

  return {
    isLoading: translationsLoading,
    supportedLanguages,
    sections,
  };
};
