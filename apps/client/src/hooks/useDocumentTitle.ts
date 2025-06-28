import { useEffect, useRef } from 'react';

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
 *
 * @param pageTitle - The page-specific title
 * @param appName - Your app name (defaults to "Touch Monorepo")
 *
 * @example
 * ```tsx
 * function AdminPage() {
 *   usePageTitle("Admin Languages"); // Results in "Admin Languages - Touch Monorepo"
 *   return <div>Admin content</div>;
 * }
 * ```
 */
export function usePageTitle(pageTitle: string, appName = 'Touch Monorepo') {
  const fullTitle = pageTitle ? `${pageTitle} - ${appName}` : appName;
  useDocumentTitle(fullTitle);
}
