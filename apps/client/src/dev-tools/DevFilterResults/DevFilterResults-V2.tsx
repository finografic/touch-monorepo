import { useFilters } from 'hooks/useFilters';
import { styles } from './DevFilterResults.styles';

export const DevFilterResults = () => {
  const { dataFiltered, filters } = useFilters({});

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>Filters ({Object.keys(filters).length}):</h4>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
      <div className="results-list">
        <h4>Results: {dataFiltered.length}</h4>
        {dataFiltered.map((item: any) => (
          <div
            key={item.id}
            className="result-row"
            style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
          >
            <div style={{ flex: '3', marginRight: '8px' }}>
              <strong>{item.drinkType}</strong>
            </div>
            <div style={{ flex: '2', marginRight: '8px' }}>
              <p style={{ margin: 0 }}>{item.drinkSubtype}</p>
            </div>
            <div style={{ flex: '2', marginRight: '8px' }}>
              <p style={{ margin: 0 }}>{item.volume}</p>
            </div>
            <div style={{ flex: '2', marginRight: '8px' }}>
              <p style={{ margin: 0 }}>{item.containerType}</p>
            </div>
            <div style={{ flex: '3' }}>
              <p style={{ margin: 0 }}>{item.temperatureProfile}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
