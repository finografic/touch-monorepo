import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@finografic/design-system/components';

import { PATHS } from 'config/routes/paths.constants';

import { styles } from './UnauthorizedPage.styles';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div css={styles.container}>
      <div css={styles.content}>
        <h1 css={styles.title}>Access Denied</h1>
        <p css={styles.message}>
          You don't have permission to access this area. This section requires administrator privileges.
        </p>
        <div css={styles.actions}>
          <Button variant="solid" palette="primary" onClick={() => navigate(PATHS.main)} css={styles.button}>
            Go to Home
          </Button>
          <Button variant="solid" palette="primary" onClick={() => navigate('/login')} css={styles.button}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};
