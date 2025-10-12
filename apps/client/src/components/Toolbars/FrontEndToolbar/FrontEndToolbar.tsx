import React from 'react';
import { Box, Flex } from '@radix-ui/themes';
import { ConfigTimer } from '../../ConfigTimer/ConfigTimer';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { DialogIcon, TimerIcon } from 'styles/icons';
import { useNavigate } from 'react-router-dom';
import { LanguageDialog } from 'components/Dialog/dialogs/LanguageDialog';
import { MockSessionTimer } from 'dev-tools/mocks/MockSessionTimer/MockSessionTimer';
import { useDev } from 'dev-tools/providers/DevProvider';
// import { AdminToolsDialog } from 'components/Dialog/dialogs/AdminToolsDialog';
import { useStorageTimer } from 'providers/TimersProvider';
import type { Theme } from 'types/ui.types';
import { useAppConfig } from 'providers/AppConfigProvider';
import { styles } from './FrontEndToolbar.styles';

export const FrontEndToolbar: React.FC = () => {
  const { theme } = useAppConfig();
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
      <div css={styles} className={`theme-${theme}`}>
        <Flex gap="3" align="center">
          {/* Language selector */}
          <div className="button-box">
            <button className="button" onClick={() => setIsAdminToolsDialogOpen(!isAdminToolsDialogOpen)}>
              <DialogIcon />
            </button>
          </div>

          {/* Tools Dialog  */}
          {/* <div className="button-box">
            <button className="button" onClick={() => setIsAdminToolsDialogOpen(!isAdminToolsDialogOpen)}>
              <WindowIcon />
            </button>
          </div> */}

          {hasActiveTimer && isDevToolsVisible && (
            <div className="button-box">
              <MockSessionTimer />
            </div>
          )}

          {/* Timer visibility toggle - only show if there's an active timer */}
          {hasActiveTimer && (
            <div className="button-box">
              <button
                className={`button button-admin ${isStorageTimerVisible ? 'active' : ''}`}
                onClick={() => setIsStorageTimerVisible(!isStorageTimerVisible)}
                title="Toggle Timer"
              >
                <TimerIcon />
              </button>
            </div>
          )}

          {/* Config expiry timer */}
          {isStorageTimerVisible && hasActiveTimer && (
            <Box className="timer-container">
              <ConfigTimer />
            </Box>
          )}
        </Flex>

        {/* Language Dialog */}
        {isLanguageDialogOpen && (
          <LanguageDialog isOpen={isLanguageDialogOpen} onClose={() => setIsLanguageDialogOpen(false)} />
        )}
      </div>
    </>
  );
};
