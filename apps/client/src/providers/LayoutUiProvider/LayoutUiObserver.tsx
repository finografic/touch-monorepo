import { type FC, type JSX, type ReactElement, useEffect } from 'react';
import type { LayoutUiProviderProps, LayoutUiValues } from './LayoutUiContext.types';
import { DISPLAY_NAME, LayoutUiContext as LayoutUi } from './LayoutUiContext';
import { PADS_UI_CONFIG } from 'constants/app.config';
import { parsePadsConfig } from 'utils/ui.utils';
import { useRouteLoaderData } from 'react-router-dom';
import type { DataEntry } from 'types/data.types';

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

export const LayoutUiObserver: FC = (): any => {
  const store = LayoutUi.useContext();

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

  // Approach 2: Using the observer pattern
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
};
