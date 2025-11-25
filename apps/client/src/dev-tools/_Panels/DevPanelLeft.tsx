import { useLocation } from 'react-router-dom';

import { DevFilterResults } from 'dev-tools/data/DevFilterResults/DevFilterResults';
import { DevOrderProfile } from 'dev-tools/data/DevOrderProfile/DevOrderProfile';
import { SessionAndTimers } from 'dev-tools/data/SessionAndTimers/SessionAndTimers';
import { useTimers } from 'providers/TimersProvider';
import { DevRecallTimer } from 'dev-tools/data/DevFilterResults/DevRecalTimer';

export const DevPanelLeft = () => {
  const location = useLocation();

  // Check if recall config is active (exists and not expired)
  const { recall, isRecallExpired } = useTimers();
  const hasActiveTimer = recall.config !== null && !isRecallExpired();

  console.log('recall', recall);

  if (hasActiveTimer) {
    return <DevRecallTimer />;
  }

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
