import type { SlotMeta } from 'pages/MainPage/MainPage.types';

import type { OrderFilters } from 'types/filters.types';
import { SlotType } from 'types/slots.types';

export const MOCK_ORDERS_DATA: OrderFilters = {
  mode: {
    id: 'cmid93kry0002k67nzbp15fas',
    name: '3',
  },
  drinkType: {
    id: 'cmid93hj30001cq7njlsiwvt8',
    name: 'vino',
    hasSubtypes: true,
    defaultTempConsume: 15,
  },
  drinkSubtype: {
    id: 'cmid93hj40009cq7ny6a6ds21',
    name: 'tinto',
    defaultTempConsume: 15,
  },
  drinkVolume: {
    id: 'cmid93jyn0006ie7nu0c4efck',
    name: '33cl',
  },
  containerType: {
    id: 'cmid93j5a0001ga7nvk2iqpkq',
    name: 'vidrio',
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
