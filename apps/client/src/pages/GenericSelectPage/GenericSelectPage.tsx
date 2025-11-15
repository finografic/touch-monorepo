import { useTranslation } from 'react-i18next';

import { NoItems } from 'components/NoItems/NoItems';
import PadGroup from 'components/Pads/PadGroup/PadGroup';

import { usePaginationLogic } from 'hooks/usePaginationLogic';
import { useFiltersContext } from 'providers/FiltersProvider';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

import { isFilterFlowKey, isNavigationFieldKey } from 'utils/fieldKey.utils';
import { getFiltersToClearAhead } from 'utils/filters/filters-flow.utils';
import type { FilterKey, NavigationFieldKey } from 'types/slots.types';
import type { PadType, PadUI } from 'types/pads.types';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { stylesItemsGrid } from './grid.styles';

export const GenericSelectPage = () => {
  const { t } = useTranslation();
  const { filterKey, padsConfig } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter } = useOrders();
  const { currentSessionId, sessions, updateSessionFilters } = useSession();
  const { setFilter, clearFilter } = useFiltersContext();

  // Use consolidated pagination logic
  usePaginationLogic();

  const handleFilterSelection = (filterKey: FilterKey, pad: PadUI) => {
    const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);
    const currentSessionFilters = sessions[currentSessionId]?.filters || {};

    if (pad.isChecked) {
      const { temperatureProfileId, ...filterValue } = pad.value;

      // Clear filters for steps ahead when making a new selection
      const filtersToClearAhead = getFiltersToClearAhead({ filterKey });
      filtersToClearAhead.forEach(clearFilter);

      // Remove filters for steps ahead from session filters too
      const sessionFiltersWithoutAhead = { ...currentSessionFilters };
      filtersToClearAhead.forEach((filterApiKey) => {
        delete sessionFiltersWithoutAhead[filterApiKey];
      });

      const newFilters = {
        ...sessionFiltersWithoutAhead,
        [filterKey]: filterValue,
      };
      updateSessionFilters(currentSessionId, newFilters);
      setFilter(filterKey, filterValue);
    } else {
      const { [filterKey]: _removed, ...rest } = currentSessionFilters;
      updateSessionFilters(currentSessionId, rest);
      clearFilter(filterKey);
    }

    // Also update individual orders for backward compatibility
    for (const order of sessionOrders) {
      const currentFilters = order.filters || {};

      if (pad.isChecked) {
        if (currentFilters[filterKey] !== pad.id) {
          const { temperatureProfileId, ...filterValue } = pad.value;
          setOrdersFilter({
            slotNumber: order.slotNumber,
            filter: { ...currentFilters, [filterKey]: filterValue },
          });
        }
      } else {
        if (filterKey in currentFilters) {
          const { [filterKey]: _removed, ...rest } = currentFilters;
          setOrdersFilter({
            slotNumber: order.slotNumber,
            filter: rest,
          });
        }
      }
    }
  };

  const handleNavigationSelection = (filterKey: NavigationFieldKey, pad: PadUI) => {
    // Handle navigation field key logic (e.g., main page slot selection)
    // This is where you would implement the logic for the main page
    console.log(`Navigation selection for ${filterKey}:`, pad);
  };

  const handleSelect = ({ pad }: { pad: PadUI }) => {
    if (!orders?.length || !currentSessionId) return;

    // Use type guards to handle different field key types
    if (isFilterFlowKey(filterKey)) {
      handleFilterSelection(filterKey, pad);
    } else if (isNavigationFieldKey(filterKey)) {
      handleNavigationSelection(filterKey, pad);
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
        filterKey={filterKey}
        className={getGridFlowClasses(pads.length)}
      />
    </section>
  );
};
