import { useFilters } from 'providers/FiltersProvider/useFilters';
import { styles } from './DevFilterResults.styles';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { DevDataTable } from '../../components/DevDataTable';

export const DevFilterResults = () => {
  const { filters, dataFiltered } = useFilters();
  const { sessions, currentSessionId } = useSession();

  // const { filters: ordersFilters } = useOrders();
  // const { profile } = useOrders();
  // log('__DEV: profile', 'yellow', profile);
  // log('__DEV: filters', 'hotpink', filters);
  // log('__DEV: ordersFilters', 'hotpink', ordersFilters);

  const sessionFilters =
    currentSessionId && sessions[currentSessionId] ? sessions[currentSessionId].filters : {};

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>Filters ({Object.keys(filters).length}):</h4>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
      <div className="filters">
        <h4>
          Session: <strong style={{ color: 'grey' }}>{currentSessionId}</strong>
        </h4>
        <h4>sessionFilters ({Object.keys(sessionFilters).length}):</h4>
        <pre>{JSON.stringify(sessionFilters, null, 2)}</pre>
      </div>
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
