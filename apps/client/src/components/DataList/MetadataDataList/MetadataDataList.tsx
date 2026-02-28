import { styles } from './MetadataDataList.styles';

interface Metadata {
  orderId: string;
  timestamp: string;
  status: string;
  completionTime?: string;
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
      <dl className="data-list">
        <div>
          <dt className="label">Order ID</dt>
          <dd className="value">{data.orderId}</dd>
        </div>
        <div>
          <dt className="label">Timestamp</dt>
          <dd className="value">{data.timestamp}</dd>
        </div>
        <div>
          <dt className="label">Status</dt>
          <dd className="value">{data.status}</dd>
        </div>
        {data.completionTime && (
          <div>
            <dt className="label">Estimated Completion</dt>
            <dd className="value">{data.completionTime}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};
