import { type ReactElement, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DevLayerProvider } from './DevLayerContext';
import { DevLayerTools } from './DevLayerTools';

export const DevLayer: React.FC<{ children: React.ReactNode }> = ({ children }): ReactElement => {
  const location = useLocation();

  useEffect(() => {
    log('DEV: Route Debug - Location changed:', 'grey', location);
  }, [location]);

  return (
    <DevLayerProvider>
      {/* <Outlet key={location.key} /> */}
      {children}
      <DevLayerTools />
    </DevLayerProvider>
  );
};
