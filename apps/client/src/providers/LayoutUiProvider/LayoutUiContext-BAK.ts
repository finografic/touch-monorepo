import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import { NUM_SLOTS_TYPE_B } from 'constants/app.config';
import type { PadItem } from 'types/ui.types';
import { initPadItems } from 'utils/ui.utils';

export const DISPLAY_NAME = 'LayoutUi';

export enum LayoutUiKeys {
  numSlots = 'numSlots',
  pads = 'pads',
}

export const defaultValue: LayoutUiValues = {
  numSlots: NUM_SLOTS_TYPE_B,
  // pads: Array.from({ length: NUM_SLOTS_TYPE_B }, (_, i) => ({
  //   index: i + 1,
  //   id: `Pad ${i + 1}`,
  //   type: 'radio',
  //   isChecked: false,
  // })) as PadItem[],
  pads: initPadItems({ num: NUM_SLOTS_TYPE_B, ids: [], type: 'radio' }),
};

export const LayoutUiContext = createZustandContext(({ initialValue }) => {
  return createStore<LayoutUiStore>((set, _get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: DISPLAY_NAME, defaultValue }),
      // togglePad: (selections: PadItem[]) => {
      //   set({
      //     pads: selections.filter((selection) => selection.itemNumber !== itemNumber),
      //   });
      // },
      // selectAll: () => {
      //   const newOrders = [];
      //   for (let i = 1; i <= 8; i++) {
      //     newOrders.push({
      //       ...INITIAL_ORDER_ITEM,
      //       itemNumber: i,
      //       isSelected: true,
      //     });
      //   }
      //   set({ pads: newOrders });
      // },
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
