import React from 'react';

import { ScreenSizeOverlay } from 'dev-tools/layers/DevGuidesLayer/ScreenSizeOverlay';
import type { ReactElement } from 'react';

import { DevGuidesProvider } from '../../providers/DevGuidesProvider';

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
