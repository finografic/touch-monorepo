import { Box, Flex, Theme } from '@radix-ui/themes';
import { usePageContent } from 'providers/PageContentProvider/PageContentContext';
import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { useDev } from '../../providers/DevProvider/DevContext';
import { TableIcon } from '@radix-ui/react-icons';

export const DevDialog = () => {
  const { isDevDataVisible, setIsDevDataVisible, isDevQueryPanelOpen, setIsDevQueryPanelOpen } = useDev();
  const { orders } = useOrderSelection({
    field: OrderFieldKeys.drinkType,
  });

  return (
    <Theme appearance="dark" grayColor="sand" accentColor="blue">
      <Flex gap="3">
        <Box width="64px" height="64px">
          <button id="toggle-query-devtools" onClick={() => setIsDevDataVisible(!isDevDataVisible)}>
            <TableIcon />
          </button>
        </Box>
        <Box width="64px" height="64px">
          <button id="toggle-query-devtools" onClick={() => setIsDevQueryPanelOpen(!isDevQueryPanelOpen)}>
            <TableIcon />
          </button>
        </Box>
        <Box width="64px" height="64px">
          <button id="toggle-query-devtools" onClick={() => setIsDevQueryPanelOpen(!isDevQueryPanelOpen)}>
            <TableIcon />
          </button>
        </Box>
      </Flex>
    </Theme>
  );
};
