import type { ReactNode } from 'react';
import type { OrderItemType } from 'types/orders.types';

export interface MenuPadBaseProps {
  number?: number;
  className?: string;
}

export interface OrderItemPadProps extends MenuPadBaseProps {
  itemType: OrderItemType;
  number: number;
  children: ReactNode;
}
