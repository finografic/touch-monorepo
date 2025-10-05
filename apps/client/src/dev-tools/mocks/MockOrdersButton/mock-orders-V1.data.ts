import type { SlotItem } from 'types/orders.types';
import { SlotType } from 'types/orders.types';

export const MOCK_ORDERS_DATA: SlotItem[] = [
  {
    id: 'cmed7ceb8002xrllwxh87gxqo',
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
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmed7c9vc0009itlwo1wjuaw1',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmed7cc1i0004nalwj37sq1rt', name: '75cl', lookup: { volume: '75cl' } },
      containerType: { id: 'cmed7cba30001lylw3pux1t1a', name: 'vidrio', lookup: { containerType: 'vidrio' } },
    },
    session: { id: 'session_1755334628264_al8cq752l', flowType: 'program-product' },
  },
  {
    id: 'cmed7ceb8002xrllwxh87gxqo',
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
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmed7c9vc0009itlwo1wjuaw1',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmed7cc1i0004nalwj37sq1rt', name: '75cl', lookup: { volume: '75cl' } },
      containerType: { id: 'cmed7cba30001lylw3pux1t1a', name: 'vidrio', lookup: { containerType: 'vidrio' } },
    },
    session: { id: 'session_1755334628264_al8cq752l', flowType: 'program-product' },
  },
  {
    id: 'cmed7ceb8002xrllwxh87gxqo',
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
        lookup: { drinkType: 'vino' },
      },
      drinkSubtype: {
        id: 'cmed7c9vc0009itlwo1wjuaw1',
        name: 'tinto',
        defaultTempConsume: 15,
        lookup: { drinkSubtype: 'tinto' },
      },
      drinkVolume: { id: 'cmed7cc1i0004nalwj37sq1rt', name: '75cl', lookup: { volume: '75cl' } },
      containerType: { id: 'cmed7cba30001lylw3pux1t1a', name: 'vidrio', lookup: { containerType: 'vidrio' } },
    },
    session: { id: 'session_1755334628264_al8cq752l', flowType: 'program-product' },
  },
];
