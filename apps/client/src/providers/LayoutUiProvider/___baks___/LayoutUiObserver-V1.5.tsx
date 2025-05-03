import { type FC, useCallback, useEffect, useRef } from 'react';
import type { LayoutUiValues } from '../LayoutUiContext.types';
import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from '../LayoutUiContext';
import { PADS_UI_CONFIG } from 'src/config/app.config';
import { parsePadsConfig } from 'utils/ui.utils';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

// Observer pattern approach
const useLayoutUiObserver = (callback: (state: LayoutUiValues) => void) => {
  const store = LayoutUi.useContext();
  console.log('🔍 1 - Layout UI State changed:', store);
  if (!store) return;

  useEffect(() => {
    return store.subscribe((state) => {
      callback(state);
    });
  }, [store, callback]);
};

export const LayoutUiObserver: FC = () => {
  const store = LayoutUi.useContext();
  const { fieldKey: routeFieldKey } = useRouteConfig();
  const prevStateRef = useRef<{ fieldKey?: string; numPads: number }>({ numPads: 0 });

  console.log('🔍 1 - Observer Mounted');

  // Get loader data at the component level
  const loaderData = useRouteLoaderData(routeFieldKey || 'root') as DataEntry[];

  // Initialize pads based on current route and data
  const initializePads = useCallback(() => {
    if (!store || !routeFieldKey) return;

    const actions = store.getState().actions;
    const currentFieldKey = store.getState().fieldKey;

    // Skip if we're already on this route
    if (currentFieldKey === routeFieldKey) return;

    // Update the fieldKey first
    actions.setUiFieldKey(routeFieldKey);

    // Clear pads if no valid config exists
    if (!PADS_UI_CONFIG[routeFieldKey]) {
      actions.setUiPads([]);
      actions.setUiNumPads(0);
      return;
    }

    // Clear pads if no data or empty array
    if (!loaderData?.length) {
      actions.setUiPads([]);
      actions.setUiNumPads(0);
      return;
    }

    // Initialize pads with config if everything is valid
    const padsConfig = PADS_UI_CONFIG[routeFieldKey];
    const { pads, numPads } = parsePadsConfig({ data: loaderData, config: padsConfig });

    actions.setUiPads(pads);
    actions.setUiNumPads(numPads);
  }, [store, routeFieldKey, loaderData]);

  // Watch for route changes and update store
  useEffect(() => {
    initializePads();
  }, [initializePads]);

  return null;
};
