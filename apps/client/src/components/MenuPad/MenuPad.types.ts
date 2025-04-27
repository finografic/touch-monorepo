import type { ReactNode } from 'react';

export interface MenuPadBaseProps {
  number?: number;
  className?: string;
}

export interface OrderItemPadProps extends MenuPadBaseProps {
  number: number;
  children: ReactNode;
}
