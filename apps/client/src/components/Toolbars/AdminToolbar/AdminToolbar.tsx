import React from 'react';

import { Flex } from '@radix-ui/themes';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';

import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useRecallConfig } from 'hooks/useRecallConfig';

import type { Theme } from 'types/ui.types';
import { RecallTimer } from 'components/Timers/RecallTimer';
import { styles } from './AdminToolbar.styles';

export const AdminToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const { isAdminToolsVisible, isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  const { recallConfig, isRecallExpired } = useRecallConfig();
  const hasActiveTimer = recallConfig !== null && !isRecallExpired;

  if (!isAdminToolsVisible) return null;

  return (
    <>
      <div css={styles} className={`theme-${theme}`}>
        <Flex gap="3" align="center">
          {hasActiveTimer && (
            <div className="timer-container">
              <RecallTimer />
            </div>
          )}
        </Flex>
      </div>
      {isLanguageDialogOpen && (
        <LanguageDialog isOpen={isLanguageDialogOpen} onClose={() => setIsLanguageDialogOpen(false)} />
      )}
    </>
  );
};
