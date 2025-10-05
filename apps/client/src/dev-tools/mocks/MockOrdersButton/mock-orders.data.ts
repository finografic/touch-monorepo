import type { SlotItem } from 'types/orders.types';
import { SlotType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: SlotItem[] = [
  {
    id: 'mock-order-1',
    ids: [],
    slotType: SlotType.A,
    slotNumber: 1,
    isSelected: true,
    filters: {
      mode: {
        id: 'cmfk17i8e0002mulwv27uneha',
        name: '3',
      },
      drinkType: {
        id: 'cmed7c9vb0001itlwd3sxcr36',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
      },
      drinkSubtype: {
        id: 'cmed7c9vc0009itlwo1wjuaw1',
        name: 'tinto',
        defaultTempConsume: 15,
      },
      drinkVolume: {
        id: 'cmed7cc1i0004nalwj37sq1rt',
        name: '75cl',
      },
      containerType: {
        id: 'cmed7cba30001lylw3pux1t1a',
        name: 'vidrio',
      },
      temperature: {
        defaultConsume: 5,
        defaultFreeze: -5,
        temperatureProfiles: [
          {
            id: 'ffd2fc36-3b02-46d8-8953-f910cc65bc1c',
            modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
            temperature: 25,
            timeA: 60,
            timeB: 90,
            timeC: 120,
          },
          {
            id: '514deb34-60cc-4e4f-817d-ab8fdefc9e62',
            modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
            temperature: 15,
            timeA: 90,
            timeB: 135,
            timeC: 180,
          },
          {
            id: '0696cb77-aa92-4f1f-8a7b-473bef9a9175',
            modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
            temperature: 8,
            timeA: 120,
            timeB: 180,
            timeC: 240,
          },
          {
            id: '7399e4de-05a4-4c6c-aa93-4594fb95dce3',
            modeId: 'cmgbc4mnk0003r47ny5t1g4ao',
            temperature: 2,
            timeA: 150,
            timeB: 225,
            timeC: 300,
          },
        ],
        initial: 25,
        final: 5,
        closestInitialTemperature: 25,
        closestFinalTemperature: 8,
      },
    },
  },
  {
    id: 'mock-order-2',
    ids: [],
    slotType: SlotType.B,
    slotNumber: 7,
    isSelected: true,
    filters: {
      mode: {
        id: 'cmfk17i8e0002mulwv27uneha',
        name: '3',
      },
      drinkType: {
        id: 'cmed7c9vb0001itlwd3sxcr36',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
      },
      drinkSubtype: {
        id: 'cmed7c9vc0009itlwo1wjuaw1',
        name: 'tinto',
        defaultTempConsume: 15,
      },
      drinkVolume: {
        id: 'cmed7cc1i0004nalwj37sq1rt',
        name: '75cl',
      },
      containerType: {
        id: 'cmed7cba30001lylw3pux1t1a',
        name: 'vidrio',
      },
    },
  },
  {
    id: 'mock-order-3',
    ids: [],
    slotType: SlotType.C,
    slotNumber: 10,
    isSelected: true,
    filters: {
      mode: {
        id: 'cmfk17i8e0002mulwv27uneha',
        name: '3',
      },
      drinkType: {
        id: 'cmed7c9vb0001itlwd3sxcr36',
        name: 'vino',
        hasSubtypes: true,
        defaultTempConsume: 15,
      },
      drinkSubtype: {
        id: 'cmed7c9vc0009itlwo1wjuaw1',
        name: 'tinto',
        defaultTempConsume: 15,
      },
      drinkVolume: {
        id: 'cmed7cc1i0004nalwj37sq1rt',
        name: '75cl',
      },
      containerType: {
        id: 'cmed7cba30001lylw3pux1t1a',
        name: 'vidrio',
      },
    },
  },
];
