import { useRouteConfig } from 'hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { styles } from './DevPanel.styles';
import { useEffect, useState } from 'react';
import type { OrderItem } from 'types/orders.types';
import { useLoaderData, useLocation } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { OrderFieldKeys } from 'constants/app.config';
import type { DrinkType } from 'types/models/drink-type.model';

export const DevPanel = () => {
  const location = useLocation();
  const routeConfig = useRouteConfig();
  const [data, setData] = useState<OrderItem[]>([]);
  const { orders } = useOrders();

  // const drinkTypes = useRouteLoaderData(OrderFieldKeys.drinkType) as DrinkType[] | undefined;
  const drinkTypes = useLoaderData() as DrinkType[] | undefined;

  const {
    numSlots,
    fieldKey,
    numPads,
    pads,
    //  updateFromDrinkTypes
  } = useLayoutUi();

  console.log('%c __DRINK', 'color:yellow', { drinkTypes });

  useEffect(() => {
    // Update UI state when drinkTypes change
    // updateFromDrinkTypes(drinkTypes);

    // Update orders data
    if (orders.length) {
      setData(orders);
    }
  }, [drinkTypes, location.pathname]);

  return (
    <aside css={styles}>
      <pre>
        <h2>route</h2>
        {JSON.stringify({ ...routeConfig }, null, 2)}
      </pre>
      <pre>
        <h2>UI State</h2>
        {JSON.stringify({ numSlots, fieldKey, numPads, pads }, null, 2)}
      </pre>
      <pre>
        <h2>orders: {orders.length}</h2>
        {JSON.stringify(data[0], null, 2)}
      </pre>
    </aside>
  );
};
