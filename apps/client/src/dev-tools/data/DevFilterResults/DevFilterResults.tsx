import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useLayoutUi } from 'providers/LayoutUiProvider/LayoutUiContext';
import { useSession } from 'providers/SessionProvider/SessionContext';

import type { OrderFilters } from 'types/filters.types';
import { DevDataTable } from '../../components/DevDataTable';
import { styles } from './DevFilterResults.styles';

export const DevFilterResults = () => {
  const { filters, dataFiltered } = useFilters();
  const { selectedSlots } = useLayoutUi();
  // const { sessions, currentSessionId } = useSession();

  // const { filters: ordersFilters } = useOrders();
  // const { profile } = useOrders();
  // log('__DEV: profile', 'yellow', profile);
  // log('__DEV: filters', 'hotpink', filters);
  // log('__DEV: ordersFilters', 'hotpink', ordersFilters);

  // const sessionFilters =
  //   currentSessionId && sessions[currentSessionId] ? sessions[currentSessionId].filters : {};

  // const filtersCompact = {} as OrderFilters;

  // for (const [key, value] of Object.entries(filters)) {
  //   if (key !== 'temperature') {
  //     filtersCompact[key as keyof OrderFilters] = value;
  //   }
  // }

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>snooze, timers: {selectedSlots.length}:</h4>
        <pre>{JSON.stringify({ selectedSlots }, null, 2)}</pre>
      </div>
      <div className="filters">
        <h4>Filters ({Object.keys(filters).length}):</h4>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
        {/* <pre>{JSON.stringify(filtersCompact, null, 2)}</pre> */}
      </div>
      {/* <div className="filters">
        <h4>
          Session: <strong style={{ color: 'grey' }}>{currentSessionId}</strong>
        </h4>
        <h4>sessionFilters ({Object.keys(sessionFilters).length}):</h4>
        <pre>{JSON.stringify(sessionFilters, null, 2)}</pre>
      </div> */}
      <DevDataTable
        data={dataFiltered}
        title={`Results: ${dataFiltered.length}`}
        columns={[
          { key: 'drinkType', strong: true },
          { key: 'mode', strong: true },
          { key: 'volume' },
          { key: 'containerType' },
        ]}
      />
    </div>
  );
};
