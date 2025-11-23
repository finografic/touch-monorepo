import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useContent } from 'providers/ContentProvider/ContentContext';

/**
 * Hook to set page title in ContentContext (for use in page components)
 * This will automatically trigger document title update via useDocumentTitleSync
 *
 * @param titleKey - i18n key for the page title (e.g., "pages.main.title")
 *
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
