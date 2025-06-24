import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadConfig, PadType, PadUI } from 'types/ui.types';
import { NUM_GRID_ITEMS } from 'constants/app.config';
import { parsePadConfig } from 'utils/ui-V2.utils';
import type { DataEntry, Dataset } from 'types/data.types';
import type { OrderFieldKey } from 'types/orders.types';
import { subscribeWithSelector } from 'zustand/middleware';
import { useContent } from 'providers/ContentProvider/ContentContext';
import type { RegionLocale } from '@workspace/types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'Ui';

export enum LayoutUiKeys {
  numItems = 'numItems',
  fieldKey = 'fieldKey',
  numPads = 'numPads',
  pads = 'pads',
  padsFiltered = 'padsFiltered',
}

export const defaultValue: LayoutUiValues = {
  numItems: NUM_GRID_ITEMS,
  fieldKey: undefined,
  numPads: 0,
  pads: [],
  padsFiltered: [],
};

export const LayoutUiContext = createZustandContext(({ initialValue }) => {
  return createStore<LayoutUiStore>()(
    subscribeWithSelector(
      (set, get): LayoutUiStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          initPadsFromLoaderData: (loaderData: Dataset, padsConfig: PadConfig, fieldKey: OrderFieldKey) => {
            const data = !Array.isArray(loaderData) ? [loaderData] : loaderData;
            // Note: We'll need to get currentLanguage from context in the component that calls this
            const { pads, numPads } = parsePadConfig({
              data,
              config: padsConfig,
              fieldKey,
              currentLanguage: 'es-ES',
            });
            set({ pads, numPads, fieldKey });
          },
          updatePadState: (fieldKey: OrderFieldKey, updater: (pads: PadUI[]) => PadUI[]) => {
            const currentPads = get().pads;
            if (!currentPads?.length) return;

            // Split pads into current field and other fields
            const currentFieldPads = currentPads.filter((pad) => pad.name === fieldKey);
            const updatedFieldPads = updater(currentFieldPads);

            // Reconstruct the full pad array maintaining original order
            const updatedPads = currentPads.map((pad) => {
              if (pad.name !== fieldKey) return pad;
              const updatedPad = updatedFieldPads.find((p) => p.id === pad.id);
              return updatedPad || pad;
            });

            set({ pads: updatedPads });
          },
          togglePad: (fieldKey: OrderFieldKey, clickedId: string, type: PadType) => {
            set((state) => {
              const pads = state.pads.map((pad) => {
                if (pad.name !== fieldKey) return pad;
                if (type === 'radio') {
                  return { ...pad, isChecked: pad.id === clickedId };
                }
                if (pad.id === clickedId) {
                  return { ...pad, isChecked: !pad.isChecked };
                }
                return pad;
              });
              return { pads };
            });
          },
          handleRouteChange: (
            fieldKey: OrderFieldKey | undefined,
            loaderData: DataEntry[],
            padsConfig: PadConfig,
            dataPool: DataEntry[],
            serverFieldMap: Record<string, string>,
            currentLanguage: RegionLocale = 'es-ES',
          ) => {
            if (!fieldKey) {
              set({ pads: [], numPads: 0, fieldKey: undefined });
              return;
            }

            if (loaderData && padsConfig && dataPool) {
              const filterKey = padsConfig.filterKey as keyof DataEntry;
              const visiblePadNames = [
                ...new Set(dataPool.map((entry) => entry?.[filterKey]).filter(Boolean)),
              ];

              const filteredLoaderData = (Array.isArray(loaderData) ? loaderData : [loaderData]).filter(
                (padData) => visiblePadNames.includes(padData.name),
              );

              const { pads, numPads } = parsePadConfig({
                data: filteredLoaderData,
                config: {
                  ...padsConfig,
                  initChecked: (pad: PadUI) => serverFieldMap[pad.name] === pad.value.name,
                },
                fieldKey,
                currentLanguage,
              });

              set({ pads, numPads, fieldKey });
            } else {
              set({ pads: [], numPads: 0, fieldKey });
            }
          },
        },
      }),
    ),
  );
});

type LayoutUiReturn = Omit<LayoutUiStore, 'actions'> & LayoutUiStore['actions'];

export const useLayoutUi = (): LayoutUiReturn => {
  const store = LayoutUiContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
