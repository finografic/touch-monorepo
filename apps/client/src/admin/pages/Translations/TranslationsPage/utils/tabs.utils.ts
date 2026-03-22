import type { TranslationsSection } from '../../shared/types/translations.types';

/**
 * Tab labels for the translations admin primary tabs (`Tabs.List` triggers).
 *
 * The `pages` group is split into `pages_admin` and `pages_public` sections, so there is no dedicated
 * `admin.pages.translations.tabs.pages_admin` i18n key — we append `(admin)` / `(public)` to the base
 * “Páginas” string instead.
 */
export function translationsTabLabel(
  section: TranslationsSection,
  t: (key: string, opts?: { defaultValue?: string }) => string,
): string {
  if (section.group === 'pages_admin') {
    return `${t('admin.pages.translations.tabs.pages')} (admin)`;
  }
  if (section.group === 'pages_public') {
    return `${t('admin.pages.translations.tabs.pages')} (public)`;
  }
  return t(`admin.pages.translations.tabs.${section.group}`, { defaultValue: section.group });
}
