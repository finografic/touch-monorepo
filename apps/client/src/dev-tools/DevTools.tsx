import { Box, Flex } from '@radix-ui/themes';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignLeftIcon, TextAlignTopIcon } from '@radix-ui/react-icons';
import { QueryDevtoolsPanel } from './QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from './DevScreenSize/DevScreenSize';
import { useKeyPress } from './useKeyPress';
import { DevFilterResults } from './DevFilterResults/DevFilterResults';
import { DevPanels } from './DevPanels/DevPanels';
import { styles } from './DevTools.styles';
import { MockOrdersButton } from './MockOrdersButton/MockOrdersButton';
import { MockTimersMin } from './MockTimersMin/MockTimersMin';
import { hasProcessingTimers } from 'utils/timers.utils';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';

export const DevTools = () => {
  const { orders } = useOrders();
  const {
    isDevToolsVisible,
    isDevDataVisible,
    setIsDevDataVisible,
    isDevQueryPanelOpen,
    setIsDevQueryPanelOpen,
  } = useDev();

  useKeyPress();

  if (!isDevToolsVisible) return null;

  return (
    <>
      <>
        {isDevDataVisible && <DevFilterResults />}
        {isDevDataVisible && <DevPanels />}
        {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
        <DevScreenSize />
      </>
      <div css={styles} className="devtools-container">
        <Flex gap="3" justify="end">
          {hasProcessingTimers(orders) && (
            <Box width="64px" height="64px">
              <MockTimersMin />
            </Box>
          )}

          <Box width="64px" height="64px">
            <MockOrdersButton />
          </Box>

          <Box width="64px" height="64px">
            <button className="btn-dev" onClick={() => setIsDevDataVisible(!isDevDataVisible)}>
              <TextAlignLeftIcon />
            </button>
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
