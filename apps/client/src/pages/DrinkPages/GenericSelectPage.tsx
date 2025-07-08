import { stylesItemsGrid } from './grid.styles';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useTranslation } from 'react-i18next';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadType, PadUI } from 'types/ui.types';
import type { OrderFieldKey } from 'types/orders.types';
import PadGroup from 'components/Pads/PadGroup/PadGroup';
import type { DataEntry } from 'types/data.types';
import { useSession } from 'providers/SessionProvider/SessionContext';

export const GenericSelectPage = () => {
  const { t } = useTranslation();
  const { fieldKey, padsConfig } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter } = useOrders();
  const { currentSessionId, sessions, updateSessionFilters } = useSession();

  const handleSelect = ({ fieldKey, pad }: { fieldKey: OrderFieldKey; pad: PadUI }) => {
    if (!orders?.length || !currentSessionId) return;

    // Get current session's orders
    const sessionOrders = orders.filter((order) =>
      sessions[currentSessionId]?.orderNumbers.includes(order.itemNumber),
    );

    // Update session filters
    const currentSessionFilters = sessions[currentSessionId]?.filters || {};

    if (pad.isChecked) {
      const lookup = { [padsConfig.filterKey as keyof DataEntry]: pad.value.name };
      const { temperatureProfileId, ...filterValue } = pad.value;
      const newFilters = {
        ...currentSessionFilters,
        [fieldKey]: { ...filterValue, lookup },
      };
      updateSessionFilters(currentSessionId, newFilters);
    } else {
      const { [fieldKey]: _removed, ...rest } = currentSessionFilters;
      updateSessionFilters(currentSessionId, rest);
    }

    // Also update individual orders for backward compatibility
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
    return <NoItems message={t('ui.states.empty')} />;
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
