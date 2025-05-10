import { useEffect, useRef } from 'react';
import { stylesItemsGrid } from './grid.styles';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadUI } from 'types/ui.types';
import { Pad } from 'components/Pad';
import type { OrderFieldKey } from 'types/orders.types';

export const GenericSelectPage = () => {
  const { fieldKey } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter } = useOrders();
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

    console.log('%c __FILTER_PAD:', 'color:yellow', pad);

    for (const order of orders) {
      const currentFilters = order.filters || {};

      if (pad.isChecked) {
        // Only update if the filter value is different
        if (currentFilters[fieldKey] !== pad.id) {
          setOrdersFilter({
            itemNumber: order.itemNumber,
            filter: { ...currentFilters, [fieldKey]: pad.id },
          });
        }
      } else {
        // Only update if the filter key exists
        if (fieldKey in currentFilters) {
          // Remove the fieldKey from filters
          const { [fieldKey]: _, ...newFilters } = currentFilters;
          setOrdersFilter({
            itemNumber: order.itemNumber,
            // filter: newFilters,
            filter: { ...currentFilters, [fieldKey]: undefined },
          });
        }
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
