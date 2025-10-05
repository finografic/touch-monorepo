import { Box, Flex } from '@radix-ui/themes';
import { ConfigTimer } from '../../components/ConfigTimer/ConfigTimer';
import { styles } from './FrontEndAdminToolbar.styles';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { DialogIcon, LanguageIcon, ShieldCheckIcon, TimerIcon } from 'styles/icons';
import { ADMIN_PATHS, ALTERNATIVE_PATHS } from 'config';
import { useNavigate } from 'react-router-dom';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';
import { MockSessionTimer } from 'dev-tools/mocks/MockSessionTimer/MockSessionTimer';
import { useDev } from 'dev-tools/providers/DevProvider';
import { AdminToolsDialog } from 'components/Dialog/dialogs/AdminToolsDialog';
import { useStorageTimer } from 'providers/TimersProvider';

export const FrontEndAdminToolbar = () => {
  const { isDevToolsVisible } = useDev();
  const {
    isAdminToolsVisible,
    isStorageTimerVisible,
    setIsStorageTimerVisible,
    isAdminToolsDialogOpen,
    setIsAdminToolsDialogOpen,
    isLanguageDialogOpen,
    setIsLanguageDialogOpen,
  } = useAdmin();

  // 🎯 NEW: Use the centralized storage timer hook
  const { hasActiveTimer } = useStorageTimer();
  const navigate = useNavigate();

  if (!isAdminToolsVisible) return null;

  return (
    <>
      <div css={styles}>
        <Flex gap="3" align="center">
          {/* Admin button - navigate to admin */}
          <Box className="button-box">
            <button className="btn btn-dialog" onClick={() => navigate(ADMIN_PATHS.DASHBOARD)}>
              <ShieldCheckIcon />
            </button>
          </Box>

          {/* Language selector */}
          <Box className="button-box">
            <button className="btn" onClick={() => setIsLanguageDialogOpen(!isLanguageDialogOpen)}>
              <LanguageIcon />
            </button>
          </Box>

          {/* Language selector */}
          <Box className="button-box">
            <button className="btn" onClick={() => setIsAdminToolsDialogOpen(!isAdminToolsDialogOpen)}>
              <DialogIcon />
            </button>
          </Box>

          {/* Admin Tools Dialog */}
          {/* <Box className="button-box">
            <button className="btn" onClick={() => setIsAdminToolsDialogOpen(!isAdminToolsDialogOpen)}>
              <WindowIcon />
            </button>
          </Box> */}

          {hasActiveTimer && isDevToolsVisible && (
            <Box className="button-box">
              <MockSessionTimer />
            </Box>
          )}

          {/* Timer visibility toggle - only show if there's an active timer */}
          {hasActiveTimer && (
            <Box className="button-box">
              <button
                className={`btn btn-admin ${isStorageTimerVisible ? 'active' : ''}`}
                onClick={() => setIsStorageTimerVisible(!isStorageTimerVisible)}
                title="Toggle Timer"
              >
                <TimerIcon />
              </button>
            </Box>
          )}

          {/* Config expiry timer */}
          {isStorageTimerVisible && hasActiveTimer && (
            <Box className="timer-container">
              <ConfigTimer />
            </Box>
          )}
        </Flex>

        {/* {isAdminToolsDialogOpen && (
          <AdminToolsDialog
            isOpen={isAdminToolsDialogOpen}
            onClose={() => setIsAdminToolsDialogOpen(false)}
          />
        )} */}
        {/* Language Dialog */}
        {isLanguageDialogOpen && (
          <LanguageDialog isOpen={isLanguageDialogOpen} onClose={() => setIsLanguageDialogOpen(false)} />
        )}
      </div>
    </>
  );
};
