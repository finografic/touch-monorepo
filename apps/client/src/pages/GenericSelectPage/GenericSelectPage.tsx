import { stylesItemsGrid } from './grid.styles';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { NoItems } from 'components/NoItems/NoItems';
import { useTranslation } from 'react-i18next';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import { usePaginationLogic } from 'hooks/usePaginationLogic';
import type { PadType, PadUI } from 'types/pads.types';
import type { FilterKey, NavigationFieldKey } from 'types/orders.types';
import PadGroup from 'components/Pads/PadGroup/PadGroup';
import type { DataEntry } from 'types/data.types';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFiltersContext } from 'providers/FiltersProvider';
import { getFiltersToClearAhead } from 'utils/filterStep.utils';
import { isFilterFlowKey, isNavigationFieldKey } from 'utils/fieldKey.utils';

export const GenericSelectPage = () => {
  const { t } = useTranslation();
  const { filterFieldKey, padsConfig } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders, setOrdersFilter } = useOrders();
  const { currentSessionId, sessions, updateSessionFilters } = useSession();
  const { setFilter, clearFilter } = useFiltersContext();

  // Use consolidated pagination logic
  usePaginationLogic();

  const handleFilterSelection = (filterFieldKey: FilterKey, pad: PadUI) => {
    // Get current session's orders
    const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);

    // Update session filters
    const currentSessionFilters = sessions[currentSessionId]?.filters || {};

    if (pad.isChecked) {
      const { temperatureProfileId, ...filterValue } = pad.value;

      // Clear filters for steps ahead when making a new selection
      const filtersToClearAhead = getFiltersToClearAhead(filterFieldKey);
      filtersToClearAhead.forEach(clearFilter);

      // Remove filters for steps ahead from session filters too
      const sessionFiltersWithoutAhead = { ...currentSessionFilters };
      filtersToClearAhead.forEach((filterApiKey) => {
        delete sessionFiltersWithoutAhead[filterApiKey];
      });

      const newFilters = {
        ...sessionFiltersWithoutAhead,
        [filterFieldKey]: filterValue,
      };
      updateSessionFilters(currentSessionId, newFilters);
      // Update FiltersContext for the current filterFieldKey
      setFilter(filterFieldKey, filterValue);
    } else {
      const { [filterFieldKey]: _removed, ...rest } = currentSessionFilters;
      updateSessionFilters(currentSessionId, rest);
      // Clear filter from FiltersContext for the current filterFieldKey
      clearFilter(filterFieldKey);
    }

    // Also update individual orders for backward compatibility
    for (const order of sessionOrders) {
      const currentFilters = order.filters || {};

      if (pad.isChecked) {
        if (currentFilters[filterFieldKey] !== pad.id) {
          const { temperatureProfileId, ...filterValue } = pad.value;
          setOrdersFilter({
            slotNumber: order.slotNumber,
            filter: { ...currentFilters, [filterFieldKey]: filterValue },
          });
        }
      } else {
        if (filterFieldKey in currentFilters) {
          const { [filterFieldKey]: _removed, ...rest } = currentFilters;
          setOrdersFilter({
            slotNumber: order.slotNumber,
            filter: rest,
          });
        }
      }
    }
  };

  const handleNavigationSelection = (filterFieldKey: NavigationFieldKey, pad: PadUI) => {
    // Handle navigation field key logic (e.g., main page slot selection)
    // This is where you would implement the logic for the main page
    console.log(`Navigation selection for ${filterFieldKey}:`, pad);
  };

  const handleSelect = ({ pad }: { pad: PadUI }) => {
    if (!orders?.length || !currentSessionId) return;

    // Use type guards to handle different field key types
    if (isFilterFlowKey(filterFieldKey)) {
      handleFilterSelection(filterFieldKey, pad);
    } else if (isNavigationFieldKey(filterFieldKey)) {
      handleNavigationSelection(filterFieldKey, pad);
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
        filterFieldKey={filterFieldKey}
        className={getGridFlowClasses(pads.length)}
      />
    </section>
  );
};
