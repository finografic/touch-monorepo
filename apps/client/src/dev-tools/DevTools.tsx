import { Box, Flex } from '@radix-ui/themes';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignLeftIcon, TextAlignTopIcon } from '@radix-ui/react-icons';
import { QueryDevtoolsPanel } from './QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from './DevScreenSize/DevScreenSize';
import { useToolsKeyPress } from 'hooks/useToolsKeyPress';
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
    isDevScreenSizeVisible,
    isDevQueryPanelOpen,
    setIsDevQueryPanelOpen,
  } = useDev();

  useToolsKeyPress();

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
            <button className="btn-query" onClick={() => setIsDevQueryPanelOpen(!isDevQueryPanelOpen)}>
              <TextAlignTopIcon />
            </button>
          </Box>
        </Flex>
      </div>
    </>
  );
};
