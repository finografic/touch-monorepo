import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadsConfig, PadUI } from 'types/ui.types';
import { NUM_ITEMS_TYPE_B } from 'src/config/app.config';
import { parsePadsConfig } from 'utils/ui.utils';
import type { Dataset } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'Ui';

export enum LayoutUiKeys {
  numItems = 'numItems',
  fieldKey = 'fieldKey',
  numPads = 'numPads',
  pads = 'pads',
}

export const defaultValue: LayoutUiValues = {
  numItems: NUM_ITEMS_TYPE_B,
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
      initPadsFromLoaderData: (loaderData: Dataset, padsConfig: PadsConfig, fieldKey: OrderFieldKey) => {
        const data = !Array.isArray(loaderData) ? [loaderData] : loaderData;
        const { pads, numPads } = parsePadsConfig({ data, config: padsConfig, fieldKey });
        set({ pads });
        set({ numPads });
      },
      updatePadState: (_fieldKey: OrderFieldKey, updater: (pads: PadUI[]) => PadUI[]) => {
        const currentPads = get().pads;
        if (!currentPads?.length) return;

        const updatedPads = updater(currentPads);
        set({ pads: updatedPads });
      },
      // TODO: ignore the following for now..
      togglePad: (index: number) => {
        const { pads } = get();
        const draftPads = pads.find((pad) => pad.index === index);
        // set({ pads: draftPads });
      },
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
