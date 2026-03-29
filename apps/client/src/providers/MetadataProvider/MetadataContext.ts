import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';

import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import { ALT_SLOT_NUMBER } from 'config/app/slots.config';
import type { MetadataStore, MetadataValues } from './MetadataContext.types';

export const DISPLAY_NAME = 'Metadata';
export const SETTER_PREFIX = 'Metadata';

export enum MetadataKeys {
  title = 'title',
  selectedSlots = 'selectedSlots',
}

export const defaultValue: MetadataValues = {
  title: '',
  selectedSlots: [],
};

export const MetadataContext = createZustandContext(({ initialValue }) => {
  return createStore<MetadataStore>()(
    subscribeWithSelector(
      (set, _get): MetadataStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          toggleSlot: (slot: SlotMeta) => {
            set((state) => {
              const selectedSlots = state.selectedSlots;
              const isCurrentlySelected = selectedSlots.some(
                (selectedSlot) => selectedSlot.slotNumber === slot.slotNumber,
              );

              if (isCurrentlySelected) {
                return {
                  selectedSlots: selectedSlots.filter(({ slotNumber }) => slotNumber !== slot.slotNumber),
                };
              }

              const alt = ALT_SLOT_NUMBER;
              const hasAltSelected = selectedSlots.some((s) => s.slotNumber === alt);
              const hasNonAltSelected = selectedSlots.some((s) => s.slotNumber !== alt);
              if (slot.slotNumber === alt && hasNonAltSelected) {
                return state;
              }
              if (slot.slotNumber !== alt && hasAltSelected) {
                return state;
              }

              return { selectedSlots: [...selectedSlots, { ...slot, isChecked: true }] };
            });
          },
          setSelectedSlots: (slots: SlotMeta[]) => {
            set({ selectedSlots: slots });
          },
        },
      }),
    ),
  );
});

type MetadataReturn = Omit<MetadataStore, 'actions'> & MetadataStore['actions'];

export const useMetadata = (): MetadataReturn => {
  const store = MetadataContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<MetadataStore>, MetadataReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
