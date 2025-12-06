import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { SlotMeta } from 'pages/MainPage/MainPage.types';

import { parsePadConfig } from 'utils/pads.utils';
import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import type { DataEntry, Dataset } from 'types/data.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { PadConfig, PadType, PadUI } from 'types/pads.types';
import type { FilterKey } from 'types/slots.types';
import type { HandleRouteChangeParams } from './layout-ui-utils.types';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'Ui';

export enum LayoutUiKeys {
  filterKey = 'filterKey',
  numPads = 'numPads',
  pads = 'pads',
  padsFiltered = 'padsFiltered',
  selectedSlots = 'selectedSlots',
  mainPageIsSelectMode = 'mainPageIsSelectMode',
}

export const defaultValue: LayoutUiValues = {
  filterKey: undefined,
  numPads: 0,
  pads: [],
  padsFiltered: [],
  selectedSlots: [],
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
          // MainPage selection actions
          toggleMainPageSlot: (slot: SlotMeta) => {
            set((state) => {
              const selectedSlots = state.selectedSlots;
              const isCurrentlySelected = selectedSlots.some(
                (selectedSlot) => selectedSlot.slotNumber === slot.slotNumber,
              );

              return isCurrentlySelected
                ? { selectedSlots: selectedSlots.filter(({ slotNumber }) => slotNumber !== slot.slotNumber) }
                : { selectedSlots: [...selectedSlots, { ...slot, isChecked: true }] };
            });
          },
          setSelectedSlots: (slots: SlotMeta[]) => {
            set({ selectedSlots: slots });
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
