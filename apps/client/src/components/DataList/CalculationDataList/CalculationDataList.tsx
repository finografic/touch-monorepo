import { styles } from './CalculationDataList.styles';

interface Calculation {
  status: 'cooling' | 'heating';
  temperatureDelta: number;
  estimatedDuration: {
    minutes: number;
    seconds: number;
  };
  recommendations: string[];
}

export const CalculationDataList = ({ data }: { data: Calculation | null }) => {
  if (!data) {
    return (
      <div css={styles} className="data-list-empty">
        No calculation data available
      </div>
    );
  }
  return (
    <div css={styles} className="data-list-wrapper">
      <dl className="data-list">
        <div>
          <dt className="label">Status</dt>
          <dd className="value">{data.status}</dd>
        </div>
        <div>
          <dt className="label">Temperature Δ</dt>
          <dd className="value">{data.temperatureDelta}°C</dd>
        </div>
        <div>
          <dt className="label">Duration</dt>
          <dd className="value">
            {data.estimatedDuration.minutes}m {data.estimatedDuration.seconds}s
          </dd>
        </div>
        {data.recommendations?.length > 0 && (
          <div>
            <dt className="label">Recommendations</dt>
            <dd className="value">{data.recommendations.join(', ')}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};
