import { Box, Flex } from '@radix-ui/themes';
import { styles } from './DevToolbar.styles';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignTopIcon } from 'styles/icons';
import { QueryDevtoolsPanel } from '../QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from '../DevScreenSize/DevScreenSize';
import { useKeyPressAdmin } from 'hooks/useKeyPressAdmin';
import { MockSessionTimer } from '../MockSessionTimer/MockSessionTimer';

export const DevToolbar = () => {
  const { isDevToolsVisible, isDevQueryPanelOpen, setIsDevQueryPanelOpen } = useDev();

  useKeyPressAdmin();

  if (!isDevToolsVisible) return null;

  return (
    <>
      <>
        <DevScreenSize />
        {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
      </>
      <div css={styles}>
        <Flex gap="3" align="center">
          <Box className="button-box">
            <MockSessionTimer />
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
