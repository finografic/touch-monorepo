import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import { NUM_SLOTS_TYPE_B } from 'constants/app.config';

export const DISPLAY_NAME = 'LayoutUi';

export enum LayoutUiKeys {
  numSlots = 'numSlots',
  selections = 'selections',
}

export const defaultValue: LayoutUiValues = {
  numSlots: NUM_SLOTS_TYPE_B,
  selections: Array.from({ length: NUM_SLOTS_TYPE_B }, (_, i) => i + 1),
};

export const LayoutUiContext = createZustandContext(({ initialValue }) => {
  return createStore<LayoutUiStore>((set, _get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: DISPLAY_NAME, defaultValue }),
      togglePad: (selections: number[]) => {
        set({
          selections: selections.filter((selection) => selection.itemNumber !== itemNumber),
        });
      },
      selectAllPads: () => {
        const newOrders = [];
        for (let i = 1; i <= 8; i++) {
          newOrders.push({
            ...INITIAL_ORDER_ITEM,
            itemNumber: i,
            isSelected: true,
          });
        }
        set({ selections: newOrders });
      },
    },
  }));
});

type LayoutUiReturn = Omit<LayoutUiStore, 'actions'> & LayoutUiStore['actions'];

export const useLayoutUi = (): LayoutUiReturn => {
  const store = LayoutUiContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
