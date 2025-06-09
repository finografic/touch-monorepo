import { Box, Flex } from '@radix-ui/themes';
import { useState } from 'react';
import { TimerIcon } from '@radix-ui/react-icons';
import { ConfigTimer } from '../ConfigTimer/ConfigTimer';
import { styles } from './AdminTools.styles';
import type { AdminKeys } from 'providers/AdminProvider/AdminContext';
import { AdminContext } from 'providers/AdminProvider/AdminContext';
import { useToolsKeyPress } from 'hooks/useToolsKeyPress';

interface AdminState {
  [AdminKeys.isAdminToolsVisible]: boolean;
  [AdminKeys.isTimerVisible]: boolean;
}

export const AdminTools = () => {
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const store = AdminContext.useContext();
  const isAdminToolsVisible = store?.getState() ? (store.getState() as AdminState).isAdminToolsVisible : true;

  // Initialize keyboard shortcuts
  useToolsKeyPress();

  if (!isAdminToolsVisible) return null;

  return (
    <div css={styles} className="admin-tools-container">
      <Flex gap="3" align="center">
        {/* Placeholder for future admin buttons */}
        <Box width="48px" height="48px">
          <button className="btn-admin btn-placeholder" disabled>
            {/* Placeholder */}
          </button>
        </Box>

        {/* Timer visibility toggle */}
        <Box width="48px" height="48px">
          <button
            className={`btn-admin ${isTimerVisible ? 'active' : ''}`}
            onClick={() => setIsTimerVisible(!isTimerVisible)}
          >
            <TimerIcon />
          </button>
        </Box>

        {/* Config expiry timer */}
        {isTimerVisible && (
          <Box className="timer-container">
            <ConfigTimer />
          </Box>
        )}
      </Flex>
    </div>
  );
};
