import React, { useEffect, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import { ConfigTimer } from '../../ConfigTimer/ConfigTimer';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { HomeIcon, StopIcon, TimerIcon } from 'styles/icons';
import { PATHS } from 'config';
import { useNavigate } from 'react-router-dom';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';
import { stopAllAudio } from 'utils/soundCache.utils';
import { styles } from './AdminToolbar.styles';
import type { Theme } from 'types/ui.types';
import { useAppConfig } from 'providers/AppConfigProvider';

export const AdminToolbar: React.FC = () => {
  const { theme } = useAppConfig();
  const {
    isAdminToolsVisible,
    isStorageTimerVisible,
    setIsStorageTimerVisible,
    isLanguageDialogOpen,
    setIsLanguageDialogOpen,
  } = useAdmin();

  const [hasActiveTimer, setHasActiveTimer] = useState(false);
  const navigate = useNavigate();

  useEffect(function checkActiveStorageTimer() {
    log('ADMIN_INIT', 'orange', { isAdminToolsVisible, isStorageTimerVisible, isLanguageDialogOpen });
  }, []);

  if (!isAdminToolsVisible) return null;

  return (
    <>
      <div css={styles} className={`theme-${theme}`}>
        <Flex gap="3" align="center">
          {/* Home button - navigate to frontend */}
          <div className="button-box">
            <button className="btn btn-dialog" onClick={() => navigate(PATHS.main)}>
              <HomeIcon />
            </button>
          </div>

          {/* Timer visibility toggle - only show if there's an active timer */}
          {hasActiveTimer && (
            <div className="button-box">
              <button
                className={`btn btn-admin ${isStorageTimerVisible ? 'active' : ''}`}
                onClick={() => setIsStorageTimerVisible(!isStorageTimerVisible)}
                title="Toggle Timer"
              >
                <TimerIcon />
              </button>
            </div>
          )}

          {/* Config expiry timer */}
          {isStorageTimerVisible && hasActiveTimer && (
            <div className="timer-container">
              <ConfigTimer />
            </div>
          )}

          {/* Panic button - stop all audio */}
          <div className="button-box">
            <button className="btn btn-panic" onClick={stopAllAudio} title="Stop All Audio (Panic)">
              <StopIcon color="orange" />
            </button>
          </div>
        </Flex>
      </div>

      {isLanguageDialogOpen && (
        <LanguageDialog isOpen={isLanguageDialogOpen} onClose={() => setIsLanguageDialogOpen(false)} />
      )}
    </>
  );
};
