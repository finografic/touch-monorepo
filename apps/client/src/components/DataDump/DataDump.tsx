import { styles } from './DataDump.styles';

export const DataDump = ({ data, color }: { data: any; color: 'blue' | 'amber' | 'gray' | 'orange' }) => {
  if (!data) {
    return (
      <div css={styles} className="json-view-empty">
        No data available
      </div>
    );
  }

  return (
    <pre css={styles} className="json-view" data-color={color}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};
