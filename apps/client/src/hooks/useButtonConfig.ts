import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import {
  ALTERNATIVE_ROUTE_BUTTON_CONFIG,
  BUTTON_CONFIGS,
  ROUTE_BUTTON_CONFIG,
} from 'constants/button.config';
import { useButtonNavigation } from 'hooks/useButtonNavigation';
import { useButtonOperations } from 'hooks/useButtonOperations';
import {
  type ActionButtonProps,
  type ActionButtonType,
  BUTTON_ACTIONS,
  BUTTON_TYPES,
} from 'types/button.types';
import { ALTERNATIVE_PATHS } from 'routes/routes.config';

interface UseButtonConfigReturn {
  footerButtons: ActionButtonProps[];
  contentButtons: ActionButtonProps[];
  getButtonProps: (buttonType: ActionButtonType) => ActionButtonProps;
}

export const useButtonConfig = (): UseButtonConfigReturn => {
  const location = useLocation();
  const { fieldKey } = useRouteConfig();

  // Get actions from both specialized hooks
  const { handleNavigateBack, handleNavigateNext, getNavigationDisabled, isNavigationPending } =
    useButtonNavigation();

  const {
    handleClearCompleted,
    handleCancelCompleted,
    handleSelectAll,
    handleStartProcess,
    handleProgramTime,
    handleRepeatSelection,
    getOperationDisabled,
    getOperationLoading,
    isOperationPending,
  } = useButtonOperations();

  const routeConfig = useMemo(() => {
    // Check if we're on an alternative route (like TimePage)
    if (location.pathname === ALTERNATIVE_PATHS.time) {
      return ALTERNATIVE_ROUTE_BUTTON_CONFIG.time;
    }

    // Default to main route config
    if (!fieldKey || !ROUTE_BUTTON_CONFIG[fieldKey]) {
      return { footer: [], content: [] };
    }
    return ROUTE_BUTTON_CONFIG[fieldKey];
  }, [fieldKey, location.pathname]);

  const executeAction = useCallback(
    (actionType: string) => {
      switch (actionType) {
        case BUTTON_ACTIONS.NAVIGATE_BACK:
          return handleNavigateBack();
        case BUTTON_ACTIONS.NAVIGATE_NEXT:
          return handleNavigateNext();
        case BUTTON_ACTIONS.CLEAR_COMPLETED:
          return handleClearCompleted();
        case BUTTON_ACTIONS.CANCEL_COMPLETED:
          return handleCancelCompleted();
        case BUTTON_ACTIONS.SELECT_ALL:
          return handleSelectAll();
        case BUTTON_ACTIONS.START_PROCESS:
          return handleStartProcess();
        case BUTTON_ACTIONS.PROGRAM_TIME:
          return handleProgramTime();
        case BUTTON_ACTIONS.REPEAT_SELECTION:
          return handleRepeatSelection();
        default:
          console.warn(`Unknown action type: ${actionType}`);
      }
    },
    [
      handleNavigateBack,
      handleNavigateNext,
      handleClearCompleted,
      handleCancelCompleted,
      handleSelectAll,
      handleStartProcess,
      handleProgramTime,
      handleRepeatSelection,
    ],
  );

  const getActionDisabled = useCallback(
    (actionType: string): boolean => {
      // Check navigation actions first
      if (actionType === 'navigate-back' || actionType === 'navigate-next') {
        return getNavigationDisabled(actionType as 'navigate-back' | 'navigate-next');
      }

      // Check operation actions
      return getOperationDisabled(actionType as any);
    },
    [getNavigationDisabled, getOperationDisabled],
  );

  const getActionLoading = useCallback(
    (actionType: string): boolean => {
      // Navigation actions use their own pending state
      if (actionType === 'navigate-back' || actionType === 'navigate-next') {
        return isNavigationPending;
      }

      // Operation actions have their own loading logic
      return getOperationLoading(actionType as any);
    },
    [isNavigationPending, getOperationLoading],
  );

  const getButtonProps = useMemo(() => {
    return (buttonType: ActionButtonType): ActionButtonProps => {
      const config = BUTTON_CONFIGS[buttonType];
      if (!config) {
        console.warn(`No configuration found for button type: ${buttonType}`);
        return {
          id: `unknown-${buttonType}`,
          type: buttonType,
          label: buttonType,
          actionType: 'navigate-next',
          disabled: true,
        };
      }

      const isDisabled = getActionDisabled(config.actionType);
      const isLoading = getActionLoading(config.actionType);

      return {
        ...config,
        disabled: isDisabled,
        onClick: () => executeAction(config.actionType),
        children: isLoading ? 'Processing...' : config.label,
      };
    };
  }, [executeAction, getActionDisabled, getActionLoading]);

  const footerButtons = useMemo(() => {
    return routeConfig.footer.map(getButtonProps);
  }, [routeConfig.footer, getButtonProps]);

  const contentButtons = useMemo(() => {
    return routeConfig.content.map(getButtonProps);
  }, [routeConfig.content, getButtonProps]);

  return {
    footerButtons,
    contentButtons,
    getButtonProps,
  };
};
