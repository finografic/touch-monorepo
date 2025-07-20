import { Box, Flex } from '@radix-ui/themes';
import { styles } from './FrontEndDevToolbar.styles';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignTopIcon } from 'styles/icons';
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

export const FrontEndDevToolbar = () => {
  const location = useLocation();
  const showFilterResults = !['/', '/time'].includes(location.pathname);

  const ordersContext = useOrdersOptional();
  const orders = ordersContext?.orders || [];
  const { isDevToolsVisible, isDevQueryPanelOpen, setIsDevQueryPanelOpen } = useDev();

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
            <button className="btn" onClick={() => setIsDevQueryPanelOpen(!isDevQueryPanelOpen)}>
              <TextAlignTopIcon />
            </button>
          </Box>
        </Flex>
      </div>
    </>
  );
};
