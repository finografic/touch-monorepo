import { stylesItemsGrid } from './grid.styles';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadType, PadUI } from 'types/ui.types';
import type { OrderFieldKey, OrderFilter } from 'types/orders.types';
import PadGroup from 'components/Pad/PadGroup';
import { useFilters } from 'hooks/useFilters';
import type { DataEntry } from 'types/data.types';
// import { getPadIdsForField } from 'utils/ui.utils';

export const GenericSelectPage = () => {
  const { fieldKey, loaderData } = useRouteConfig();
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

  // ======================================================================== //

  const { filteredData, filters } = useFilters();
  log('__DEV - filteredData', 'lime', filteredData);
  log('__DEV - filters', 'orange', filters);

  // ======================================================================== //

  if (Object.keys(filters).includes(fieldKey)) {
    const localFilter = filters[fieldKey] as { name: string; id: string; hasSubtypes: boolean };

    if (localFilter) {
      // const filteredPads = filteredData.filter((o) => fieldKey in o);
      // const filteredPads = filteredData.filter((o) => Boolean('id' in o?.[fieldKey]));
      // const filteredPads = filterKeys.includes(fieldKey)
      //   ? filters[fieldKey]
      //   : filteredData.find((o) => o.id === localFilters.id);
    }

    log(
      '__DEV - filters ARR[]',
      'blue',
      {
        filteredData: filteredData.length,
        // filteredPads: filteredPads?.length,
      },
      filteredData,
    );
    // log('__DEV - localFilters.id', 'orange', localFilters.id);
    // log('__DEV - localFilters.id', 'orange', localFilters.id);

    log('__DEV - currentFilter', 'cyan', localFilter);

    const results = filteredData.filter((entry: DataEntry) => entry);

    if (results.length > 0) {
      for (const filterId of results) {
        // log('__DEV - filter.id', 'red', filterId);
      }
    }

    // .includes(localFilters.id);
    // log('__DEV - filter.id', 'red', hasPads);

    // filteredData.forEach((filter: DataEntry) => {
    //   log('__DEV - filter.id', 'red', filter.id);
    // });
  }

  if (!pads?.length) {
    return <NoItems message="No drink types found" />;
  }

  const padType: PadType = pads[0].type;

  // Debug current state
  log('__DEV - Current State', 'grey', {
    pads: pads.length,
    orders: orders.length,
    fieldKey,
  });

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
