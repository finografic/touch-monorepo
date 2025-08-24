import type { ReactElement, ReactNode } from 'react';
import { DevToolbar } from 'dev-tools/DevLayer/DevToolbar';
import React, { useEffect } from 'react';
import { DevColumns } from './DevColumns';
import { useDevLayer } from './DevLayerContext';
import { DevScreenSizes } from 'dev-tools/DevLayer/DevScreenSizes';

interface DevLayerProps {
  children: ReactNode;
}

export const DevLayerTools: React.FC = (): ReactElement => {
  const { isToolbarOpen } = useDevLayer();

  useEffect(() => {}, [location.pathname]);

  return (
    <React.Fragment>
      <DevToolbar />
      {isToolbarOpen && <DevColumns />}
      {isToolbarOpen && <DevScreenSizes />}
    </React.Fragment>
  );
};
