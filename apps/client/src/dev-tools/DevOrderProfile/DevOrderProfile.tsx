import { useFilters } from 'hooks/useFilters';
import { styles } from './DevOrderProfile.styles';
import { useOrders } from 'providers/OrdersProvider';

/*
onst { dataFiltered, filters } = useFilters({});
point
const profile: {
    id: string;
    volume: string;
    modeId: string;
    drinkType: string;
    drinkSubtype: string | null;
    containerType: string;
    temperatureProfile: string;
    defaultTempConsume: number;
    defaultTempFreeze: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    temperatureProfiles?: TemperatureProfile[];
} | null
 */

export const DevOrderProfile = () => {
  const { profile } = useOrders();
  const { filters } = useFilters({});

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
              <div className="result-col">CONSUME</div>
              <div className="result-col">FREEZE</div>
              <div className="result-col">CONTAINER</div>
              <div className="result-col">ID</div>
            </div>
            <div className="result-row">
              <div className="result-col">
                <strong>{profile.drinkType}</strong>
              </div>
              <div className="result-col">{profile.defaultTempConsume}</div>
              <div className="result-col">{profile.defaultTempFreeze}</div>
              <div className="result-col">{profile.containerType}</div>
              <div className="result-col">
                <span style={{ opacity: 0.33 }}>{profile.id}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
