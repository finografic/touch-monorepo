import React from 'react';

import { Box, Flex } from 'styled-system/jsx';
import clsx from 'clsx';
import { RecallTimer } from 'components/Timers/RecallTimer';

import { useRecallConfig } from 'hooks/useRecallConfig';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useAppConfig } from 'providers/AppConfigProvider';

import type { Theme } from 'types/ui.types';
import { MockSessionTimer } from 'dev-tools/mocks/MockSessionTimer/MockSessionTimer';
import { useDev } from 'dev-tools/providers/DevProvider';
import { styles } from './FrontEndToolbar.styles';

export const FrontEndToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const { isDevToolsVisible } = useDev();
  const { isAdminToolsVisible } = useAdmin();

  // Check if recall config is active (exists and not expired)
  const { recallConfig, isRecallExpired } = useRecallConfig();
  const hasActiveTimer = recallConfig !== null && !isRecallExpired;

  if (!isAdminToolsVisible) return null;

  return (
    <div css={styles} className={clsx('toolbar', 'toolbar-front-end', `theme-${theme}`)}>
      <Flex gap={3} align="center">
        {hasActiveTimer && isDevToolsVisible && (
          <div className="button-box">
            <MockSessionTimer />
          </div>
        )}

        {hasActiveTimer && (
          <Box className="timer-container">
            <RecallTimer />
          </Box>
        )}
      </Flex>
    </div>
  );
};
