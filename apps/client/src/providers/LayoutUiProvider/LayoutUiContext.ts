import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';
import type { PadConfig, PadType, PadUI } from 'types/pads.types';
import { NUM_GRID_ITEMS } from 'config/app';
import { parsePadConfig } from 'utils/ui-V2.utils';
import type { DataEntry, Dataset } from 'types/data.types';
import type { FilterKey, SlotType } from 'types/orders.types';
import type { OrderModel } from 'types/models/order.model';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import { subscribeWithSelector } from 'zustand/middleware';
import type { RegionLocale } from '@workspace/i18n';
import type { SlotMeta, SlotStatus } from 'pages/MainPage/MainPage.types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'Ui';

export enum LayoutUiKeys {
  numItems = 'numItems',
  filterFieldKey = 'filterFieldKey',
  numPads = 'numPads',
  pads = 'pads',
  padsFiltered = 'padsFiltered',
  mainPageSelectedSlots = 'mainPageSelectedSlots',
  mainPageIsSelectMode = 'mainPageIsSelectMode',
}

export const defaultValue: LayoutUiValues = {
  numItems: NUM_GRID_ITEMS,
  filterFieldKey: undefined,
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
          initPadsFromLoaderData: (loaderData: Dataset, padsConfig: PadConfig, filterFieldKey: FilterKey) => {
            const data = !Array.isArray(loaderData) ? [loaderData] : loaderData;
            // Note: We'll need to get currentLanguage from context in the component that calls this
            const { pads, numPads } = parsePadConfig({
              data,
              config: padsConfig,
              filterFieldKey,
              currentLanguage: 'es-ES',
            });
            set({ pads, numPads, filterFieldKey });
          },
          updatePadState: (filterFieldKey: FilterKey, updater: (pads: PadUI[]) => PadUI[]) => {
            const currentPads = get().pads;
            if (!currentPads?.length) return;

            // Split pads into current field and other fields
            const currentFieldPads = currentPads.filter((pad) => pad.name === filterFieldKey);
            const updatedFieldPads = updater(currentFieldPads);

            // Reconstruct the full pad array maintaining original order
            const updatedPads = currentPads.map((pad) => {
              if (pad.name !== filterFieldKey) return pad;
              const updatedPad = updatedFieldPads.find((p) => p.id === pad.id);
              return updatedPad || pad;
            });

            set({ pads: updatedPads });
          },
          togglePad: (filterFieldKey: FilterKey, clickedId: string, type: PadType) => {
            set((state) => {
              const pads = state.pads.map((pad) => {
                if (pad.name !== filterFieldKey) return pad;
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
            filterFieldKey: FilterKey | undefined,
            loaderData: DataEntry[],
            padsConfig: PadConfig,
            dataPool: DataEntry[] | OrderModel[] | OrderReadableModel[],
            serverFieldMap: Record<string, string>,
            currentLanguage: RegionLocale = 'es-ES',
          ) => {
            if (!filterFieldKey) {
              set({ pads: [], numPads: 0, filterFieldKey: undefined });
              return;
            }

            if (loaderData && padsConfig && dataPool) {
              const filterKey = padsConfig.filterKey as keyof (DataEntry | OrderModel | OrderReadableModel);

              const visiblePadNames = [
                ...new Set(
                  dataPool
                    .map((entry) => (filterKey in entry ? entry[filterKey] : undefined))
                    .filter(Boolean),
                ),
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
                filterFieldKey,
                currentLanguage,
              });

              set({ pads, numPads, filterFieldKey });
            } else {
              set({ pads: [], numPads: 0, filterFieldKey });
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
