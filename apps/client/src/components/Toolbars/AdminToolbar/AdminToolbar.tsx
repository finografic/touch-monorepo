import { Box, Flex } from '@radix-ui/themes';
import { ConfigTimer } from '../../ConfigTimer/ConfigTimer';
import { styles } from './AdminToolbar.styles';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useEffect, useState } from 'react';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'config/app';
import { HomeIcon, LanguageIcon, StopIcon, TimerIcon } from 'styles/icons';
import { PATHS } from 'config';
import { useNavigate } from 'react-router-dom';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';
import { stopAllAudio } from 'utils/soundCache.utils';

export const AdminToolbar = () => {
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
    /*
    const checkActiveTimer = () => {
      const timestamp = sessionStorage.getItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
      if (!timestamp) {
        setHasActiveTimer(false);
        return;
      }

      const startTime = Number.parseInt(timestamp, 10);
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, CONFIG_EXPIRY_TIME_MS - elapsed);

      setHasActiveTimer(remaining > 0);
    };

    // Initial check
    checkActiveTimer();

    // Update every 5 seconds
    const intervalId = setInterval(checkActiveTimer, 5000);

    return () => clearInterval(intervalId);
    */
  }, []);

  if (!isAdminToolsVisible) return null;

  return (
    <>
      <div css={styles}>
        <Flex gap="3" align="center">
          {/* Home button - navigate to frontend */}
          <div className="button-box">
            <button className="btn btn-dialog" onClick={() => navigate(PATHS.main)}>
              <HomeIcon />
            </button>
          </div>

          {/* Language selector */}
          <div className="button-box">
            <button className="btn" onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}>
              <LanguageIcon />
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
