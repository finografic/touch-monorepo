import type { ReactElement } from 'react';
import React from 'react';

import { DevScreenSize } from 'dev-tools/components/DevScreenSize/DevScreenSize';
import { ScreenSizeOverlay } from 'dev-tools/layers/DevGuidesLayer/ScreenSizeOverlay';
import { useDev } from 'dev-tools/providers/DevProvider/DevContext';
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
