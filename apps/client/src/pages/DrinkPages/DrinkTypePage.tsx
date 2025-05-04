import { useEffect, useRef } from 'react';
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
  const { updatePadState } = useLayoutUi();
  const initialSyncDone = useRef(false);

  // Sync pad states with orders' filters on mount
  useEffect(() => {
    if (!orders?.length || !pads?.length || initialSyncDone.current) return;

    // Get unique filter values for the current fieldKey across all orders
    const activeFilters = new Set(orders.map((order) => order.filters[fieldKey]).filter(Boolean));

    // Check if we need to update any pads
    const needsUpdate = pads.some((pad) => activeFilters.has(pad.id) !== pad.isChecked);

    if (needsUpdate) {
      const updateFn = (currentPads: PadUI[]) =>
        currentPads.map((pad) => ({ ...pad, isChecked: activeFilters.has(pad.id) }));
      updatePadState(fieldKey, updateFn);
    }

    initialSyncDone.current = true;
  }, [fieldKey, orders, pads, updatePadState]);

  const handleSelect = ({ fieldKey, pad }: { fieldKey: OrderFieldKey; pad: PadUI }) => {
    if (!orders?.length) return;

    // For each order in the selection...
    for (const order of orders) {
      if (pad.isChecked) {
        // Pad is checked - set the filter with the pad's ID
        setOrderFilter({
          itemNumber: order.itemNumber,
          filter: { [fieldKey]: pad.id },
        });
      } else {
        // Pad is unchecked - remove the filter by setting an empty object
        // This will effectively remove the filter key from the order's filters
        setOrderFilter({
          itemNumber: order.itemNumber,
          filter: {},
        });
      }
    }
  };

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
