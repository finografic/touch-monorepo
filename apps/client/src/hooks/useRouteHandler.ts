import { useLocation } from 'react-router-dom';

import { timePageState } from 'utils/timePageState';

import { ALTERNATIVE_PATHS } from 'config';
import { useButtonOperations } from './useButtonOperations';

export const useRouteHandler = () => {
  const location = useLocation();
  const { handleStartProductProcess, handleStartTimeProcess } = useButtonOperations();

  const getStartHandler = () => {
    // On TimePage, use time-specific handler with current time from global state
    if (location.pathname === ALTERNATIVE_PATHS.time) {
      const timePageSeconds = timePageState.getTime();
      console.log('useRouteHandler: TimePage detected, using time handler with', timePageSeconds, 'seconds');
      return () => handleStartTimeProcess(timePageSeconds);
    }

    // On other routes, use regular temperature handler
    console.log('useRouteHandler: Using regular temperature handler for', location.pathname);
    return handleStartProductProcess;
  };

  return {
    getStartHandler,
  };
};
