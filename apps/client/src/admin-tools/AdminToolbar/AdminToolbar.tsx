import { Box, Flex } from '@radix-ui/themes';
import { ConfigTimer } from '../../components/ConfigTimer/ConfigTimer';
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
    isTimerVisible,
    setIsTimerVisible,
    isLanguageDialogOpen,
    setIsLanguageDialogOpen,
  } = useAdmin();

  const [hasActiveTimer, setHasActiveTimer] = useState(false);
  const navigate = useNavigate();

  useEffect(function checkActiveTimer() {
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
  }, []);

  if (!isAdminToolsVisible) return null;

  return (
    <>
      <div css={styles}>
        <Flex gap="3" align="center">
          {/* Home button - navigate to frontend */}
          <Box className="button-box">
            <button className="btn btn-dialog" onClick={() => navigate(PATHS.main)}>
              <HomeIcon />
            </button>
          </Box>

          {/* Language selector */}
          <Box className="button-box">
            <button className="btn" onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}>
              <LanguageIcon />
            </button>
          </Box>

          {/* Timer visibility toggle - only show if there's an active timer */}
          {hasActiveTimer && (
            <Box className="button-box">
              <button
                className={`btn btn-admin ${isTimerVisible ? 'active' : ''}`}
                onClick={() => setIsTimerVisible(!isTimerVisible)}
                title="Toggle Timer"
              >
                <TimerIcon />
              </button>
            </Box>
          )}

          {/* Config expiry timer */}
          {isTimerVisible && hasActiveTimer && (
            <Box className="timer-container">
              <ConfigTimer />
            </Box>
          )}

          {/* Panic button - stop all audio */}
          <Box className="button-box">
            <button className="btn btn-panic" onClick={stopAllAudio} title="Stop All Audio (Panic)">
              <StopIcon color="orange" />
            </button>
          </Box>
        </Flex>
      </div>

      {/* Language Dialog */}
      <LanguageDialog isOpen={isLanguageDialogOpen} onClose={() => setIsLanguageDialogOpen(false)} />
    </>
  );
};
