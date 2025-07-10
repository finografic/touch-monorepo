import React, { useState } from 'react';
import { styles } from './ListDrawer.styles';
import { DrawerBar } from './DrawerBar';

interface ListDrawerProps {
  onOpenChange?: (open: boolean) => void;
  drawerBarLeft?: React.ReactNode;
  children: React.ReactNode;
}

export const ListDrawer: React.FC<ListDrawerProps> = ({ onOpenChange, drawerBarLeft, children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  return (
    <div css={styles} className={`list-drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
      <div className="drawer-overlay" onClick={handleOverlayClick} />
      <div className="drawer-content">
        <div className="drawer-body">
          <DrawerBar
            // theme="dark"
            isActionActive={isDrawerOpen}
            onClickAction={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            {drawerBarLeft}
          </DrawerBar>
          {children}
        </div>
      </div>
    </div>
  );
};
