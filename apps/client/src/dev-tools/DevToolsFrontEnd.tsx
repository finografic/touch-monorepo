import { Box, Flex } from '@radix-ui/themes';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignTopIcon } from '@radix-ui/react-icons';
import { QueryDevtoolsPanel } from './QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from './DevScreenSize/DevScreenSize';
import { useKeyPressFrontEnd } from 'hooks/useKeyPressFrontEnd';
import { DevFilterResults } from './DevFilterResults/DevFilterResults';
import { styles } from './DevTools.styles';
import { MockOrdersButton } from './MockOrdersButton/MockOrdersButton';
import { MockTimersMin } from './MockTimersMin/MockTimersMin';
import { MockSessionTimer } from './MockSessionTimer/MockSessionTimer';
import { hasProcessingTimers } from 'components/Timer/timers.utils';
import { useOrdersOptional } from 'providers/OrdersProvider/OrdersContext';
// import { DevPanelLeft } from 'dev-tools/DevPanels/DevPanelLeft';
import { DevPanelRight } from 'dev-tools/DevPanels/DevPanelRight';

export const DevToolsFrontEnd = () => {
  const ordersContext = useOrdersOptional();
  const orders = ordersContext?.orders || [];
  const {
    isDevToolsVisible,
    // isDevDataVisible,
    // setIsDevDataVisible,
    // isDevScreenSizeVisible,
    isDevQueryPanelOpen,
    setIsDevQueryPanelOpen,
  } = useDev();

  useKeyPressFrontEnd();

  if (!isDevToolsVisible) return null;

  return (
    <>
      <>
        <DevScreenSize />
        {isDevToolsVisible && <DevFilterResults />}
        {/* {isDevToolsVisible && <DevPanelLeft />} */}
        {isDevToolsVisible && <DevPanelRight />}
        {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
      </>
      <div css={styles} className="devtools-container">
        <Flex gap="3" justify="end">
          {hasProcessingTimers(orders) && (
            <Box width="64px" height="64px">
              <MockTimersMin />
            </Box>
          )}

          <Box width="64px" height="64px">
            <MockSessionTimer />
          </Box>

          <Box width="64px" height="64px">
            <MockOrdersButton />
          </Box>

          <Box width="64px" height="64px">
            <button className="btn-query" onClick={() => setIsDevQueryPanelOpen(!isDevQueryPanelOpen)}>
              <TextAlignTopIcon />
            </button>
          </Box>
        </Flex>
      </div>
    </>
  );
};
