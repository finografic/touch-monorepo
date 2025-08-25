import type { ReactElement } from 'react';
import React from 'react';
import { ScreenSizeOverlay } from 'dev-tools/DevGuidesLayer/ScreenSizeOverlay';
import { DevGuidesProvider } from './DevGuidesContext';

export const DevGuidesLayer: React.FC<{ children: React.ReactNode }> = ({ children }): ReactElement => {
  return (
    <DevGuidesProvider>
      {children}
      <>
        {/* {isToolbarOpen && <DevColumns />} */}
        {/* {isDevGuidesVisibile && <ScreenSizeOverlay />} */}
        <ScreenSizeOverlay />
      </>
    </DevGuidesProvider>
  );
};
