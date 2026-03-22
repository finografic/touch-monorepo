import type { I18nTranslationsDomain } from '@workspace/i18n/types';
import type { TranslationsSection } from '../../shared/types/translations.types';
import { isPublicPagesRoleKey } from '../TranslationsTable/utils/roles.utils';
import { TRANSLATION_DOMAINS_WITH_ROLE_SPLIT } from 'admin/config/admin.routes.map';
import { ADMIN_PAGE_SEGMENTS_NAV_ORDER } from 'admin/config/admin.routes.selectors';

/**
 * Sort page segment names for the "pages" group.
 * For the `admin` domain uses navbar declaration order; all others sort A–Z.
 */
export function sortPageSectionByNavOrder(
  domain: I18nTranslationsDomain,
  pageNames: string[],
): string[] {
  if (domain !== 'admin') {
    return [...pageNames].sort((a, b) => a.localeCompare(b));
  }

  const orderIndex = new Map(ADMIN_PAGE_SEGMENTS_NAV_ORDER.map((id, i) => [id, i]));
  return [...pageNames].sort((a, b) => {
    const indexA = orderIndex.has(a) ? orderIndex.get(a)! : Number.MAX_SAFE_INTEGER;
    const indexB = orderIndex.has(b) ? orderIndex.get(b)! : Number.MAX_SAFE_INTEGER;
    if (indexA !== indexB) return indexA - indexB;
    return a.localeCompare(b);
  });
}

/**
 * Splits the `pages` section into `pages_admin` and `pages_public` tabs for
 * domains listed in `TRANSLATION_DOMAINS_WITH_ROLE_SPLIT`. Other domains are
 * returned unchanged.
 */
export function splitPagesIntoTopLevelSections(
  sectionsRaw: TranslationsSection[],
  domain: I18nTranslationsDomain,
): TranslationsSection[] {
  if (!TRANSLATION_DOMAINS_WITH_ROLE_SPLIT.includes(domain)) {
    return sectionsRaw;
  }

  return sectionsRaw.flatMap((section) => {
    if (section.group !== 'pages') {
      return [section];
    }
    const adminItems = section.items.filter(
      (item) => !isPublicPagesRoleKey(item.key ?? '', domain),
    );
    const publicItems = section.items.filter((item) =>
      isPublicPagesRoleKey(item.key ?? '', domain)
    );
    return [
      { ...section, group: 'pages_admin', items: adminItems },
      { ...section, group: 'pages_public', items: publicItems },
    ];
  });
}
