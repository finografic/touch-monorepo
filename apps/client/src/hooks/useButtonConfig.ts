import { useCallback, useMemo } from 'react';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { NAVIGATION_BUTTONS_CONFIG, ROUTE_NAVIGATION_CONFIG } from 'constants/navigation.config';
import { useButtonNavigation } from 'hooks/useButtonNavigation';
import { useButtonOperations } from 'hooks/useButtonOperations';
import type { ActionButtonProps, ActionButtonType } from 'types/navigation.types';

interface UseButtonConfigReturn {
  footerButtons: ActionButtonProps[];
  contentButtons: ActionButtonProps[];
  getButtonProps: (buttonType: ActionButtonType) => ActionButtonProps;
}

export const useButtonConfig = (): UseButtonConfigReturn => {
  const { fieldKey } = useRouteConfig();

  // Get actions from both specialized hooks
  const { handleNavigateBack, handleNavigateNext, getNavigationDisabled, isNavigationPending } =
    useButtonNavigation();

  const {
    handleClearCompleted,
    handleSelectAll,
    handleStartProcess,
    handleProgramTime,
    handleRepeatSelection,
    getOperationDisabled,
    getOperationLoading,
    isOperationPending,
  } = useButtonOperations();

  const routeConfig = useMemo(() => {
    if (!fieldKey || !ROUTE_NAVIGATION_CONFIG[fieldKey]) {
      return { footer: [], content: [] };
    }
    return ROUTE_NAVIGATION_CONFIG[fieldKey];
  }, [fieldKey]);

  const executeAction = useCallback(
    (actionType: string) => {
      switch (actionType) {
        case 'navigate-back':
          return handleNavigateBack();
        case 'navigate-next':
          return handleNavigateNext();
        case 'clear-completed':
          return handleClearCompleted();
        case 'select-all':
          return handleSelectAll();
        case 'start-process':
          return handleStartProcess();
        case 'program-time':
          return handleProgramTime();
        case 'repeat-selection':
          return handleRepeatSelection();
        default:
          console.warn(`Unknown action type: ${actionType}`);
      }
    },
    [
      handleNavigateBack,
      handleNavigateNext,
      handleClearCompleted,
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
      const config = NAVIGATION_BUTTONS_CONFIG[buttonType];
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
