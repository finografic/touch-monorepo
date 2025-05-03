import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadItem, PadsConfig } from 'types/ui.types';
import { NUM_SLOTS_TYPE_B } from 'src/config/app.config';
import { parsePadsConfig } from 'utils/ui.utils';
import type { Dataset } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'setUi';

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

export const createLayoutUiStore = (initialValue?: Partial<LayoutUiValues>) => {
  const store = createStore<LayoutUiStore>((set, get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters<LayoutUiValues>(set, SETTER_PREFIX),

      initPadsFromLoaderData: (data: Dataset, config: PadsConfig) => {
        const { pads, numPads } = parsePadsConfig({ data, config });
        set({ pads, numPads });
      },

      updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadItem[]) => PadItem[]) => {
        const currentPads = get().pads;
        if (!currentPads?.length) return;

        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
          const updatedPads = updater(currentPads);
          set({ pads: updatedPads });
        });
      },
    },
  }));

  return store;
};

export const [LayoutUiProvider, useLayoutUi] = createZustandContext<LayoutUiStore>({
  displayName: DISPLAY_NAME,
  createStore: createLayoutUiStore,
});
