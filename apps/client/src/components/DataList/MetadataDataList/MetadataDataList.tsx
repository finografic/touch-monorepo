import { DataList } from '@radix-ui/themes';

import { styles } from './MetadataDataList.styles';

interface Metadata {
  orderId: string;
  timestamp: string;
  status: string;
  estimatedCompletionTime?: string;
}

export const MetadataDataList = ({ data }: { data: Metadata | undefined }) => {
  if (!data) {
    return (
      <div css={styles} className="data-list-empty">
        No metadata available
      </div>
    );
  }
  return (
    <div css={styles} className="data-list-wrapper">
      <DataList.Root className="data-list">
        <DataList.Item>
          <DataList.Label className="label">Order ID</DataList.Label>
          <DataList.Value className="value">{data.orderId}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label className="label">Timestamp</DataList.Label>
          <DataList.Value className="value">{data.timestamp}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label className="label">Status</DataList.Label>
          <DataList.Value className="value">{data.status}</DataList.Value>
        </DataList.Item>
        {data.estimatedCompletionTime && (
          <DataList.Item>
            <DataList.Label className="label">Estimated Completion</DataList.Label>
            <DataList.Value className="value">{data.estimatedCompletionTime}</DataList.Value>
          </DataList.Item>
        )}
      </DataList.Root>
    </div>
  );
};
