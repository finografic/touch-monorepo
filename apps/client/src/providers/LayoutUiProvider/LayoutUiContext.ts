import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import { NUM_SLOTS_TYPE_B, OrderFieldKeys } from 'constants/app.config';
import { initPadItems } from 'utils/ui.utils';
import type { DrinkType } from 'types/models/drink-type.model';
import { useLoaderData } from 'react-router-dom';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useEffect, useRef } from 'react';
import type { RouteLoaderData } from 'types/data.types';

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
      initPadsFromLoaderData: (loaderData: RouteLoaderData) => {
        const state = get();
        const numPads = loaderData.data.length;
        console.log('%c __SUB', 'color:lime', numPads, { ...state });
        // set({ numPads, pads: initPadItems({ numPads, keys: [], type: 'radio' }) });
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
  // const loaderData = useLoaderData();
  const { route, fieldKey } = useRouteConfig();
  const store = LayoutUiContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  // store.subscribe((_state, _prev) => {
  //   console.log('%c __SUB', 'color:lime', _state, _prev);
  // });

  // const scratchRef = useRef(store.getState());
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() => {
    console.log('%c __SUB', 'color:magenta', { fieldKey }, store.getState());
  }, [fieldKey]);

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
