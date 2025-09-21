import type { OrderItem } from 'types/orders.types';
import type { PadUI } from 'types/ui.types';

export const findOrderByNumber = (orders: OrderItem[], slotNumber: number): OrderItem | undefined => {
  return orders.find((order) => order.slotNumber === slotNumber);
};

export const findPadByNumber = (pads: PadUI[], index: number): PadUI | undefined => {
  return pads.find((pad) => pad.index === index);
};
