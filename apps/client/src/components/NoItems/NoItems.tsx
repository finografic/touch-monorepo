import React from 'react';
import { Callout } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { styles } from './NoItems.styles';

interface NoItemsProps {
  message: string;
}

export const NoItems: React.FC<NoItemsProps> = ({ message }) => {
  return (
    <div css={styles} className="no-items">
      <Callout.Root variant="surface" color="amber" size="2">
        <Callout.Icon>
          <ExclamationTriangleIcon style={{ color: 'var(--yellow-10)' }} />
        </Callout.Icon>
        <Callout.Text highContrast style={{ color: 'var(--yellow-10)' }}>
          {message}
        </Callout.Text>
      </Callout.Root>
    </div>
  );
};
