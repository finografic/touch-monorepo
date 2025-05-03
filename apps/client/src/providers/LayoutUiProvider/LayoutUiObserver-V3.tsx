/* eslint-disable prefer-arrow-callback */
import { type FC, useCallback, useEffect, useRef } from 'react';
import type { LayoutUiValues } from './LayoutUiContext.types';
import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from './LayoutUiContext';
import { PADS_UI_CONFIG } from 'constants/app.config';
import { parsePadsConfig } from 'utils/ui.utils';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import type { OrderFieldKey } from 'types/orders.types';
import type { RouteConfig } from 'routes/routes.types';
import { routes } from 'routes/routes';

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
  const { route, fieldKey: routeFieldKey } = useRouteConfig() as {
    route: RouteConfig;
    // Get loader data at the component level
    fieldKey: OrderFieldKey;
  };
  const prevStateRef = useRef<{ fieldKey?: string; numPads: number }>({ numPads: 0 });

  console.log('🔍 1 - Observer Mounted');

  const fieldKey = store?.getState().fieldKey;
  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];

  console.log('%c 🔍 loaderData:', 'color:yellows', loaderData);

  // Define the state change handler
  const handleStateChange = useCallback(
    (state: LayoutUiValues) => {
      console.log('🔍 3 - State Change Handler Called:', state);

      if (!store) return;
      const actions = store.getState().actions;
      // const fieldKey = state.fieldKey;
      const fieldKey = routeFieldKey;

      // Prevent unnecessary updates
      if (fieldKey === prevStateRef.current.fieldKey && state.numPads === prevStateRef.current.numPads) {
        console.log('🔍 3.5 - Skipping redundant update');
        return;
      }

      // Update ref
      prevStateRef.current = {
        fieldKey,
        numPads: state.numPads,
      };

      console.log(
        '🔍 4 - Processing State Change:',
        PADS_UI_CONFIG[fieldKey],
        // { fieldKey, state }
      );

      // Clear pads if no fieldKey or no valid config exists
      if (!fieldKey || !PADS_UI_CONFIG[fieldKey]) {
        console.log('%c🔍 4.5 - BEFORE_PARSE', 'color:yellow', PADS_UI_CONFIG[fieldKey]);
        actions.setUiPads([]);
        actions.setUiNumPads(0);
        return;
      }

      // Clear pads if no data or empty array
      // if (!loaderData?.length) {
      //   console.log('%c🔍 4.6 - BEFORE_PARSE', 'color:yellow', loaderData);
      //   actions.setUiPads([]);
      //   actions.setUiNumPads(0);
      //   return;
      // }

      // console.log('%c🔍 4 - Processing State Change:', 'color:yellow', { fieldKey, state });

      console.log('%c🔍 8 - BEFORE_PARSE', 'color:hotpink', fieldKey, PADS_UI_CONFIG[fieldKey]);

      // Initialize pads with config if everything is valid
      const padsConfig = PADS_UI_CONFIG[fieldKey];
      const { pads, numPads } = parsePadsConfig({ data: loaderData, config: padsConfig });
      console.log('%c🔍 9 - AFTER PARSE', 'color:lime', { pads, numPads });

      actions.setUiPads(pads);
      actions.setUiNumPads(numPads);
    },
    [store, loaderData],
  );

  // Watch for route changes and update store
  useEffect(
    function handleRouteChange() {
      console.log('🔍 2 - Route Change Effect:', { routeFieldKey });
      if (!store || !routeFieldKey) return;

      // handleStateChange(store?.getState());

      // console.log('🔍 2 - Route Change Effect:', store?.getState());

      const actions = store.getState().actions;
      actions.setUiFieldKey(routeFieldKey as OrderFieldKey);
    },
    [routeFieldKey, routes, store],
  );

  // Watch for route changes and update store
  useEffect(
    function handleRouteChange() {
      console.log('🔍 2 - Route Change Effect:', { routeFieldKey });
      if (!store || !routeFieldKey) return;

      handleStateChange(store?.getState());

      console.log('🔍 2 - Route Change Effect:', routeFieldKey, store?.getState());

      const actions = store.getState().actions;
      actions.setUiFieldKey(routeFieldKey as OrderFieldKey);
    },
    [routeFieldKey, routes, store, location.pathname],
  );

  // Subscribe to store changes
  useEffect(
    function subscriptToStoreChanges() {
      if (!store) return;
      console.log('🔍 2.5 - Setting up store subscription');

      const unsubscribe = store.subscribe(handleStateChange);
      return () => {
        console.log('🔍 2.6 - Cleaning up store subscription');
        unsubscribe();
      };
    },
    [store, handleStateChange],
  );

  return null;
};
