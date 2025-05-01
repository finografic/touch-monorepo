import { useRouteConfig } from 'hooks/useRouteConfig';
import { useOrders } from 'providers/OrdersProvider';
import { styles } from './DevPanel.styles';
import { useEffect, useState } from 'react';
import type { OrderItem } from 'types/orders.types';
import { useLocation, useRouteLoaderData } from 'react-router-dom';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { NUM_SLOTS_TYPE_B, OrderFieldKeys } from 'constants/app.config';
import type { DrinkType } from 'types/models/drink-type.model';
import type { LayoutUiValues } from 'providers/LayoutUiProvider/LayoutUiContext.types';
import { initPadItems } from 'utils/ui.utils';

export const DevPanel = () => {
  const location = useLocation();
  const routeConfig = useRouteConfig();
  const [data, setData] = useState<OrderItem[]>([]);
  const { orders } = useOrders();

  const drinkTypes = useRouteLoaderData(OrderFieldKeys.drinkType) as DrinkType[] | undefined;
  const { numSlots, fieldKey, numPads, pads, setNumSlots, setFieldKey, setNumPads, setPads } = useLayoutUi();

  useEffect(() => {
    const initialValue: LayoutUiValues = {
      fieldKey: drinkTypes ? OrderFieldKeys.drinkType : undefined,
      numSlots: NUM_SLOTS_TYPE_B,
      numPads: drinkTypes ? drinkTypes.length : 0,
      pads: initPadItems({ numPads: drinkTypes ? drinkTypes.length : 0, keys: [], type: 'radio' }),
    };
    actions.setNumSlots(initialValue.numSlots);
    actions.setFieldKey(initialValue.fieldKey);
    actions.setNumPads(initialValue.numPads);
    actions.setPads(initialValue.pads);
    if (orders.length) {
      setData(orders);
    }
  }, [location.pathname]);

  return (
    <aside css={styles}>
      <pre>
        <h2>route</h2>
        {JSON.stringify({ ...routeConfig }, null, 2)}
      </pre>
      <pre>
        <h2>UI: {orders.length}</h2>
        {JSON.stringify({ numSlots, fieldKey, numPads, pads }, null, 2)}
      </pre>
      <pre>
        <h2>orders: {orders.length}</h2>
        {JSON.stringify(data[0], null, 2)}
      </pre>
    </aside>
  );
};
