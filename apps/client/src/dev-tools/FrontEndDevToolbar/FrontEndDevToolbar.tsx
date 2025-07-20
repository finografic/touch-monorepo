import { Box, Flex } from '@radix-ui/themes';
import { styles } from './FrontEndDevToolbar.styles';
import { useDev } from 'providers/DevProvider/DevContext';
import { LockIcon, TextAlignTopIcon } from 'styles/icons';
import { QueryDevtoolsPanel } from '../QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from '../DevScreenSize/DevScreenSize';
import { useKeyPressFrontEnd } from 'hooks/useKeyPressFrontEnd';
import { DevFilterResults } from '../DevFilterResults/DevFilterResults';
import { MockOrdersButton } from '../MockOrdersButton/MockOrdersButton';
import { MockTimersMin } from '../MockTimersMin/MockTimersMin';
import { MockSessionTimer } from '../MockSessionTimer/MockSessionTimer';
import { hasProcessingTimers } from 'components/Timer/timers.utils';
import { useOrdersOptional } from 'providers/OrdersProvider/OrdersContext';
import { DevPanelRight } from '../DevPanels/DevPanelRight';
import { useLocation } from 'react-router-dom';
import { AuthStatusDialog } from 'components/Dialog/dialogs/AuthStatusDialog';

export const FrontEndDevToolbar = () => {
  const location = useLocation();
  const showFilterResults = !['/', '/time'].includes(location.pathname);

  const ordersContext = useOrdersOptional();
  const orders = ordersContext?.orders || [];
  const {
    isDevToolsVisible,
    isDevAuthVisible,
    isDevQueryPanelOpen,
    setIsDevAuthVisible,
    setIsDevQueryPanelOpen,
  } = useDev();

  useKeyPressFrontEnd();

  if (!isDevToolsVisible) return null;

  return (
    <>
      <>
        <DevScreenSize />
        {isDevToolsVisible && (showFilterResults ? <DevFilterResults /> : <DevFilterResults />)}
        {isDevToolsVisible && <DevPanelRight />}
        {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
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
        </Flex>
      </div>
      <AuthStatusDialog isOpen={isDevAuthVisible} onClose={() => setIsDevAuthVisible(false)} />
    </>
  );
};
