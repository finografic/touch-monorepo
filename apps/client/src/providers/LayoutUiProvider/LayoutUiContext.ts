import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadItem, PadsConfig } from 'types/ui.types';
import { NUM_SLOTS_TYPE_B } from 'src/config/app.config';
import { parsePadsConfig } from 'utils/ui.utils';
import type { Dataset } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';

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
  numPads: 0,
  pads: [],
};

export const LayoutUiContext = createZustandContext(({ initialValue }) => {
  return createStore<LayoutUiStore>((set, get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: SETTER_PREFIX, defaultValue }),
      initPadsFromLoaderData: (loaderData: Dataset, padsConfig: PadsConfig) => {
        const data = !Array.isArray(loaderData) ? [loaderData] : loaderData;
        const { pads, numPads } = parsePadsConfig({ data, config: padsConfig });
        set({ pads });
        set({ numPads });
      },
      updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadItem[]) => PadItem[]) => {
        const currentPads = get().pads;
        if (!currentPads?.length) return;

        const updatedPads = updater(currentPads);
        set({ pads: updatedPads });
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
  const store = LayoutUiContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
