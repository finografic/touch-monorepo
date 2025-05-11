import { useEffect, useRef } from 'react';
import { stylesItemsGrid } from './grid.styles';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadType, PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import PadGroup from 'components/Pad/PadGroup';

export const GenericSelectPage = () => {
  const { fieldKey } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter } = useOrders();
  const { updatePadState } = useLayoutUi();
  const initialSyncDone = useRef(false);

  useEffect(() => {
    if (!orders?.length || !pads?.length || initialSyncDone.current) return;

    const activeFilters = new Set(orders.map((order) => order.filters[fieldKey]).filter(Boolean));
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

    for (const order of orders) {
      const currentFilters = order.filters || {};

      if (pad.isChecked) {
        if (currentFilters[fieldKey] !== pad.id) {
          setOrdersFilter({
            itemNumber: order.itemNumber,
            // filter: { ...currentFilters, [fieldKey]: pad.id },
            filter: {
              ...currentFilters,
              //  [fieldKey]: pad.id
              [fieldKey]: {
                value: pad.id,
                ...pad.metadata,
              },
            },
          });
        }
      } else {
        if (fieldKey in currentFilters) {
          setOrdersFilter({
            itemNumber: order.itemNumber,
            filter: { ...currentFilters, [fieldKey]: undefined },
          });
        }
      }
    }
  };

  if (!pads?.length) {
    return <NoItems message="No drink types found" />;
  }

  const padType: PadType = pads[0].type;

  return (
    <section css={stylesItemsGrid}>
      <PadGroup
        type={padType}
        pads={pads}
        onSelect={handleSelect}
        fieldKey={fieldKey}
        className={getGridFlowClasses(pads.length)}
      />
    </section>
  );
};
