import { Box, Flex } from '@radix-ui/themes';
import { ConfigTimer } from '../../components/ConfigTimer/ConfigTimer';
import { styles } from './FrontEndAdminToolbar.styles';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { useEffect, useState } from 'react';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'constants/app.config';
import { LanguageIcon, ShieldCheckIcon, TimerIcon, WindowIcon } from 'styles/icons';
import { ALTERNATIVE_PATHS } from 'routes/routes.config';
import { useNavigate } from 'react-router-dom';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';
import { AdminToolsDialog } from 'components/Dialog/dialogs/AdminToolsDialog';

export const FrontEndAdminToolbar = () => {
  const {
    isAdminToolsVisible,
    isTimerVisible,
    setIsTimerVisible,
    isAdminToolsDialogOpen,
    setIsAdminToolsDialogOpen,
    isLanguageDialogOpen,
    setIsLanguageDialogOpen,
  } = useAdmin();

  const { saveConfig } = useConfigStorage();
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
          {/* Admin button - navigate to admin */}
          <Box className="button-box">
            <button className="btn btn-dialog" onClick={() => navigate(ALTERNATIVE_PATHS.admin)}>
              <ShieldCheckIcon />
            </button>
          </Box>

          {/* Language selector */}
          <Box className="button-box">
            <button className="btn" onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}>
              <LanguageIcon />
            </button>
          </Box>

          {/* Admin Tools Dialog */}
          <Box className="button-box">
            <button className="btn" onClick={() => setIsAdminToolsDialogOpen(!isAdminToolsDialogOpen)}>
              <WindowIcon />
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
        </Flex>
      </div>

      {/* Dialogs */}
      <LanguageDialog isOpen={isLanguageDialogOpen} onClose={() => setIsLanguageDialogOpen(false)} />
      <AdminToolsDialog isOpen={isAdminToolsDialogOpen} onClose={() => setIsAdminToolsDialogOpen(false)} />
    </>
  );
};
