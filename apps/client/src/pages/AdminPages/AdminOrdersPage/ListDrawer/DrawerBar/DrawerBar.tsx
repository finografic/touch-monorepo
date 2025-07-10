import { Box, Button, Flex } from '@radix-ui/themes';
import { styles } from './DrawerBar.styles';
import type { FC, ReactNode } from 'react';
import { PanelBottomCloseIcon, PanelBottomOpenIcon } from 'styles/icons';
import clsx from 'clsx';

interface DrawerBarProps {
  isActionActive: boolean;
  onClickAction: () => void;
  children?: ReactNode;
}

export const DrawerBar: FC<DrawerBarProps> = ({ isActionActive, onClickAction, children }) => {
  return (
    <div css={styles} role={isActionActive ? 'search' : 'search'}>
      <Flex width="100%" justify="between">
        <Flex justify="start" align="center" className="col col-children">
          {children ?? <></>}
        </Flex>
        <Flex justify="end" align="center" className="col col-button">
          <Box className="button-box">
            <Button
              className={clsx('btn', isActionActive ? 'btn-close' : 'btn-open')}
              onClick={onClickAction}
              variant="ghost"
            >
              {isActionActive ? <PanelBottomCloseIcon /> : <PanelBottomOpenIcon />}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </div>
  );
};
