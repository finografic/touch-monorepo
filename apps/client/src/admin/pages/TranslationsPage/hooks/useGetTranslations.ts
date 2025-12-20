import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { api } from 'api';
import { transformFetchError } from '@workspace/core/api';
import { useGetSupportedLanguages } from 'queries/supported-languages';
import { TranslationsDto } from '../utils/translations.dto';
import { useIsMutating } from '@tanstack/react-query';

import type { LanguageInfo } from 'types/models/supported-language.model';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { SectionData } from '../translations.types';

export type TranslationDomain = 'ui' | 'app' | 'admin';

export interface UseUiTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: SectionData[];
}

export const useGetTranslations = ({
  domain = 'ui',
  groups = ['buttons', 'tables', 'time'],
}: {
  domain: TranslationDomain;
  groups?: string[];
}): UseUiTranslationData => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const queryKey = [`translations-${domain}`, location.pathname];

  // Invalidate queries when location changes to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [`translations-${domain}`] });
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
        const data = await api.get<any[]>(`/i18n/translations/${domain}`);
        // Return raw data - transformation happens in mapItems where we have supportedLanguages
        return data;
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    refetchOnMount: true, // Always refetch when component mounts (route changes)
    staleTime: 0, // Always consider data stale to force refetch
  });

  const { data: languages, isLoading: languagesLoading } = useGetSupportedLanguages();
  const isMutating = useIsMutating();

  const supportedLanguages = useMemo<RegionLocale[]>(() => {
    if (!languages) return [];
    return languages.map((language: LanguageInfo) => language.isoCode as RegionLocale);
  }, [languages]);

  const sections = useMemo<SectionData[]>(() => {
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
    // Only wait for translations to load, not languages (sections work without languages)
    isLoading: translationsLoading,
    supportedLanguages, // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};
