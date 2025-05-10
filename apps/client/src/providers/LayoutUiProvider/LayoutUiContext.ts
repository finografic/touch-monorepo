import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadsConfig, PadType, PadUI } from 'types/ui.types';
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
      updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadUI[]) => PadUI[]) => {
        const currentPads = get().pads;
        if (!currentPads?.length) return;

        // Split pads into current field and other fields
        const currentFieldPads = currentPads.filter((pad) => pad.name === fieldKey);
        const otherPads = currentPads.filter((pad) => pad.name !== fieldKey);

        // Apply update only to current field pads
        const updatedFieldPads = updater(currentFieldPads);

        // Reconstruct the full pad array maintaining original order
        const updatedPads = currentPads.map((pad) => {
          if (pad.name !== fieldKey) return pad;
          // Find the corresponding updated pad
          const updatedPad = updatedFieldPads.find((p) => p.id === pad.id);
          return updatedPad || pad;
        });

        set({ pads: updatedPads });
      },
      togglePad: (fieldKey: OrderFieldKey, padId: string, type: PadType) => {
        set((state) => {
          const pads = state.pads.map((pad) => {
            if (pad.name !== fieldKey) return pad;
            if (type === 'radio') {
              return { ...pad, isChecked: pad.id === padId };
            }
            if (pad.id === padId) {
              return { ...pad, isChecked: !pad.isChecked };
            }
            return pad;
          });
          return { pads };
        });
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
