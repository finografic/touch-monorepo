import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import { NUM_SLOTS_TYPE_B } from 'constants/app.config';
import { initPadItems } from 'utils/ui.utils';

export const DISPLAY_NAME = 'LayoutUi';

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
  pads: initPadItems({ numPads: NUM_SLOTS_TYPE_B, keys: [], type: 'radio' }),
};

export const LayoutUiContext = createZustandContext(({ initialValue }) => {
  return createStore<LayoutUiStore>((set, _get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: DISPLAY_NAME, defaultValue }),
    },
  }));
});

type LayoutUiReturn = Omit<LayoutUiStore, 'actions'> & LayoutUiStore['actions'];

export const useLayoutUi = (): LayoutUiReturn => {
  const store = LayoutUiContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  log('__UI', 'blue', {
    fieldKey: store?.getState()?.fieldKey,
    // prevFieldKey: prevState?.fieldKey,
    // changed: state?.fieldKey !== prevState?.fieldKey,
  });
  store.subscribe((state, prevState) => {
    // Only update if fieldKey has changed
    // log('__UI', 'blue', {
    //   fieldKey: state?.fieldKey,
    //   prevFieldKey: prevState?.fieldKey,
    //   changed: state?.fieldKey !== prevState?.fieldKey,
    // });
    // if (state?.fieldKey !== prevState?.fieldKey) {
    //   // Reset pads when fieldKey changes
    //   const numPads = state.numPads;
    //   store.setState({
    //     numPads,
    //     pads: initPadItems({
    //       numPads,
    //       keys: [...state.pads.map(({ key }) => key)],
    //       type: 'radio',
    //     }),
    //   });
    // log('UI', 'blue', {
    //   numPads,
    //   pads: initPadItems({
    //     numPads,
    //     keys: [...state.pads.map(({ key }) => key)],
    //     type: 'radio',
    //   }),
    // });
    // }
  });

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
