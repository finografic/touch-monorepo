import { useEffect, useRef } from 'react';
import { useLayoutUi } from './LayoutUiContext';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useFilters } from 'hooks/useFilters';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useTranslation } from 'react-i18next';

/**
 * Hook that handles LayoutUI subscriptions and state management
 * Previously was a logical component, now extracted as a reusable hook
 */
export const useLayoutUiObserver = () => {
  const store = useLayoutUi();
  const { fieldKey, padsConfig } = useRouteConfig();
  const { setIsNextDisabled } = usePagination();
  const { currentSessionId, sessions } = useSession();
  const { dataPool } = useFilters();
  const { i18n } = useTranslation();

  // Use i18n language directly as the source of truth
  const currentLanguage = i18n.language || 'es';

  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];

  const isInitializedRef = useRef<Record<string, boolean>>({});
  const lastRouteDataRef = useRef<{
    fieldKey?: string;
    loaderDataLength?: number;
    dataPoolLength?: number;
    sessionId?: string;
    language?: string;
  }>({});

  // Subscription 1: Handle route changes
  useEffect(() => {
    const currentRouteData = {
      fieldKey: fieldKey || '',
      loaderDataLength: loaderData?.length || 0,
      dataPoolLength: dataPool?.length || 0,
      sessionId: currentSessionId || '',
      language: currentLanguage,
    };

    // Only trigger if route data actually changed
    const hasRouteChanged =
      lastRouteDataRef.current.fieldKey !== currentRouteData.fieldKey ||
      lastRouteDataRef.current.loaderDataLength !== currentRouteData.loaderDataLength ||
      lastRouteDataRef.current.dataPoolLength !== currentRouteData.dataPoolLength ||
      lastRouteDataRef.current.sessionId !== currentRouteData.sessionId ||
      lastRouteDataRef.current.language !== currentRouteData.language;

    if (hasRouteChanged) {
      lastRouteDataRef.current = currentRouteData;

      // Build session server field map
      const sessionFilters =
        currentSessionId && sessions[currentSessionId] ? sessions[currentSessionId].filters : {};

      const sessionServerFieldMap = Object.entries(sessionFilters).reduce(
        (acc, [_filterKey, filterValue]) => {
          if (filterValue && typeof filterValue === 'object' && 'name' in filterValue) {
            return { ...acc, [_filterKey as string]: filterValue.name };
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Handle route change
      if (!fieldKey) {
        store.handleRouteChange(undefined, [], {} as any, [], {});
        return;
      }

      if (loaderData && padsConfig && dataPool) {
        isInitializedRef.current[fieldKey] = false;

        // Map current language to the format expected by the utility
        const languageCode = currentLanguage.startsWith('es')
          ? 'es'
          : currentLanguage.startsWith('cat')
            ? 'cat'
            : 'en';

        store.handleRouteChange(
          fieldKey,
          loaderData,
          padsConfig,
          dataPool,
          sessionServerFieldMap,
          languageCode,
        );
        isInitializedRef.current[fieldKey] = true;
      } else {
        store.handleRouteChange(fieldKey, [], {} as any, [], {});
      }
    }
  }); // No dependency array - runs on every render but only acts on actual changes

  // Subscription 2: Handle pad changes for pagination
  useEffect(() => {
    if (!store.pads?.length || !fieldKey) return;
    if (!isInitializedRef.current[fieldKey]) return;

    if (padsConfig?.minRequired !== undefined) {
      const checkedCount = store.pads.filter((pad) => pad.isChecked).length;
      setIsNextDisabled(checkedCount < padsConfig.minRequired);
    }
  }); // No dependency array - runs on every render but has built-in guards
};

// Keep the old component for backward compatibility during transition
export const LayoutUiObserver = () => {
  useLayoutUiObserver();
  return null;
};
