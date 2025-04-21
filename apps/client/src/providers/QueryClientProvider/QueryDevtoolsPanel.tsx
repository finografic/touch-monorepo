import React from 'react';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TableIcon } from '@radix-ui/react-icons';
import { styles } from './QueryDevtoolsPanel.styles';

export const QueryDevtoolsPanel = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div css={styles}>
      <button id="toggle-query-devtools" onClick={() => setIsOpen(!isOpen)}>
        <TableIcon />
      </button>
      {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
    </div>
  );
};
