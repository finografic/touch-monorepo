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
          <pre key={item.id} className="result-row">
            <div className="result-col">
              <strong>{item.drinkType}</strong>
            </div>
            <div className="result-col">
              <p style={{ margin: 0 }}>{item.drinkSubtype}</p>
            </div>
            <div className="result-col">
              <p style={{ margin: 0 }}>{item.volume}</p>
            </div>
            <div className="result-col">
              <p style={{ margin: 0 }}>{item.containerType}</p>
            </div>
            <div className="result-col">
              <p style={{ margin: 0 }}>{item.temperatureProfile}</p>
            </div>
            <div className="result-col">
              <strong style={{ opacity: 0.33 }}>{item.id}</strong>
            </div>
          </pre>
        ))}
      </div>
    </div>
  );
};
