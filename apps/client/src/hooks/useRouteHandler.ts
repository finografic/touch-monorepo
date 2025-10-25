import { useLocation } from 'react-router-dom';

import { useButtonOperations } from 'hooks/button-operations';
import { useTimePageStore } from 'utils/timePageState';

import { ALTERNATIVE_PATHS } from 'config';

export const useRouteHandler = () => {
  const location = useLocation();
  const { handleStartProductProcess, handleStartTimeProcess } = useButtonOperations();

  // ✅ Use proper Zustand store to get current time
  const timeSeconds = useTimePageStore((state) => state.timeSeconds);

  const getStartHandler = () => {
    // On TimePage, use time-specific handler with current time from Zustand store
    if (location.pathname === ALTERNATIVE_PATHS.time) {
      console.log('useRouteHandler: TimePage detected, using time handler with', timeSeconds, 'seconds');
      return () => handleStartTimeProcess(timeSeconds);
    }

    // On other routes, use regular temperature handler
    console.log('useRouteHandler: Using regular temperature handler for', location.pathname);
    return handleStartProductProcess;
  };

  return {
    getStartHandler,
  };
};
