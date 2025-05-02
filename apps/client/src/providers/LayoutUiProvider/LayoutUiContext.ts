import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadsConfig } from 'types/ui.types';
import { NUM_SLOTS_TYPE_B, PADS_UI_CONFIG } from 'constants/app.config';
import { initPadItems } from 'utils/ui.utils';
import { useLoaderData, useRouteLoaderData } from 'react-router-dom';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useEffect } from 'react';
import type { RouteLoaderData } from 'types/data.types';
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
      initPadsFromLoaderData: (loaderData: RouteLoaderData, padsConfig: PadsConfig) => {
        if (!Array.isArray(loaderData.data)) {
          console.warn('Loader data is not an array, cannot initialize pads');
          return;
        }

        const { maxPads, type, labelKey } = padsConfig;
        const numPads = Math.min(loaderData.data.length, maxPads);

        // Extract keys from loader data using the configured labelKey
        const keys = loaderData.data
          .slice(0, numPads)
          .map((item) => (item as Record<string, string>)[labelKey] || '');

        // Initialize pads with the extracted keys
        const pads = initPadItems({
          numPads,
          keys,
          type,
        });

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
    subscribe: (listener: (state: LayoutUiStore, prevState: LayoutUiStore) => void) => {
      const state = get();
      listener(state, state);
    },
  }));
});

type LayoutUiReturn = Omit<LayoutUiStore, 'actions'> & LayoutUiStore['actions'];

export const useLayoutUi = (): LayoutUiReturn => {
  const { route, fieldKey } = useRouteConfig();
  const loaderData = useRouteLoaderData(fieldKey || 'root') as RouteLoaderData;
  const store = LayoutUiContext.useContext();

  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  // Initialize pads when fieldKey or loaderData changes
  useEffect(() => {
    if (fieldKey && loaderData?.data) {
      const padsConfig = PADS_UI_CONFIG[fieldKey];
      if (padsConfig) {
        store.getState().actions.initPadsFromLoaderData(loaderData, padsConfig);
      }
    }
  }, [fieldKey, loaderData, store]);

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
