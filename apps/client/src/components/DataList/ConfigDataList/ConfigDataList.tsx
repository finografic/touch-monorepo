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
    <dl css={styles} className="data-list">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <dt className="label">{key}</dt>
          <dd className="value">{renderValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
};
