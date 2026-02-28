import React from 'react';

import { callout } from 'styled-system/recipes';

import { ExclamationTriangleIcon } from 'styles/icons';
import { styles } from './NoItems.styles';

interface NoItemsProps {
  message: string;
}

export const NoItems: React.FC<NoItemsProps> = ({ message }) => {
  return (
    <div css={styles} className="no-items">
      <div className={callout({ status: 'warning' })} role="alert" style={{ color: 'var(--yellow-10)' }}>
        <ExclamationTriangleIcon style={{ color: 'var(--yellow-10)' }} />
        <span>{message}</span>
      </div>
    </div>
  );
};
