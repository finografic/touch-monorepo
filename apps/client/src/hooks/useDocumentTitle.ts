import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useContent } from 'providers/ContentProvider/ContentContext';

/**
 * Custom hook to manage document title with optional app suffix
 * Modern replacement for React Helmet Async when you only need title management
 *
 * @param pageTitle - The page-specific title
 * @param options - Configuration options
 * @param options.appName - App name to append (defaults to "Touch Monorepo")
 * @param options.separator - Separator between page and app name (defaults to " - ")
 * @param options.restoreOnUnmount - Whether to restore previous title on unmount (defaults to true)
 *
 * @example
 * ```tsx
 * // Simple usage (most common)
 * useDocumentTitle("Admin Languages");
 * // Results in: "Admin Languages - Touch Monorepo"
 *
 * // Custom app name
 * useDocumentTitle("Dashboard", { appName: "My App" });
 * // Results in: "Dashboard - My App"
 *
 * // No app suffix
 * useDocumentTitle("Admin Languages", { appName: "" });
 * // Results in: "Admin Languages"
 *
 * // Custom separator
 * useDocumentTitle("Admin", { separator: " | " });
 * // Results in: "Admin | Touch Monorepo"
 * ```
 */
export function useDocumentTitle(
  pageTitle: string,
  options: {
    appName?: string;
    separator?: string;
    restoreOnUnmount?: boolean;
  } = {},
) {
  const { appName = 'Touch Monorepo', separator = ' - ', restoreOnUnmount = true } = options;

  const previousTitle = useRef<string | undefined>(undefined);

  // Build the full title
  const fullTitle = appName && pageTitle ? `${pageTitle}${separator}${appName}` : pageTitle || appName;

  useEffect(() => {
    // Store the previous title on first run
    if (previousTitle.current === undefined) {
      previousTitle.current = document.title;
    }

    // Set the new title
    document.title = fullTitle;

    // Cleanup function to restore previous title
    return () => {
      if (restoreOnUnmount && previousTitle.current) {
        document.title = previousTitle.current;
      }
    };
  }, [fullTitle, restoreOnUnmount]);
}

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

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useDocumentTitle instead
 */
export function usePageTitle(pageTitle: string, appName = 'Touch Monorepo') {
  const fullTitle = pageTitle ? `${pageTitle} - ${appName}` : appName;
  useDocumentTitle(fullTitle);
}
