import { Box, Flex } from '@radix-ui/themes';
import { styles } from './DevToolbarFrontEnd.styles';
import { useDev } from 'providers/DevProvider/DevContext';
import { LockIcon, TextAlignTopIcon } from 'styles/icons';
import { QueryDevtoolsPanel } from '../QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from '../DevScreenSize/DevScreenSize';
import { useKeyPressFrontEnd } from 'hooks/useKeyPressFrontEnd';
import { MockOrdersButton } from '../MockOrdersButton/MockOrdersButton';
import { MockTimersMin } from '../MockTimersMin/MockTimersMin';
import { MockSessionTimer } from '../MockSessionTimer/MockSessionTimer';
import { hasProcessingTimers } from 'components/Timer/timers.utils';
import { useOrdersOptional } from 'providers/OrdersProvider/OrdersContext';
// import { DevPanelRight } from '../DevPanels/DevPanelRight';
import { AuthStatusDialog } from 'components/Dialog/dialogs/AuthStatusDialog';
import { AuthLoginSimpleDialog } from 'components/Dialog/dialogs/AuthLoginSimpleDialog';
import { DevPanelLeft } from 'dev-tools/DevPanels/DevPanelLeft';

export const DevToolbarFrontEnd = () => {
  const ordersContext = useOrdersOptional();
  const orders = ordersContext?.orders || [];
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
      <div css={styles}>
        <Flex gap="3" align="center">
          {hasProcessingTimers(orders) && (
            <Box className="button-box">
              <MockTimersMin />
            </Box>
          )}

          <Box className="button-box">
            <MockSessionTimer />
          </Box>

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

      <AuthStatusDialog isOpen={isDevAuthVisible} onClose={() => setIsDevAuthVisible(false)} />
      <AuthLoginSimpleDialog
        isOpen={isDevSimpleLoginVisible}
        onClose={() => setIsDevSimpleLoginVisible(false)}
      />
      {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
    </>
  );
};
