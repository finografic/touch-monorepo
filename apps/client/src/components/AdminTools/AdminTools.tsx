import { Box, Flex } from '@radix-ui/themes';
import { TextAlignLeftIcon, TimerIcon } from '@radix-ui/react-icons';
import { ConfigTimer } from '../ConfigTimer/ConfigTimer';
import { styles } from './AdminTools.styles';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useConfigStorage } from 'hooks/useConfigStorage';

export const AdminTools = () => {
  const { isAdminToolsVisible, isTimerVisible, setIsTimerVisible, isAdminDialogOpen, setIsAdminDialogOpen } =
    useAdmin();
  const { saveConfig } = useConfigStorage();

  if (!isAdminToolsVisible) return null;

  return (
    <div css={styles} className="admin-tools-container">
      <Flex gap="3" align="start">
        {/* Placeholder for future admin buttons */}
        <Box width="64px" height="64px">
          <button className="btn-dialog" onClick={() => setIsAdminDialogOpen(!isAdminDialogOpen)}>
            <TextAlignLeftIcon />
          </button>
        </Box>

        {/* Timer visibility toggle */}
        <Box width="64px" height="64px">
          <button
            className={`btn-admin ${isTimerVisible ? 'active' : ''}`}
            onClick={() => setIsTimerVisible(!isTimerVisible)}
            title="Toggle Timer"
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
