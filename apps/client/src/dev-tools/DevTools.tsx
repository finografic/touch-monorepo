import { useLocation } from 'react-router-dom';
import { DevToolsFrontEnd } from './DevToolsFrontEnd';
import { DevToolsAdmin } from './DevToolsAdmin';

export const DevTools = () => {
  const location = useLocation();

  // Route-based DevTools rendering
  if (location.pathname.startsWith('/admin')) {
    return <DevToolsAdmin />;
  }

  // Default to front-end DevTools
  return <DevToolsFrontEnd />;
};
