import { useFiltering } from 'hooks/useFiltering';
import { styles } from './DevFilterResults.styles';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { DevDataTable } from '../DevDataTable';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';

export const DevFilterResults = () => {
  const { dataFiltered, filters } = useFiltering({});
  // const { filters: ordersFilters } = useOrders();
  const { sessions, currentSessionId } = useSession();

  log('__DEV: filters', 'hotpink', filters);
  // log('__DEV: ordersFilters', 'hotpink', ordersFilters);

  const sessionFilters =
    currentSessionId && sessions[currentSessionId] ? sessions[currentSessionId].filters : {};

  return (
    <div id="dev-filter-results" css={styles}>
      {/* <div className="filters">
        <h4>Filters ({Object.keys(filters).length}):</h4>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div> */}
      <div className="filters">
        <h4>sessionFilters ({Object.keys(sessionFilters).length}):</h4>
        <pre>{JSON.stringify(sessionFilters, null, 2)}</pre>
      </div>
      <DevDataTable
        data={dataFiltered}
        title={`Results: ${dataFiltered.length}`}
        columns={[
          { key: 'drinkType', strong: true },
          { key: 'drinkSubtype' },
          { key: 'volume' },
          { key: 'containerType' },
          { key: 'temperatureProfile', styles: { margin: 0 } },
          { key: 'id', styles: { opacity: 0.66 } },
        ]}
      />
    </div>
  );
};
