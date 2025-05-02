import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadsConfig } from 'types/ui.types';
import { NUM_SLOTS_TYPE_B, PADS_UI_CONFIG } from 'constants/app.config';
import { initPadItems, parsePadsConfig } from 'utils/ui.utils';
import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useEffect } from 'react';
import type { DataEntry, Dataset, RouteLoaderData } from 'types/data.types';
// import type { OrderFieldKey } from 'types/orders.types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'Ui';

export enum LayoutUiKeys {
  numSlots = 'numSlots',
  fieldKey = 'fieldKey',
  numPads = 'numPads',
  pads = 'pads',
}

export const defaultValue: LayoutUiValues = {
  numSlots: NUM_SLOTS_TYPE_B,
  fieldKey: undefined,
  // loaderData: undefined,
  numPads: 0,
  pads: initPadItems({ numPads: NUM_SLOTS_TYPE_B, keys: [], type: 'radio' }),
};

export const LayoutUiContext = createZustandContext(({ initialValue }) => {
  log('__DEV: LayoutUi', 'orange', initialValue);

  return createStore<LayoutUiStore>((set, get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: SETTER_PREFIX, defaultValue }),
      initPadsFromLoaderData: (loaderData: Dataset, padsConfig: PadsConfig) => {
        if (!Array.isArray(loaderData)) {
          console.warn('Loader data is not an array, cannot initialize pads');
          return;
        }
        const { pads, numPads } = parsePadsConfig({ data: loaderData, config: padsConfig });
        set({ numPads, pads });
      },
      // updateFromDrinkTypes: (drinkTypes: DrinkType[] | undefined) => {
      //   const state = get();
      //   const numPads = drinkTypes?.length ?? 0;

      //   set({
      //     fieldKey: drinkTypes ? OrderFieldKeys.drinkType : undefined,
      //     numPads,
      //     pads: initPadItems({
      //       numPads,
      //       // Preserve existing keys if they exist
      //       keys: state.pads.slice(0, numPads).map((pad) => pad.key),
      //       type: 'radio',
      //     }),
      //   });
      // },
    },
    // subscribe: (listener: (state: LayoutUiStore, prevState: LayoutUiStore) => void) => {
    //   const state = get();
    //   listener(state, state);
    // },
  }));
});

type LayoutUiReturn = Omit<LayoutUiStore, 'actions'> & LayoutUiStore['actions'];

export const useLayoutUi = (): LayoutUiReturn => {
  const { route, fieldKey } = useRouteConfig();
  const loaderData = useRouteLoaderData(fieldKey || 'root') as DataEntry[];
  const store = LayoutUiContext.useContext();

  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  // Initialize or clear pads based on fieldKey and data availability
  useEffect(() => {
    const actions = store.getState().actions;

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
  }, [fieldKey, loaderData, store]);

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
