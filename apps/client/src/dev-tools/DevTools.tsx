import { useLocation } from 'react-router-dom';
import { DevToolbar } from './DevToolbar/DevToolbar';
import { FrontEndDevToolbar } from './FrontEndDevToolbar/FrontEndDevToolbar';

export const DevTools = () => {
  const location = useLocation();

  // Route-based DevTools rendering
  if (location.pathname.startsWith('/admin')) {
    return <DevToolbar />;
  }

  // Default to front-end DevTools
  return <FrontEndDevToolbar />;
};
