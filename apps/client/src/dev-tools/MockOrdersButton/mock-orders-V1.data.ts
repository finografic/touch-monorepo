import type { OrderItem } from 'types/orders.types';
import { ItemType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: OrderItem[] = [
  {
    id: 'mock-order-v1-0',
    ids: ['mock-order-v1-0'],
    itemType: ItemType.A,
    itemNumber: 0,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmbpdca540001qqlwjndgui7h',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmbpdca56000aqqlwst74ntp8',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: { id: 'cmbpdcbuy0005u5lwplek3632', name: '50cl', lookup: { volumeName: '50cl' } },
      containerType: {
        id: 'cmbpdcb9g0001t4lwvzhwdvgs',
        name: 'vidrio',
        lookup: { containerTypeName: 'vidrio' },
      },
    },
    process: { status: 'idle' },
  },
  {
    id: 'mock-order-v1-1',
    ids: ['mock-order-v1-1'],
    itemType: ItemType.B,
    itemNumber: 1,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmbpdca540001qqlwjndgui7h',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmbpdca56000aqqlwst74ntp8',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: { id: 'cmbpdcbuy0005u5lwplek3632', name: '50cl', lookup: { volumeName: '50cl' } },
      containerType: {
        id: 'cmbpdcb9g0001t4lwvzhwdvgs',
        name: 'vidrio',
        lookup: { containerTypeName: 'vidrio' },
      },
    },
    process: { status: 'idle' },
  },
  {
    id: 'mock-order-v1-2',
    ids: ['mock-order-v1-2'],
    itemType: ItemType.C,
    itemNumber: 9,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmbpdca540001qqlwjndgui7h',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmbpdca56000aqqlwst74ntp8',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: { id: 'cmbpdcbuy0005u5lwplek3632', name: '50cl', lookup: { volumeName: '50cl' } },
      containerType: {
        id: 'cmbpdcb9g0001t4lwvzhwdvgs',
        name: 'vidrio',
        lookup: { containerTypeName: 'vidrio' },
      },
    },
    process: { status: 'idle' },
  },
];
