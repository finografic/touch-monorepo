import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useButtonOperations } from 'hooks/button-operations';
import { useButtonNavigation } from 'hooks/useButtonNavigation';
import { useRouteHandler } from 'hooks/useRouteHandler';
import { useRouteMatching } from 'routes/hooks/useRouteMatching';

import { BUTTON_ACTION, type PadActionProps, type PadActionType } from 'types/button.types';
import { ALTERNATIVE_PATHS, ROUTES_CONFIG } from 'config';
import { ALTERNATIVE_ROUTE_BUTTON_CONFIG, BUTTON_CONFIGS } from 'config/ui';

interface UseButtonConfigReturn {
  footerButtons: PadActionProps[];
  contentButtons: PadActionProps[];
  getButtonProps: (buttonType: PadActionType) => PadActionProps;
}

export const useButtonConfig = (): UseButtonConfigReturn => {
  const location = useLocation();
  const { matchRoute, currentPathname } = useRouteMatching();
  const { t } = useTranslation();

  // Get actions from both specialized hooks
  const { handleNavigateBack, handleNavigateNext, getNavigationDisabled, isNavigationPending } =
    useButtonNavigation();

  const {
    handleClearCompleted,
    handleCancelCompleted,
    handleSelectAll,
    handleProgramTime,
    handleProgramProduct,
    handleRepeatSelection,
    handleCancelTimeSession,
    handleCancelProductSession,
    handleStartProductProcess,
    handleFinishProductProcess,
    getOperationDisabled,
    getOperationLoading,
    // isOperationPending,
  } = useButtonOperations();

  // Use route-specific handler
  const { getStartHandler } = useRouteHandler();

  const routeConfig = useMemo(() => {
    // Check if we're on an alternative route (like TimePage)
    if (currentPathname === ALTERNATIVE_PATHS.time) {
      return ALTERNATIVE_ROUTE_BUTTON_CONFIG.time;
    }

    // Find the route config using shared matching logic
    const currentRoute = matchRoute(ROUTES_CONFIG, currentPathname);
    return currentRoute?.buttons || { footer: [], content: [] };
  }, [matchRoute, currentPathname]);

  const executeAction = useCallback(
    (actionType: string) => {
      switch (actionType) {
        case BUTTON_ACTION.NAVIGATE_BACK:
          return handleNavigateBack();
        case BUTTON_ACTION.NAVIGATE_NEXT:
          return handleNavigateNext();
        case BUTTON_ACTION.CLEAR_COMPLETED:
          return handleClearCompleted();
        case BUTTON_ACTION.CANCEL_COMPLETED:
          return handleCancelCompleted();
        case BUTTON_ACTION.SELECT_ALL:
          return handleSelectAll();
        case BUTTON_ACTION.START_PROCESS:
          // Use route-specific handler
          return getStartHandler()();
        case BUTTON_ACTION.FINISH_PRODUCT_PROCESS:
          return handleFinishProductProcess();
        case BUTTON_ACTION.PROGRAM_TIME:
          return handleProgramTime();
        case BUTTON_ACTION.PROGRAM_PRODUCT:
          return handleProgramProduct();
        case BUTTON_ACTION.REPEAT_SELECTION:
          return handleRepeatSelection();
        case BUTTON_ACTION.CANCEL_TIME_SESSION:
          return handleCancelTimeSession();
        case BUTTON_ACTION.CANCEL_PRODUCT_SESSION:
          return handleCancelProductSession();
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
      getStartHandler,
      handleFinishProductProcess,
      handleProgramTime,
      handleProgramProduct,
      handleRepeatSelection,
      handleCancelTimeSession,
      handleCancelProductSession,
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
    return (buttonType: PadActionType): PadActionProps => {
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
      const translatedLabel = t(config.labelKey);

      // Destructure to exclude labelKey from spreading
      const { labelKey, ...configWithoutLabelKey } = config;

      return {
        ...configWithoutLabelKey,
        label: translatedLabel,
        disabled: isDisabled,
        onClick: () => executeAction(config.actionType),
        children: isLoading ? t('ui.states.loading') : translatedLabel,
      };
    };
  }, [executeAction, getActionDisabled, getActionLoading, t]);

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
