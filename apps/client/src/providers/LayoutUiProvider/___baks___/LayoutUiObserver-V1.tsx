import { type FC, useEffect } from 'react';
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

  // Watch for route changes and update store
  useEffect(() => {
    if (!store || !routeFieldKey) return;

    const actions = store.getState().actions;
    actions.setUiFieldKey(routeFieldKey);
  }, [routeFieldKey, store]);

  // Get loader data at the component level
  const fieldKey = store?.getState().fieldKey;
  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];

  /* Approach 1: Direct store subscription
  useEffect(() => {
    if (!store) return;
    console.log('🔄 1. FieldKey changing..');
    const unsubscribe = store.subscribe((state, prevState) => {
      console.log('🔄 2. FieldKey changed !!', state, prevState);
      if (state.fieldKey !== prevState.fieldKey) {
        console.log('🔄 3. FieldKey changed:', { new: state.fieldKey, prev: prevState.fieldKey });
      }
    });
    return unsubscribe;
  }, [store]);
  */

  // Watch store changes and initialize pads
  useLayoutUiObserver((state) => {
    if (!store) return;
    const actions = store.getState().actions;
    const fieldKey = state.fieldKey;

    console.log('🔍 Layout UI State changed:', { fieldKey, state });

    // Clear pads if no fieldKey or no valid config exists
    if (!fieldKey || !PADS_UI_CONFIG[fieldKey]) {
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
    const padsConfig = PADS_UI_CONFIG[fieldKey];
    const { pads, numPads } = parsePadsConfig({ data: loaderData, config: padsConfig });

    actions.setUiPads(pads);
    actions.setUiNumPads(numPads);
  });

  return null;
};
