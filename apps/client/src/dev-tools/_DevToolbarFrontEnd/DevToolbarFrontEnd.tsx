import { Box, Flex } from '@radix-ui/themes';
import { styles } from './DevToolbarFrontEnd.styles';
import { useDev } from 'dev-tools/providers/DevProvider/DevContext';
import { LockIcon, TextAlignTopIcon } from 'styles/icons';
import { QueryDevtoolsPanel } from '../layers/QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from '../components/DevScreenSize/DevScreenSize';
import { useKeyPressFrontEnd } from 'hooks/useKeyPressFrontEnd';
import { MockOrdersButton } from '../mocks/MockOrdersButton/MockOrdersButton';
import { MockTimersMin } from '../mocks/MockTimersMin/MockTimersMin';
import { MockSessionTimer } from '../mocks/MockSessionTimer/MockSessionTimer';
import { useOrdersOptional } from 'providers/OrdersProvider/OrdersContext';
import { useTimers } from 'providers/TimersProvider';
// import { DevPanelRight } from '../DevPanels/DevPanelRight';
import { AuthStatusDialog } from 'components/Dialog/dialogs/AuthStatusDialog';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog';
import { DevPanelLeft } from 'dev-tools/_Panels/DevPanelLeft';

export const DevToolbarFrontEnd = () => {
  const { timers } = useTimers();
  const {
    isDevToolsVisible,
    isDevAuthVisible,
    isDevSimpleLoginVisible,
    isDevQueryPanelOpen,
    setIsDevAuthVisible,
    setIsDevSimpleLoginVisible,
    setIsDevQueryPanelOpen,
  } = useDev();

  useKeyPressFrontEnd();

  if (!isDevToolsVisible) return null;

  return (
    <>
      <>
        {/* <DevScreenSize /> */}
        {isDevToolsVisible && <DevPanelLeft />}
        {/* {isDevToolsVisible && <DevPanelRight />} */}
      </>
      <div id="__DEV__" css={styles}>
        <Flex gap="3" align="center">
          {timers.some((timer) => timer.status === 'processing') && (
            <Box className="button-box">
              <MockTimersMin />
            </Box>
          )}

          <Box className="button-box">
            <MockOrdersButton />
          </Box>

          <Box className="button-box">
            <button
              className="btn btn-toggle-query-panel"
              onClick={() => setIsDevQueryPanelOpen(!isDevQueryPanelOpen)}
            >
              <TextAlignTopIcon />
            </button>
          </Box>

          <Box className="button-box">
            <button className="btn btn-toggle-auth" onClick={() => setIsDevAuthVisible(!isDevAuthVisible)}>
              <LockIcon />
            </button>
          </Box>

          <Box className="button-box">
            <button
              className="btn btn-toggle-simple-login"
              onClick={() => setIsDevSimpleLoginVisible(!isDevSimpleLoginVisible)}
            >
              <LockIcon />
            </button>
          </Box>
        </Flex>
      </div>

      {/* <AuthStatusDialog isOpen={isDevAuthVisible} onClose={() => setIsDevAuthVisible(false)} />
      <AuthLoginSimpleDialog
        isOpen={isDevSimpleLoginVisible}
        onClose={() => setIsDevSimpleLoginVisible(false)}
      /> */}
      {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
    </>
  );
};
