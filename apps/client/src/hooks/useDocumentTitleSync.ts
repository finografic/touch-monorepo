import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { useDocumentTitle } from './useDocumentTitle';

/**
 * Hook that automatically syncs ContentContext title to document title
 * Uses i18n translations and integrates with your existing content management
 *
 * This should be used in Layout components, not individual pages
 *
 * @example
 * ```tsx
 * // In Layout.tsx or AdminLayout.tsx
 * function Layout() {
 *   useDocumentTitleSync(); // Automatically handles all title changes
 *   return <div>Layout content</div>;
 * }
 * ```
 */
export function useDocumentTitleSync() {
  const { title } = useContent();
  const { t } = useTranslation();

  // Get translated title from i18n
  const translatedTitle = title ? t(title) : '';

  // Automatically set document title when ContentContext title changes
  useDocumentTitle(translatedTitle);
}

/**
 * Hook to set page title in ContentContext (for use in page components)
 * This will automatically trigger document title update via useDocumentTitleSync
 *
 * @param titleKey - i18n key for the page title (e.g., "pages.main.title")
 *
 * @example
 * ```tsx
 * // In page components
 * function AdminLanguagesPage() {
 *   usePageTitleKey("admin.pages.languages.title");
 *   return <div>Page content</div>;
 * }
 * ```
 */
export function usePageTitleKey(titleKey: string) {
  const { setContentTitle } = useContent();

  useEffect(() => {
    setContentTitle(titleKey);
  }, [titleKey, setContentTitle]);
}

/**
 * Hook to set page title directly (for dynamic titles)
 * This will automatically trigger document title update via useDocumentTitleSync
 *
 * @param titleText - Direct title text (already translated)
 *
 * @example
 * ```tsx
 * // For dynamic titles
 * function DrinkDetailsPage() {
 *   const { data: drink } = useGetDrink(drinkId);
 *   usePageTitleText(drink?.name || "Drink Details");
 *   return <div>Page content</div>;
 * }
 * ```
 */
export function usePageTitleText(titleText: string) {
  const { setContentTitle } = useContent();

  useEffect(() => {
    setContentTitle(titleText);
  }, [titleText, setContentTitle]);
}
