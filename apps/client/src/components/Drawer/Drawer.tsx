import React, { useState } from 'react';

import { DrawerBar } from './DrawerBar';
import { styles } from './Drawer.styles';

interface DrawerProps {
  onOpenChange?: (open: boolean) => void;
  drawerBarLeft?: React.ReactNode;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ onOpenChange, drawerBarLeft, children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
      setIsDrawerOpen(false);
    }
  };

  return (
    <div css={styles} className={`list-drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
      <div className="drawer-overlay" onClick={handleOverlayClick} />
      <div className="drawer-content">
        <DrawerBar
          isActionActive={isDrawerOpen}
          onClickAction={() => {
            onOpenChange?.(!isDrawerOpen);
            setIsDrawerOpen(!isDrawerOpen);
          }}
        >
          {drawerBarLeft}
        </DrawerBar>
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  );
};
