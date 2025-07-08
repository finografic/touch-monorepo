import type { ReactNode } from 'react';
import type { ItemType } from 'types/orders.types';

export interface PadMenuBaseProps {
  number?: number;
  className?: string;
}

export interface PadMenuProps extends PadMenuBaseProps {
  itemType: ItemType;
  number: number;
  children: ReactNode;
}
