import type { OrderItem } from 'types/orders.types';
import { ItemType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: OrderItem[] = [
  {
    id: 'cmdehi22f002qlqlw33uyc6lq',
    ids: ['cmdehi22f002qlqlw33uyc6lq'],
    itemType: ItemType.A,
    itemNumber: 4,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmdehhymx0001eklwcqv5l4fi',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmdehhymz0009eklwdpluu41u',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmdehi0av0004i0lw3oq7hgpo', name: '75cl', lookup: { volume: '75cl' } },
      containerType: { id: 'cmdehhzq90001gulwo4qj7vvv', name: 'vidrio', lookup: { containerType: 'vidrio' } },
    },
    session: { id: 'session_1753223935235_1ajwph7wy', flowType: 'program-product' },
    process: { status: 'idle' },
  },
  {
    id: 'cmdehi22f002qlqlw33uyc6lq',
    ids: ['cmdehi22f002qlqlw33uyc6lq'],
    itemType: ItemType.C,
    itemNumber: 7,
    isSelected: false,
    filters: {
      drinkType: {
        id: 'cmdehhymx0001eklwcqv5l4fi',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmdehhymz0009eklwdpluu41u',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmdehi0av0004i0lw3oq7hgpo', name: '75cl', lookup: { volume: '75cl' } },
      containerType: { id: 'cmdehhzq90001gulwo4qj7vvv', name: 'vidrio', lookup: { containerType: 'vidrio' } },
    },
    session: { id: 'session_1753223935235_1ajwph7wy', flowType: 'program-product' },
    process: { status: 'idle' },
  },
  {
    id: 'cmdehi22f002qlqlw33uyc6lq',
    ids: ['cmdehi22f002qlqlw33uyc6lq'],
    itemType: ItemType.B,
    itemNumber: 8,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmdehhymx0001eklwcqv5l4fi',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmdehhymz0009eklwdpluu41u',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmdehi0av0004i0lw3oq7hgpo', name: '75cl', lookup: { volume: '75cl' } },
      containerType: { id: 'cmdehhzq90001gulwo4qj7vvv', name: 'vidrio', lookup: { containerType: 'vidrio' } },
    },
    session: { id: 'session_1753223935235_1ajwph7wy', flowType: 'program-product' },
    process: { status: 'idle' },
  },
  {
    id: 'cmdehi22f002qlqlw33uyc6lq',
    ids: ['cmdehi22f002qlqlw33uyc6lq'],
    itemType: ItemType.C,
    itemNumber: 10,
    isSelected: false,
    filters: {
      drinkType: {
        id: 'cmdehhymx0001eklwcqv5l4fi',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmdehhymz0009eklwdpluu41u',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmdehi0av0004i0lw3oq7hgpo', name: '75cl', lookup: { volume: '75cl' } },
      containerType: { id: 'cmdehhzq90001gulwo4qj7vvv', name: 'vidrio', lookup: { containerType: 'vidrio' } },
    },
    session: { id: 'session_1753223935235_1ajwph7wy', flowType: 'program-product' },
    process: { status: 'idle' },
  },
];
