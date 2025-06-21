import { Box, Flex } from '@radix-ui/themes';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignTopIcon } from '@radix-ui/react-icons';
import { QueryDevtoolsPanel } from './QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from './DevScreenSize/DevScreenSize';
import { useKeyPressAdmin } from 'hooks/useKeyPressAdmin';
import { styles } from './DevTools.styles';
import { MockSessionTimer } from './MockSessionTimer/MockSessionTimer';

export const DevToolsAdmin = () => {
  const { isDevToolsVisible, isDevQueryPanelOpen, setIsDevQueryPanelOpen } = useDev();

  useKeyPressAdmin();

  if (!isDevToolsVisible) return null;

  return (
    <>
      <>
        <DevScreenSize />
        {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
      </>
      <div css={styles} className="devtools-container">
        <Flex gap="3" justify="end">
          <Box width="64px" height="64px">
            <MockSessionTimer />
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
