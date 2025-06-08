import type { ReactNode } from 'react';
import type { ItemType } from 'types/orders.types';

export interface MenuPadBaseProps {
  number?: number;
  className?: string;
}

export interface OrderItemPadProps extends MenuPadBaseProps {
  itemType: ItemType;
  number: number;
  children: ReactNode;
}
