import { useLocation } from 'react-router-dom';

import { DevFilterResults } from 'dev-tools/data/DevFilterResults/DevFilterResults';
import { DevOrderProfile } from 'dev-tools/data/DevOrderProfile/DevOrderProfile';
import { SessionAndTimers } from 'dev-tools/data/SessionAndTimers/SessionAndTimers';

export const DevPanelLeft = () => {
  const location = useLocation();

  if (['/temperature'].includes(location.pathname)) {
    return <DevFilterResults />;
    return <DevOrderProfile />;
  }

  if (['/', '/time'].includes(location.pathname)) {
    return <SessionAndTimers />;
  }

  // return <SessionAndTimers />;
  return <DevFilterResults />;
};
