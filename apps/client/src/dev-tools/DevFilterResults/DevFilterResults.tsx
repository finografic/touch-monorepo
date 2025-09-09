import { useFilters } from 'hooks/useFilters';
import { styles } from './DevFilterResults.styles';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { DevDataTable } from '../DevDataTable';

export const DevFilterResults = () => {
  const { dataFiltered, filters } = useFilters({});
  const { sessions, currentSessionId } = useSession();

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>Filters ({Object.keys(filters).length}):</h4>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
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
