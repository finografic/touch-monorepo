import { useEffect } from 'react';

import { useMetadata } from 'providers/MetadataProvider/MetadataContext';
import { useDocumentTitle } from 'hooks/useDocumentTitle';

/**
 * Hook to set page title in Metadata (for use in page components)
 * This will automatically trigger document title update via useDocumentTitleSync
 *
 * @param titleKey - i18n key for the page title (e.g., "pages.main.title")
 */
export function usePageTitleKey(titleKey: string) {
  const { setMetadataTitle } = useMetadata();

  useEffect(() => {
    setMetadataTitle(titleKey);
  }, [titleKey, setMetadataTitle]);
}

/**
 * Hook to set page title directly (for dynamic titles)
 * This will automatically trigger document title update via useDocumentTitleSync
 *
 * @param titleText - Direct title text (already translated)
 */
export function usePageTitleText(titleText: string) {
  const { setMetadataTitle } = useMetadata();

  useEffect(() => {
    setMetadataTitle(titleText);
  }, [titleText, setMetadataTitle]);
}

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useDocumentTitle instead
 */
export function usePageTitle(pageTitle: string, appName = 'Touch Monorepo') {
  const fullTitle = pageTitle ? `${pageTitle} - ${appName}` : appName;
  useDocumentTitle(fullTitle);
}
