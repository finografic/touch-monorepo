import { Box, Flex } from '@radix-ui/themes';
import { useDev } from 'providers/DevProvider/DevContext';
import { TextAlignLeftIcon, TextAlignTopIcon } from '@radix-ui/react-icons';
// import { DevPanel } from './DevPanel/DevPanel';
import { QueryDevtoolsPanel } from './QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from './DevScreenSize/DevScreenSize';
import { useKeyPress } from './useKeyPress';
import { styles } from './DevTools.styles';
import { DevFilterResults } from './DevFilterResults/DevFilterResults';
import { DevPanels } from 'components/DevTools/DevPanels/DevPanels';

export const DevTools = () => {
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
        {isDevDataVisible && <DevPanels />}
        {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
        {isDevDataVisible && <DevFilterResults />}
        <DevScreenSize />
      </>
      <div css={styles} className="devtools-container">
        <Flex gap="3" justify="end">
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
