import { useLocation } from 'react-router-dom';
import { useButtonOperations } from './useButtonOperations';
import { ALTERNATIVE_PATHS } from 'routes/routes.config';
import { timePageState } from 'utils/timePageState';

export const useRouteHandler = () => {
  const location = useLocation();
  const { handleStartProcess, handleStartTimeProcess } = useButtonOperations();

  const getStartHandler = () => {
    // On TimePage, use time-specific handler with current time from global state
    if (location.pathname === ALTERNATIVE_PATHS.time) {
      const timePageSeconds = timePageState.getTime();
      console.log('useRouteHandler: TimePage detected, using time handler with', timePageSeconds, 'seconds');
      return () => handleStartTimeProcess(timePageSeconds);
    }

    // On other routes, use regular temperature handler
    console.log('useRouteHandler: Using regular temperature handler for', location.pathname);
    return handleStartProcess;
  };

  return {
    getStartHandler,
  };
};
