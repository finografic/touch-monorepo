import { useEffect } from 'react';
import { stylesItemsGrid } from './grid.styles';
// import type { DrinkType } from 'types/models/drink-type.model';
// import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
// import { OrderFieldKeys } from 'src/config/app.config';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadUI } from 'types/ui.types';
import { Pad } from 'components/Pad';
import type { OrderFieldKey } from 'types/orders.types';

export const DrinkTypePage = () => {
  const { fieldKey } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrderFilter } = useOrders();

  const handleSelect = ({ fieldKey, pad }: { fieldKey: OrderFieldKey; pad: PadUI }) => {
    log('pad', 'yellow', pad);
    if (orders?.length) {
      // log('orders', 'hotpink', orders);
      // log('pads', 'hotpink', pads);
      const hasSelection = pads.some((pad) => pad.isChecked);
      for (const order of orders) {
        if (hasSelection) {
          const filters = { [fieldKey]: {} };
          Object.assign(order.filters, { [fieldKey]: {} });
        } else {
          delete order.filters[fieldKey];
        }
        // const pad = pads.find((pad) => pad.id === order.id);
        // if (pad) {
        //   pad.isSelected = true;
        // }
      }
    }
  };

  /*
  useEffect(() => {
    if (orders?.length) {
      // log('orders', 'hotpink', orders);
      // log('pads', 'hotpink', pads);
      const hasSelection = pads.some((pad) => pad.isChecked);
      for (const order of orders) {
        if (hasSelection) {
          const filters = { [fieldKey]: {} };
          Object.assign(order.filters, { [fieldKey]: {} });
        } else {
          delete order.filters[fieldKey];
        }
        // const pad = pads.find((pad) => pad.id === order.id);
        // if (pad) {
        //   pad.isSelected = true;
        // }
      }
    }
  }, [orders, pads]);
  */

  if (!pads?.length) {
    return <NoItems message="No drink types found" />;
  }

  return (
    <section css={stylesItemsGrid}>
      <div className={getGridFlowClasses(pads.length)}>
        {pads.map((pad: PadUI) => (
          <Pad {...pad} key={pad.id} onSelect={handleSelect} fieldKey={fieldKey} className="item-button" />
        ))}
      </div>
    </section>
  );
};
