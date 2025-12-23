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
import type { TranslationsModel } from 'types/models/translations.model';
import { useTranslation } from 'react-i18next';

export interface UseUiTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: TranslationsSection[];
}

export const useGetTranslations = ({
  domain,
  groups = ['buttons', 'tables', 'time'],
}: {
  domain: I18nTranslationsDomain;
  groups?: string[];
}): UseUiTranslationData => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryClient = useQueryClient();
  const queryKey = [...GET_TRANSLATIONS_QUERYKEY, domain, location.pathname];

  // NOTE: invalidate queries when location changes - force data refresh when route changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [...GET_TRANSLATIONS_QUERYKEY, domain] });
  }, [location.pathname, domain, queryClient]);

  // Fetch translations based on domain (domain)
  // Use domain-specific endpoint: /api/i18n/translations/:domain
  // Returns array format (same as /translations/:domain) for CMS compatibility
  // Include location.pathname in queryKey to force refetch on route change
  const { data: translations, isLoading: translationsLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        // Fetch from domain-specific endpoint (returns array format)
        const data = await api.get<TranslationsModel[]>(`/i18n/translations/${domain}`);
        // Return raw data - transformation happens in mapItems where we have supportedLanguages
        return data;
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    refetchOnMount: true, // Always refetch when component mounts (route changes)
    staleTime: 0, // Always consider data stale to force refetch
  });

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
        group,
        title: t(`admin.pages.translations.domains.title`, { group }),
        description: `admin.pages.translations.domains.${domain}.description`,
        items: mapItems(filteredItems),
      };
    });

    // Ensure 'pages' section is first if it exists
    const pagesIndex = result.findIndex((section) => section.group === 'pages');
    if (pagesIndex > 0) {
      const pagesSection = result.splice(pagesIndex, 1)[0];
      result.unshift(pagesSection);
    }

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[useGetTranslations]', {
        domain,
        groups,
        translationsCount: translations.length,
        sectionsCount: result.length,
        sectionsWithItems: result.filter((s) => s.items.length > 0).length,
        sampleKeys: translations.slice(0, 150).map((t) => t.key),
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
