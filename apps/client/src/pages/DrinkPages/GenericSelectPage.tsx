import { stylesItemsGrid } from './grid.styles';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadType, PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import PadGroup from 'components/PadGroup/PadGroup';
import type { DataEntry } from 'types/data.types';

export const GenericSelectPage = () => {
  const { fieldKey, padsConfig } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter, currentConfigurationSessionId } = useOrders();

  const handleSelect = ({ fieldKey, pad }: { fieldKey: OrderFieldKey; pad: PadUI }) => {
    if (!orders?.length || !currentConfigurationSessionId) return;

    // Only update orders that belong to the current configuration session
    const sessionOrders = orders.filter(
      (order) => order.configurationSessionId === currentConfigurationSessionId,
    );

    for (const order of sessionOrders) {
      const currentFilters = order.filters || {};

      if (pad.isChecked) {
        if (currentFilters[fieldKey] !== pad.id) {
          const lookup = { [padsConfig.filterKey as keyof DataEntry]: pad.value.name };
          const { temperatureProfileId, ...filterValue } = pad.value;
          setOrdersFilter({
            itemNumber: order.itemNumber,
            filter: { ...currentFilters, [fieldKey]: { ...filterValue, lookup } },
          });
        }
      } else {
        if (fieldKey in currentFilters) {
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
    return <NoItems message="No entries found" />;
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
