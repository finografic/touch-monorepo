import { stylesItemsGrid } from './grid.styles';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadType, PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import PadGroup from 'components/Pad/PadGroup';
// import { getPadIdsForField } from 'utils/ui.utils';

export const GenericSelectPage = () => {
  const { fieldKey } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter } = useOrders();

  const handleSelect = ({ fieldKey, pad }: { fieldKey: OrderFieldKey; pad: PadUI }) => {
    if (!orders?.length) return;

    for (const order of orders) {
      const currentFilters = order.filters || {};

      if (pad.isChecked) {
        if (currentFilters[fieldKey] !== pad.id) {
          setOrdersFilter({
            itemNumber: order.itemNumber,
            filter: { ...currentFilters, [fieldKey]: { ...pad.value } },
          });
        }
      } else {
        if (fieldKey in currentFilters) {
          // Remove the key entirely
          const { [fieldKey]: _removed, ...rest } = currentFilters;
          setOrdersFilter({
            itemNumber: order.itemNumber,
            filter: rest,
          });
        }
      }
    }
  };

  if (!pads?.length) {
    return <NoItems message="No drink types found" />;
  }

  // const padsResults = getPadIdsForField(orders, fieldKey);

  // log('__DEV - PAD RESULTS', 'red', { padsResults });
  // log('__DEV - ARGS', 'grey', { orders, fieldKey });

  const padType: PadType = pads[0].type;

  // Filter pads to only those present in padsResults
  // const visiblePads = pads.filter((pad) => pad.id && !padsResults.has(pad.id)
  //
  // const padsResults = getPadIdsForField(orders, fieldKey);
  // const visiblePads = padsResults.size === 0 ? pads : pads.filter((pad) => pad.id && padsResults.has(pad.id));
  const visiblePads = pads;

  log('__DEV - PADS', 'cyan', pads);
  log('__DEV - RES', 'lime', visiblePads);

  return (
    <section css={stylesItemsGrid}>
      <PadGroup
        type={padType}
        pads={visiblePads}
        onSelect={handleSelect}
        fieldKey={fieldKey}
        className={getGridFlowClasses(visiblePads.length)}
      />
    </section>
  );
};
