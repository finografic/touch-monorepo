import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { transformFetchError } from '@workspace/core/api';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import { useAppConfig } from 'providers/AppConfigProvider';
import { GET_TRANSLATIONS_QUERYKEY } from 'queries/translations';

import type { TranslationsModel } from 'types/models/translations.model';
import type { TranslationsSection } from '../../shared/types/translations.types';
import { sortPageItemsWithDomainsGrouped } from '../utils/domain.utils';
import { sortPageSectionByNavOrder } from '../utils/page-sections.utils';
import { TranslationsDto } from '../utils/translations.dto';

export interface UseUiTranslationData {
  isLoading: boolean;
  supportedLanguages: RegionLocale[];
  sections: TranslationsSection[];
}

export const useGetTranslations = ({
  domain,
  groups,
}: {
  domain: I18nTranslationsDomain;
  groups?: string[];
}): UseUiTranslationData => {
  const { t } = useTranslation();
  const location = useLocation();
  const appConfig = useAppConfig();
  const supportedLanguages = appConfig.supportedLanguages as RegionLocale[];
  const queryClient = useQueryClient();

  // Invalidate on route change so navigating between domains always refetches
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [...GET_TRANSLATIONS_QUERYKEY, domain] });
  }, [location.pathname, domain, queryClient]);

  const { data: translations, isLoading: translationsLoading } = useQuery({
    queryKey: [...GET_TRANSLATIONS_QUERYKEY, domain, location.pathname],
    queryFn: async () => {
      try {
        return await api.get<TranslationsModel[]>(`/i18n/translations/${domain}`);
      } catch (error) {
        throw transformFetchError(error);
      }
    },
    refetchOnMount: true, // Always refetch on mount so route changes get fresh data
    staleTime: 0,
  });

  const sections = useMemo<TranslationsSection[]>(() => {
    if (!translations?.length) return [];

    const activeLanguages = supportedLanguages?.length ? supportedLanguages : [];
    const mapItems = (items: any[]) =>
      items.map((item) => TranslationsDto.fromApi(item, activeLanguages));

    const filterByPrefix = (group: string) =>
      translations.filter((item) => item.key?.startsWith(`${domain}.${group}.`));

    const result = groups.map((group) => {
      let sortedItems = filterByPrefix(group);

      if (group === 'pages') {
        const itemsByPage = new Map<string, typeof sortedItems>();

        sortedItems.forEach((item) => {
          const keyParts = item.key.split('.');
          const pagesIndex = keyParts.indexOf('pages');
          const pageName = pagesIndex >= 0 && pagesIndex < keyParts.length - 1
            ? keyParts[pagesIndex + 1]
            : '_other';

          if (!itemsByPage.has(pageName)) itemsByPage.set(pageName, []);
          itemsByPage.get(pageName)!.push(item);
        });

        const orderedPages: typeof sortedItems = [];
        sortPageSectionByNavOrder(domain, Array.from(itemsByPage.keys())).forEach((pageName) => {
          orderedPages.push(...sortPageItemsWithDomainsGrouped(itemsByPage.get(pageName)!, domain, pageName));
        });
        sortedItems = orderedPages;
      }

      return {
        group,
        title: t('admin.pages.translations.domains.title', { group }),
        description: `admin.pages.translations.domains.${domain}.description`,
        items: mapItems(sortedItems),
      };
    });

    // Ensure 'pages' section always appears first
    const pagesIndex = result.findIndex((section) => section.group === 'pages');
    if (pagesIndex > 0) result.unshift(result.splice(pagesIndex, 1)[0]);

    return result;
  }, [translations, supportedLanguages, domain, groups]);

  return {
    isLoading: translationsLoading,
    supportedLanguages,
    sections,
  };
};
