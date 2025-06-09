import type { OrderItem } from 'types/orders.types';
import { ItemType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: OrderItem[] = [
  {
    itemType: ItemType.A,
    itemNumber: 0,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmblnbtve0001qqlwnjcyqbsz',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmblnbtvg000aqqlwr0mhsbzb',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: { id: 'cmblnbvm30004u0lwaknr8dlm', name: '75cl', lookup: { volumeName: '75cl' } },
      containerType: {
        id: 'cmblnbuzu0001sxlw3id406w7',
        name: 'vidrio',
        lookup: { containerTypeName: 'vidrio' },
      },
      temperature: { initial: 25, final: 8, lookup: { initial: 25, final: 8, name: '25°C → 8°C' } },
    },
    process: { status: 'idle' },
  },
  {
    itemType: ItemType.B,
    itemNumber: 1,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmblnbtve0001qqlwnjcyqbsz',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmblnbtvg000aqqlwr0mhsbzb',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: { id: 'cmblnbvm30004u0lwaknr8dlm', name: '75cl', lookup: { volumeName: '75cl' } },
      containerType: {
        id: 'cmblnbuzu0001sxlw3id406w7',
        name: 'vidrio',
        lookup: { containerTypeName: 'vidrio' },
      },
      temperature: { initial: 25, final: 8, lookup: { initial: 25, final: 8, name: '25°C → 8°C' } },
    },
    process: { status: 'idle' },
  },
  {
    itemType: ItemType.C,
    itemNumber: 9,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmblnbtve0001qqlwnjcyqbsz',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkTypeName: 'vino' },
      },
      drinkSubtype: {
        id: 'cmblnbtvg000aqqlwr0mhsbzb',
        name: 'blanco',
        defaultTempConsume: 12,
        lookup: { drinkSubtypeName: 'blanco' },
      },
      drinkVolume: { id: 'cmblnbvm30004u0lwaknr8dlm', name: '75cl', lookup: { volumeName: '75cl' } },
      containerType: {
        id: 'cmblnbuzu0001sxlw3id406w7',
        name: 'vidrio',
        lookup: { containerTypeName: 'vidrio' },
      },
      temperature: { initial: 25, final: 8, lookup: { initial: 25, final: 8, name: '25°C → 8°C' } },
    },
    process: { status: 'idle' },
  },
];
