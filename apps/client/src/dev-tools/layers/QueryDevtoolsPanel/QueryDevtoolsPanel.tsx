import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';

import { styles } from './QueryDevtoolsPanel.styles';

export const QueryDevtoolsPanel = ({ onClose }: { onClose: () => void }) => {
  return (
    <div css={styles}>
      <ReactQueryDevtoolsPanel onClose={onClose} />
    </div>
  );
};
