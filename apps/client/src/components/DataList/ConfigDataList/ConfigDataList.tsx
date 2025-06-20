import { DataList } from '@radix-ui/themes';
import { styles } from './ConfigDataList.styles';

interface ConfigDataListProps {
  data: any;
}

export const ConfigDataList = ({ data }: ConfigDataListProps) => {
  if (!data) return null;

  const renderValue = (value: any): string => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <DataList.Root css={styles} className="data-list">
      {Object.entries(data).map(([key, value]) => (
        <DataList.Item key={key}>
          <DataList.Label className="label">{key}</DataList.Label>
          <DataList.Value className="value">{renderValue(value)}</DataList.Value>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
};
