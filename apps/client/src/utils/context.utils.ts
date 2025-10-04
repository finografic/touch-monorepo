import type { SlotItem } from 'types/orders.types';
import type { PadUI } from 'types/pads.types';

export const findOrderByNumber = (orders: SlotItem[], slotNumber: number): SlotItem | undefined => {
  return orders.find((order) => order.slotNumber === slotNumber);
};

export const findPadByNumber = (pads: PadUI[], index: number): PadUI | undefined => {
  return pads.find((pad) => pad.index === index);
};
