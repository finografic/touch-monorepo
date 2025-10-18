import type { RegionLocale } from '@workspace/i18n';
import type { SlotMeta, SlotStatus } from 'pages/MainPage/MainPage.types';
import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { NUM_GRID_ITEMS } from 'config/app';
import type { DataEntry, Dataset } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey, SlotType } from 'types/orders.types';
import type { PadConfig, PadType, PadUI } from 'types/pads.types';
import { parsePadConfig } from 'utils/pads.utils';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { HandleRouteChangeParams } from './layout-ui-utils.types';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'Ui';

export enum LayoutUiKeys {
  numItems = 'numItems',
  filterKey = 'filterKey',
  numPads = 'numPads',
  pads = 'pads',
  padsFiltered = 'padsFiltered',
  mainPageSelectedSlots = 'mainPageSelectedSlots',
  mainPageIsSelectMode = 'mainPageIsSelectMode',
}

export const defaultValue: LayoutUiValues = {
  numItems: NUM_GRID_ITEMS,
  filterKey: undefined,
  numPads: 0,
  pads: [],
  padsFiltered: [],
  mainPageSelectedSlots: [],
  mainPageIsSelectMode: false,
};

export const LayoutUiContext = createZustandContext(({ initialValue }) => {
  return createStore<LayoutUiStore>()(
    subscribeWithSelector(
      (set, get): LayoutUiStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          initPadsFromLoaderData: (loaderData: Dataset, padsConfig: PadConfig, filterKey: FilterKey) => {
            const data = !Array.isArray(loaderData) ? [loaderData] : loaderData;
            // Note: We'll need to get currentLanguage from context in the component that calls this
            const { pads, numPads } = parsePadConfig({
              data,
              config: padsConfig,
              filterKey,
              currentLanguage: 'es-ES',
            });
            set({ pads, numPads, filterKey });
          },
          updatePadState: (filterKey: FilterKey, updater: (pads: PadUI[]) => PadUI[]) => {
            const currentPads = get().pads;
            if (!currentPads?.length) return;

            // Split pads into current field and other fields
            const currentFieldPads = currentPads.filter((pad) => pad.name === filterKey);
            const updatedFieldPads = updater(currentFieldPads);

            // Reconstruct the full pad array maintaining original order
            const updatedPads = currentPads.map((pad) => {
              if (pad.name !== filterKey) return pad;
              const updatedPad = updatedFieldPads.find((p) => p.id === pad.id);
              return updatedPad || pad;
            });

            set({ pads: updatedPads });
          },
          togglePad: (filterKey: FilterKey, clickedId: string, type: PadType) => {
            set((state) => {
              const pads = state.pads.map((pad) => {
                if (pad.name !== filterKey) return pad;
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
          handleRouteChange: ({
            filterKey,
            loaderData,
            padsConfig,
            dataPool,
            serverFieldMap,
            currentLanguage = 'es-ES',
          }: HandleRouteChangeParams) => {
            if (!filterKey) {
              set({ pads: [], numPads: 0, filterKey: undefined });
              return;
            }

            if (loaderData && padsConfig && dataPool) {
              const filterApiKey = padsConfig.filterApiKey as keyof (
                | DataEntry
                | OrderModel
                | OrderReadableModel
              );

              // 🚨 FIX: Use dataPool to determine visible options, but don't filter loaderData
              // This ensures UI shows all options from dataPool, not just filtered loaderData
              const visiblePadNames = [
                ...new Set(
                  dataPool
                    .map((entry) => (filterApiKey in entry ? entry[filterApiKey] : undefined))
                    .filter(Boolean),
                ),
              ];

              // Filter loaderData by visiblePadNames to show only valid options
              const filteredLoaderData = (Array.isArray(loaderData) ? loaderData : [loaderData]).filter(
                (padData) => visiblePadNames.includes(padData.name),
              );

              const { pads, numPads } = parsePadConfig({
                data: filteredLoaderData,
                config: {
                  ...padsConfig,
                  initChecked: (pad: PadUI) => serverFieldMap[pad.name] === pad.value.name,
                },
                filterKey,
                currentLanguage,
              });

              set({ pads, numPads, filterKey });
            } else {
              set({ pads: [], numPads: 0, filterKey });
            }
          },
          // MainPage selection actions
          toggleMainPageSlot: (slot: SlotMeta) => {
            set((state) => {
              const selectedSlots = state.mainPageSelectedSlots;

              // Check if slot is already selected by looking at the actual state
              const isCurrentlySelected = selectedSlots.some(
                (selectedSlot) => selectedSlot.slotNumber === slot.slotNumber,
              );

              if (!isCurrentlySelected) {
                return {
                  mainPageSelectedSlots: [...selectedSlots, { ...slot, isChecked: true }],
                };
              } else {
                return {
                  mainPageSelectedSlots: selectedSlots.filter(
                    ({ slotNumber }) => slotNumber !== slot.slotNumber,
                  ),
                };
              }
            });
          },
          selectAllMainPageSlots: () => {
            const { numItems } = get();
            set({
              mainPageSelectedSlots: Array.from({ length: numItems }, (_, i) => ({
                slotType: 'A' as SlotType, // Default slot type, will be updated by actual config
                slotNumber: i + 1,
                isChecked: true,
                status: 'idle' as SlotStatus, // Default status
              })),
            });
          },
          setMainPageSelectedSlots: (slots: SlotMeta[]) => {
            set({ mainPageSelectedSlots: slots });
          },
          clearMainPageSelection: () => {
            set({ mainPageSelectedSlots: [] });
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

  return useStore<StoreApi<LayoutUiStore>, LayoutUiReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
