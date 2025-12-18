import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const queryClient = useQueryClient();
  const queryKey = [`translations-${namespace}`, location.pathname];

  // Invalidate queries when location changes to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [`translations-${namespace}`] });
  }, [location.pathname, namespace, queryClient]);

  // Fetch translations based on namespace
  // Include location.pathname in queryKey to force refetch on route change
  const { data: translations, isLoading: translationsLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await api.get<any[]>(`/translations/${namespace}`);
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
      return items.map((item) => TranslationsUiDto.fromApi(item, languagesToUse));
    };

    // Filter items by section prefix
    // For admin/app namespaces, keys are structured as: namespace.pages.*, namespace.components.*, etc.
    // For ui namespace, keys are structured as: buttons.*, tables.*, time.* (no namespace prefix)
    const filterByPrefix = (group: string) => {
      if (namespace === 'ui') {
        // UI namespace: keys are directly buttons.*, tables.*, time.*
        return translations.filter((item) => item.key?.startsWith(`${group}.`));
      } else {
        // Admin/App namespaces: keys are namespace.group.* (e.g., admin.pages.*, app.components.*)
        return translations.filter((item) => item.key?.startsWith(`${namespace}.${group}.`));
      }
    };

    const namespaceKey = namespace.charAt(0).toUpperCase() + namespace.slice(1);

    const result = groups.map((group) => {
      const filteredItems = filterByPrefix(group);
      return {
        key: group,
        title: `admin.pages.translations${namespaceKey}.content.${group}.title`,
        description: `admin.pages.translations${namespaceKey}.content.${group}.description`,
        items: mapItems(filteredItems),
      };
    });

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[useUiTranslationData]', {
        namespace,
        groups,
        translationsCount: translations.length,
        sectionsCount: result.length,
        sectionsWithItems: result.filter((s) => s.items.length > 0).length,
        sampleKeys: translations.slice(0, 3).map((t) => t.key),
      });
    }

    return result;
  }, [translations, supportedLanguages, namespace, groups]);

  return {
    // Only wait for translations to load, not languages (sections work without languages)
    isLoading: translationsLoading,
    supportedLanguages, // ["es-ES","en-GB","ca-ES"]
    sections, // RHF-ready
  };
};
