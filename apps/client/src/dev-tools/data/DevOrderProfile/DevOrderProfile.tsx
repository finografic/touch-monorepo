import { useFilters } from 'providers/FiltersProvider/useFilters';
import { useOrders } from 'providers/OrdersProvider';

import { styles } from './DevOrderProfile.styles';

export const DevOrderProfile = () => {
  const { profile } = useOrders();
  const { filters } = useFilters();

  return (
    <div id="dev-filter-results" css={styles}>
      <div className="filters">
        <h4>Filters ({Object.keys(filters).length}):</h4>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
      <div className="results-list">
        {profile && (
          <>
            <h4>PROFILE:</h4>
            <div className="result-header">
              <div className="result-col">DRINK_TYPE</div>
              <div className="result-col">CONSUME °C</div>
              <div className="result-col">FREEZE °C</div>
              <div className="result-col">ID</div>
            </div>
            <div className="result-row">
              <div className="result-col">{profile.drinkType}</div>
              <div className="result-col">{profile.defaultTempConsume}</div>
              <div className="result-col">{profile.defaultTempFreeze}</div>
              <div className="result-col">{profile.id}</div>
            </div>
          </>
        )}

        {profile?.temperatureProfiles && profile.temperatureProfiles.length > 0 && (
          <>
            <h4>TEMPERATURE PROFILES:</h4>
            <div className="result-header">
              <div className="result-col">TEMPERATURE</div>
              <div className="result-col">TIME A</div>
              <div className="result-col">TIME B</div>
              <div className="result-col">TIME C</div>
            </div>
            {profile.temperatureProfiles.map(
              (row: { temperature: number; timeA: number; timeB: number; timeC: number }, index: number) => (
                <div key={index} className="result-row">
                  <div className="result-col">{row.temperature}°C</div>
                  <div className="result-col">{row.timeA}s</div>
                  <div className="result-col">{row.timeB}s</div>
                  <div className="result-col">{row.timeC}s</div>
                </div>
              ),
            )}
          </>
        )}
        <pre style={{ color: '#bbb', fontSize: '0.85em', padding: '1.5em' }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </div>
  );
};
