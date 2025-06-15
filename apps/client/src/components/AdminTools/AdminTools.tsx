import { Box, Flex } from '@radix-ui/themes';
import { TextAlignLeftIcon, TimerIcon } from '@radix-ui/react-icons';
import { ConfigTimer } from '../ConfigTimer/ConfigTimer';
import { styles } from './AdminTools.styles';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { useEffect, useState } from 'react';
import { CONFIG_EXPIRY_TIME_MS, STORAGE_KEYS } from 'constants/app.config';

export const AdminTools = () => {
  const { isAdminToolsVisible, isTimerVisible, setIsTimerVisible, isAdminDialogOpen, setIsAdminDialogOpen } =
    useAdmin();
  const { saveConfig } = useConfigStorage();
  const [hasActiveTimer, setHasActiveTimer] = useState(false);

  // Check if there's an active config timer
  useEffect(() => {
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
    <div css={styles} className="admin-tools-container">
      <Flex gap="3" align="start">
        {/* Placeholder for future admin buttons */}
        <Box width="64px">
          <button className="btn-dialog" onClick={() => setIsAdminDialogOpen(!isAdminDialogOpen)}>
            <TextAlignLeftIcon />
          </button>
        </Box>

        {/* Timer visibility toggle - only show if there's an active timer */}
        {hasActiveTimer && (
          <Box width="64px">
            <button
              className={`btn-admin ${isTimerVisible ? 'active' : ''}`}
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
  );
};
