import { Box, Flex } from '@radix-ui/themes';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignLeftIcon, TextAlignTopIcon } from '@radix-ui/react-icons';
import { QueryDevtoolsPanel } from './QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from './DevScreenSize/DevScreenSize';
import { useToolsKeyPress } from 'hooks/useToolsKeyPress';
import { DevFilterResults } from './DevFilterResults/DevFilterResults';
import { styles } from './DevTools.styles';
import { MockOrdersButton } from './MockOrdersButton/MockOrdersButton';
import { MockTimersMin } from './MockTimersMin/MockTimersMin';
import { MockSessionTimer } from './MockSessionTimer/MockSessionTimer';
import { hasProcessingTimers } from 'utils/timers.utils';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { DevPanelLeft } from 'dev-tools/DevPanels/DevPanelLeft';
import { DevPanelRight } from 'dev-tools/DevPanels/DevPanelRight';

export const DevTools = () => {
  const { orders } = useOrders();
  const {
    isDevToolsVisible,
    // isDevDataVisible,
    // setIsDevDataVisible,
    // isDevScreenSizeVisible,
    isDevQueryPanelOpen,
    setIsDevQueryPanelOpen,
  } = useDev();

  useToolsKeyPress();

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
