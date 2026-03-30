import type { FC, ReactNode } from 'react';

import { Box, Flex } from 'styled-system/jsx';
import { Button } from '@finografic/design-system/components';
import clsx from 'clsx';

import { PanelBottomCloseIcon, PanelBottomOpenIcon } from '@finografic/icons';
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
      <Flex width="100%" justify="space-between" className={clsx('drawer-bar', theme)}>
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
              size="sm"
            >
              {isActionActive ? <PanelBottomCloseIcon /> : <PanelBottomOpenIcon />}
            </Button>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};
