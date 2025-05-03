import type { OrderItem } from 'types/orders.types';
import type { PadUI } from 'types/ui.types';

export const findOrderByNumber = (orders: OrderItem[], itemNumber: number): OrderItem | undefined => {
  return orders.find((order) => order.itemNumber === itemNumber);
};

export const findPadByNumber = (pads: PadUI[], index: number): PadUI | undefined => {
  return pads.find((pad) => pad.index === index);
};
