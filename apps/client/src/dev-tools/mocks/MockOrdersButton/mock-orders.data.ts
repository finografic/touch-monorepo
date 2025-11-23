import type { SlotMeta } from 'pages/MainPage/MainPage.types';

import type { OrderFilters } from 'types/filters.types';
import { SlotType } from 'types/slots.types';

export const MOCK_ORDERS_DATA: OrderFilters = {
  mode: {
    id: 'cmic2h9kn0002jg7nevni8zl1',
    name: '3',
  },
  drinkType: {
    id: 'cmic2h6cf0001e67n3l9vswcc',
    name: 'vino',
    hasSubtypes: true,
    defaultTempConsume: 15,
  },
  drinkSubtype: {
    id: 'cmic2h6cg0009e67nd7hetfns',
    name: 'tinto',
    defaultTempConsume: 15,
  },
  drinkVolume: {
    id: 'cmic2h8r60004i47n3ol3umwy',
    name: '75cl',
  },
  containerType: {
    id: 'cmic2h7xt0002gx7n62hhiefs',
    name: 'metal',
  },
};

/**
 * Template for mock slots - defines slotTypes to assign (A, B, C)
 * The actual slotNumbers will be randomly assigned based on availability
 */
export const MOCK_SELECTED_SLOTS_TEMPLATE: Omit<SlotMeta, 'slotNumber'>[] = [
  {
    slotType: SlotType.A,
    isChecked: true,
    status: 'idle',
  },
  {
    slotType: SlotType.B,
    isChecked: true,
    status: 'idle',
  },
  {
    slotType: SlotType.C,
    isChecked: true,
    status: 'idle',
  },
];
