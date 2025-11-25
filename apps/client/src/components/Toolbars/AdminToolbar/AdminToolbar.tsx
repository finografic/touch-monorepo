import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex } from '@radix-ui/themes';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';

import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useTimers } from 'providers/TimersProvider';

import { stopAllAudio } from 'utils/soundCache.utils';
import type { Theme } from 'types/ui.types';
import { PATHS } from 'config';
import { RecallTimer } from '../../Timers/RecallTimer';
import { HomeIcon, StopIcon, TimerIcon } from 'styles/icons';
import { styles } from './AdminToolbar.styles';

export const AdminToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const { isAdminToolsVisible, isLanguageDialogOpen, setIsLanguageDialogOpen } = useAdmin();

  // Check if recall config is active (exists and not expired)
  const { recall, isRecallExpired } = useTimers();
  const hasActiveTimer = recall.config !== null && !isRecallExpired();
  const navigate = useNavigate();

  if (!isAdminToolsVisible) return null;

  return (
    <>
      <div css={styles} className={`theme-${theme}`}>
        <Flex gap="3" align="center">
          {/* Timer visibility toggle - only show if there's an active timer */}
          {/* {hasActiveTimer && (
            <div className="button-box">
              <button
                className={`button button-admin ${isStorageTimerVisible ? 'active' : ''}`}
                onClick={() => setIsStorageTimerVisible(!isStorageTimerVisible)}
                title="Toggle Timer"
              >
                <TimerIcon />
              </button>
            </div>
          )} */}

          {/* Config expiry timer */}
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
