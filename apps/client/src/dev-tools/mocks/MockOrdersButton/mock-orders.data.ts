import type { SlotMeta } from 'pages/MainPage/MainPage.types';

import type { OrderFilters } from 'types/filters.types';
import { SlotType } from 'types/slots.types';

export const MOCK_ORDERS_DATA: OrderFilters = {
  mode: {
    id: 'cmi0ps0wn0002hslw3c3uh5p7',
    name: '3',
  },
  drinkType: {
    id: 'cmi0prxjs00019glwu3cf92hz',
    name: 'vino',
    hasSubtypes: true,
    defaultTempConsume: 15,
  },
  drinkSubtype: {
    id: 'cmi0prxju000a9glwva5pw5i5',
    name: 'blanco',
    defaultTempConsume: 12,
  },
  drinkVolume: {
    id: 'cmi0ps04i0005g7lwxfz5w8kq',
    name: '50cl',
  },
  containerType: {
    id: 'cmi0przbd0000d9lw99ksdmmf',
    name: 'plastico',
  },
};

export const MOCK_SELECTED_SLOTS_DATA: SlotMeta[] = [
  {
    slotType: SlotType.A,
    slotNumber: 1,
    isChecked: true,
    status: 'idle',
  },
  {
    slotType: SlotType.B,
    slotNumber: 7,
    isChecked: true,
    status: 'idle',
  },
  {
    slotType: SlotType.C,
    slotNumber: 10,
    isChecked: true,
    status: 'idle',
  },
];
