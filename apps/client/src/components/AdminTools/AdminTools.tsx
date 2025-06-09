import { Box, Flex } from '@radix-ui/themes';
import { TimerIcon } from '@radix-ui/react-icons';
import { ConfigTimer } from '../ConfigTimer/ConfigTimer';
import { styles } from './AdminTools.styles';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
// import { useToolsKeyPress } from 'hooks/useToolsKeyPress';

export const AdminTools = () => {
  const { isAdminToolsVisible, isTimerVisible, setIsTimerVisible } = useAdmin();

  // Initialize keyboard shortcuts
  // useToolsKeyPress();

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
