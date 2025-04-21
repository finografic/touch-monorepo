import type { OrdersProviderProps } from './OrdersContext.types';
import { DISPLAY_NAME, OrdersContext as Orders } from './OrdersContext';

export const OrdersProvider = ({ initialValue, children }: OrdersProviderProps) => {
  return <Orders.Provider initialValue={initialValue}>{children}</Orders.Provider>;
};

OrdersProvider.displayName = `${DISPLAY_NAME}Provider`;
