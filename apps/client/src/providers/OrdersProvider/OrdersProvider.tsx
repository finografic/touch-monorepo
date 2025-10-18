import { DISPLAY_NAME, OrdersContext as Orders } from './OrdersContext';
import type { OrdersProviderProps } from './OrdersContext.types';
import { OrdersDataInitializer } from './OrdersDataInitializer';

export const OrdersProvider = ({ initialValue, children }: OrdersProviderProps) => {
  return (
    <Orders.Provider initialValue={initialValue}>
      <OrdersDataInitializer />
      {children}
    </Orders.Provider>
  );
};

OrdersProvider.displayName = `${DISPLAY_NAME}Provider`;
