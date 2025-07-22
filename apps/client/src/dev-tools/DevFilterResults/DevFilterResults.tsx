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
          <div key={item.id} className="result-row">
            <div className="result-col">
              <strong>{item.drinkType}</strong>
            </div>
            <div className="result-col">{item.drinkSubtype}</div>
            <div className="result-col">{item.volume}</div>
            <div className="result-col">{item.containerType}</div>
            {/* <div className="result-col">
                  <p style={{ margin: 0 }}>{item.temperatureProfile}</p>
                </div> */}
            <div className="result-col">
              <span style={{ opacity: 0.33 }}>{item.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
