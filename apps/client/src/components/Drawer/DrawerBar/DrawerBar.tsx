import type { FC, ReactNode } from 'react';
import { Box, Button, Flex } from '@radix-ui/themes';
import clsx from 'clsx';

import { PanelBottomCloseIcon, PanelBottomOpenIcon } from 'styles/icons';
import { styles } from './DrawerBar.styles';

interface DrawerBarProps {
  isActionActive: boolean;
  onClickAction: () => void;
  children?: ReactNode;
  theme?: 'light' | 'dark';
}

export const DrawerBar: FC<DrawerBarProps> = ({
  isActionActive,
  onClickAction,
  children,
  theme = 'light',
}) => {
  return (
    <div css={styles} role={isActionActive ? 'search' : 'search'}>
      <Flex width="100%" justify="between" className={clsx('drawer-bar', theme)}>
        <Flex
          justify="start"
          align="center"
          className={clsx('col col-children', isActionActive && 'active')}
          onClick={!isActionActive ? onClickAction : undefined}
        >
          <div className="drawer-children">{children ?? <></>}</div>
        </Flex>
        <Flex justify="end" align="center" className="col col-button">
          <div className="button-box">
            <Button
              className={clsx('button', isActionActive && 'active')}
              onClick={onClickAction}
              variant="ghost"
            >
              {isActionActive ? <PanelBottomCloseIcon /> : <PanelBottomOpenIcon />}
            </Button>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};
