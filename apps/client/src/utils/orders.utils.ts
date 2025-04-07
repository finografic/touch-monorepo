import { OrderItem } from 'types/orders.types';

export const findOrderByNumber = (orders: OrderItem[], itemNumber: number): OrderItem | undefined => {
  return orders.find((order) => order.itemNumber === itemNumber);
};
