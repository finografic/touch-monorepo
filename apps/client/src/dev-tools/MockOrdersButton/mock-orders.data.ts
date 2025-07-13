import type { OrderItem } from 'types/orders.types';
import { ItemType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: OrderItem[] = [
  {
    id: '52577374-c42c-41fe-9f7c-a869f676220c',
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
    id: 'd9c47261-b3f0-4f22-a501-53d874d1ee12',
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
    id: '735dc7af-0f20-45a5-9993-886c283e7d72',
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
    id: '42502b66-46b4-434b-80f9-10fa63781793',
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

export const MOCK_ORDERS_DATA_V1: OrderItem[] = [
  {
    id: 'mock-order-0',
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
    id: 'mock-order-1',
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
    id: 'mock-order-2',
    itemType: ItemType.B,
    itemNumber: 3,
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
    id: 'mock-order-3',
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
