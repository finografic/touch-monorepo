import { DataList } from '@radix-ui/themes';
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
      <DataList.Root className="data-list">
        <DataList.Item>
          <DataList.Label className="label">Status</DataList.Label>
          <DataList.Value className="value">{data.status}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label className="label">Temperature Δ</DataList.Label>
          <DataList.Value className="value">{data.temperatureDelta}°C</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label className="label">Duration</DataList.Label>
          <DataList.Value className="value">
            {data.estimatedDuration.minutes}m {data.estimatedDuration.seconds}s
          </DataList.Value>
        </DataList.Item>
        {data.recommendations?.length > 0 && (
          <DataList.Item>
            <DataList.Label className="label">Recommendations</DataList.Label>
            <DataList.Value className="value">{data.recommendations.join(', ')}</DataList.Value>
          </DataList.Item>
        )}
      </DataList.Root>
    </div>
  );
};
