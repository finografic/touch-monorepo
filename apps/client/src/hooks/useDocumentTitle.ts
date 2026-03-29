import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useMetadata } from 'providers/MetadataProvider/MetadataContext';

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

  const fullTitle = appName && pageTitle ? `${pageTitle}${separator}${appName}` : pageTitle || appName;

  useEffect(() => {
    if (previousTitle.current === undefined) {
      previousTitle.current = document.title;
    }

    document.title = fullTitle;

    return () => {
      if (restoreOnUnmount && previousTitle.current) {
        document.title = previousTitle.current;
      }
    };
  }, [fullTitle, restoreOnUnmount]);
}

/**
 * Hook that automatically syncs Metadata title to document title
 * Uses i18n translations and integrates with your existing content management
 *
 * This should be used in Layout components, not individual pages
 *
 */
export function useDocumentTitleSync() {
  const { title } = useMetadata();
  const { t } = useTranslation();

  const translatedTitle = title ? t(title) : '';

  useDocumentTitle(translatedTitle);
}
