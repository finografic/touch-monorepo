import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import type { RegionLocale } from '@workspace/i18n';

import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { parsePadConfig } from 'utils/pads.utils';
import type { DataEntry, Dataset } from 'types/data.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { PadConfig, PadType, PadUI } from 'types/pads.types';
import type { FilterKey } from 'types/slots.types';
import { MetadataContext } from 'providers/MetadataProvider/MetadataContext';

import type { HandleRouteChangeParams } from './layout-ui-utils.types';
import type { LayoutUiReturn, LayoutUiStore, LayoutUiValues } from './LayoutUiContext.types';

export const DISPLAY_NAME = 'LayoutUi';
export const SETTER_PREFIX = 'Ui';

export enum LayoutUiKeys {
  filterKey = 'filterKey',
  numPads = 'numPads',
  pads = 'pads',
  padsFiltered = 'padsFiltered',
  mainPageIsSelectMode = 'mainPageIsSelectMode',
}

export const defaultValue: LayoutUiValues = {
  filterKey: undefined,
  numPads: 0,
  pads: [],
  padsFiltered: [],
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
          initPadsFromLoaderData: (
            loaderData: Dataset,
            padsConfig: PadConfig,
            filterKey: FilterKey,
            currentLanguage: RegionLocale = 'es-ES',
          ) => {
            const data = !Array.isArray(loaderData) ? [loaderData] : loaderData;
            const { pads, numPads } = parsePadConfig({
              data,
              config: padsConfig,
              filterKey,
              currentLanguage,
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
              const filterApiKey = padsConfig.filterApiKey as keyof (DataEntry | OrderReadableModel);
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

export const useLayoutUi = (): LayoutUiReturn => {
  const store = LayoutUiContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  const layoutSlice = useStore<StoreApi<LayoutUiStore>, Omit<LayoutUiStore, 'actions'> & LayoutUiStore['actions']>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );

  const metadataStore = MetadataContext.useContext();
  if (!metadataStore) {
    throw new Error('useLayoutUi must be used within a MetadataProvider');
  }

  const { selectedSlots, toggleSlot, setSelectedSlots } = useStore(
    metadataStore,
    useShallow((state) => ({
      selectedSlots: state.selectedSlots,
      toggleSlot: state.actions.toggleSlot,
      setSelectedSlots: state.actions.setSelectedSlots,
    })),
  );

  return {
    ...layoutSlice,
    selectedSlots,
    toggleMainPageSlot: toggleSlot,
    setSelectedSlots,
  };
};
