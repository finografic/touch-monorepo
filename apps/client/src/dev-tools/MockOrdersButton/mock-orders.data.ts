import type { OrderItem } from 'types/orders.types';
import { ItemType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: OrderItem[] = [
  {
    itemType: ItemType.A,
    itemNumber: 0,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmd0wgs960001mklwuhnicrqt',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmd0wgs980009mklwwjczy7qc',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmd0wgtyu0005pxlwbsp7we8g', name: '50cl', lookup: { volume: '50cl' } },
      containerType: {
        id: 'cmd0wgtdy0001oslwwbiv2yei',
        name: 'vidrio',
        lookup: { containerType: 'vidrio' },
      },
    },
    process: { status: 'idle' },
  },
  {
    itemType: ItemType.B,
    itemNumber: 2,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmd0wgs960001mklwuhnicrqt',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmd0wgs980009mklwwjczy7qc',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmd0wgtyu0005pxlwbsp7we8g', name: '50cl', lookup: { volume: '50cl' } },
      containerType: {
        id: 'cmd0wgtdy0001oslwwbiv2yei',
        name: 'vidrio',
        lookup: { containerType: 'vidrio' },
      },
    },
    process: { status: 'idle' },
  },
  {
    itemType: ItemType.B,
    itemNumber: 5,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmd0wgs960001mklwuhnicrqt',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmd0wgs980009mklwwjczy7qc',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmd0wgtyu0005pxlwbsp7we8g', name: '50cl', lookup: { volume: '50cl' } },
      containerType: {
        id: 'cmd0wgtdy0001oslwwbiv2yei',
        name: 'vidrio',
        lookup: { containerType: 'vidrio' },
      },
    },
    process: { status: 'idle' },
  },
  {
    itemType: ItemType.C,
    itemNumber: 9,
    isSelected: true,
    filters: {
      drinkType: {
        id: 'cmd0wgs960001mklwuhnicrqt',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmd0wgs980009mklwwjczy7qc',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmd0wgtyu0005pxlwbsp7we8g', name: '50cl', lookup: { volume: '50cl' } },
      containerType: {
        id: 'cmd0wgtdy0001oslwwbiv2yei',
        name: 'vidrio',
        lookup: { containerType: 'vidrio' },
      },
    },
    process: { status: 'idle' },
  },
];
