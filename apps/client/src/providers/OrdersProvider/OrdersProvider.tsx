import type { OrdersProviderProps } from './Orders.types';
import { OrdersContext as Orders } from './OrdersContext';
import { DISPLAY_NAME } from './OrdersContext';

export const OrdersProvider = ({ initialValue, children }: OrdersProviderProps) => {
  return <Orders.Provider initialValue={initialValue}>{children}</Orders.Provider>;
};

OrdersProvider.displayName = `${DISPLAY_NAME}Provider`;
