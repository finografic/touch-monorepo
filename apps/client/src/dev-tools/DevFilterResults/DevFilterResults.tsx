import { useFilters } from 'hooks/useFilters';
import { styles } from './DevFilterResults.styles';
import { useSession } from 'providers/SessionProvider/SessionContext';

export const DevFilterResults = () => {
  const { dataFiltered, filters } = useFilters({});
  const { sessions, currentSessionId } = useSession();

  // return (
  //   <div id="dev-filter-results" css={styles}>
  //     <div className="filters">
  //       <h4>SESSION_ID: {currentSessionId}</h4>
  //       <pre>{JSON.stringify(sessions, null, 2)}</pre>
  //     </div>
  //   </div>
  // );

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
            <div className="result-col">
              <p style={{ margin: 0 }}>{item.temperatureProfile}</p>
            </div>
            <div className="result-col">
              <span style={{ opacity: 0.66 }}>{item.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
