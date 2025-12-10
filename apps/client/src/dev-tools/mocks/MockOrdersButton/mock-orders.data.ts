import type { SlotMeta } from 'pages/MainPage/MainPage.types';
import type { OrderFilters } from 'types/filters.types';
import { SlotType } from 'types/slots.types';

export const MOCK_ORDERS_DATA: OrderFilters = {
  mode: {
    id: 'cmizjus4600021y7nz9kngei9',
    name: '3',
  },
  drinkType: {
    id: 'cmizjuot50001ug7nt9u6por0',
    name: 'vino',
    hasSubtypes: true,
    defaultTempConsume: 15,
  },
  drinkSubtype: {
    id: 'cmizjuot70009ug7ne131tvu1',
    name: 'vino--tinto',
    defaultTempConsume: 15,
  },
  drinkVolume: {
    id: 'cmizjura20004097n87slmkf0',
    name: '75cl',
  },
  containerType: {
    id: 'cmizjuqg00001yg7n8brno122',
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
