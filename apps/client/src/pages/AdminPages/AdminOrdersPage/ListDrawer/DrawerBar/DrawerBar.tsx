import { Box, Flex } from '@radix-ui/themes';
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
    <header css={styles} role={isActionActive ? 'search' : 'search'}>
      <Flex width="100%" justify="between" align="center">
        <Flex justify="start" style={{ flex: '1' }}>
          {children ?? <></>}
        </Flex>
        <Flex justify="end" style={{ flex: '1' }}>
          <Box className="button-box">
            <button
              className={clsx('btn', isActionActive ? 'btn-close' : 'btn-open')}
              onClick={onClickAction}
            >
              {isActionActive ? <PanelBottomCloseIcon /> : <PanelBottomOpenIcon />}
            </button>
          </Box>
        </Flex>
      </Flex>
    </header>
  );
};
