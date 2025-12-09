import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useButtonNavigation } from 'hooks/useButtonNavigation';
import { useRouteMatching } from 'routes/hooks/useRouteMatching';
import { useTimePageStore } from 'pages/TimePage/useTimePageStore';
import { useMainPageOperations } from './button-operations/useMainPageOperations';
import { useProductFlowOperations } from './button-operations/useProductFlowOperations';
import { useTimeFlowOperations } from './button-operations/useTimeFlowOperations';
import { useOperationState } from './button-operations/useOperationState';

import { BUTTON_TYPE, type ButtonType, type PadActionProps } from 'types/button.types';
import { ALTERNATIVE_PATHS, ROUTES_CONFIG } from 'config/routes';
import { ALTERNATIVE_ROUTE_BUTTON_CONFIG, BUTTON_CONFIGS } from 'config/ui';

interface UseButtonConfigReturn {
  footerButtons: PadActionProps[];
  contentButtons: PadActionProps[];
  getButtonProps: (buttonType: ButtonType) => PadActionProps;
}

export const useButtonConfig = (): UseButtonConfigReturn => {
  const { matchRoute, currentPathname } = useRouteMatching();
  const { t } = useTranslation();

  // Get actions from both specialized hooks
  const { handleNavigateBack, handleNavigateNext, getNavigationDisabled, isNavigationPending } =
    useButtonNavigation();

  // Main Page ops
  const {
    handleCancelSelected,
    handleResetCompleted,
    handleSelectAll,
    handleRepeatSelection,
    isPending: isMainPagePending,
  } = useMainPageOperations();

  // Time Flow ops
  const {
    handleProgramTime,
    handleStartTimeProcess,
    handleCancelTimeSession,
    isPending: isTimeFlowPending,
  } = useTimeFlowOperations();

  // Product Flow ops
  const {
    handleProgramProduct,
    handleStartProductProcess,
    handleCancelProductSession,
    isPending: isProductFlowPending,
    isTemperatureLoading,
  } = useProductFlowOperations();

  const { getOperationDisabled, getOperationLoading, isOperationPending } = useOperationState(
    isMainPagePending,
    isTimeFlowPending,
    isProductFlowPending,
    isTemperatureLoading,
  );

  // Get time from Zustand store for TimePage
  const timeSeconds = useTimePageStore((state) => state.timeSeconds);

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
        // navigation buttons
        case BUTTON_TYPE.NAVIGATE_BACK:
          return handleNavigateBack();
        case BUTTON_TYPE.NAVIGATE_NEXT:
          return handleNavigateNext();

        // MainPage - bottom buttons
        case BUTTON_TYPE.CANCEL_SELECTED:
          return handleCancelSelected();
        case BUTTON_TYPE.RESET_COMPLETED:
          return handleResetCompleted();
        case BUTTON_TYPE.SELECT_ALL_SLOTS:
          return handleSelectAll();

        // MainPage - right buttons (large)
        case BUTTON_TYPE.PROGRAM_TIME:
          return handleProgramTime();
        case BUTTON_TYPE.PROGRAM_PRODUCT:
          return handleProgramProduct();
        case BUTTON_TYPE.REPEAT_SELECTION:
          return handleRepeatSelection();

        // in-flow buttons
        case BUTTON_TYPE.CANCEL_TIME_SESSION:
          return handleCancelTimeSession();
        case BUTTON_TYPE.CANCEL_PRODUCT_SESSION:
          return handleCancelProductSession();

        case BUTTON_TYPE.START_TIME_PROCESS:
          return handleStartTimeProcess(timeSeconds);
        case BUTTON_TYPE.START_PRODUCT_PROCESS:
          return handleStartProductProcess();

        default:
          console.warn(`Unknown action type: ${actionType}`);
      }
    },
    [
      handleNavigateBack,
      handleNavigateNext,
      handleResetCompleted,
      handleCancelSelected,
      handleSelectAll,
      timeSeconds,
      handleStartTimeProcess,
      handleStartProductProcess,
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
      if (actionType === BUTTON_TYPE.NAVIGATE_BACK || actionType === BUTTON_TYPE.NAVIGATE_NEXT) {
        return getNavigationDisabled(
          actionType as typeof BUTTON_TYPE.NAVIGATE_BACK | typeof BUTTON_TYPE.NAVIGATE_NEXT,
        );
      }

      // Check operation actions
      return getOperationDisabled(actionType as any);
    },
    [getNavigationDisabled, getOperationDisabled],
  );

  const getActionLoading = useCallback(
    (actionType: string): boolean => {
      // Navigation actions use their own pending state
      if (actionType === BUTTON_TYPE.NAVIGATE_BACK || actionType === BUTTON_TYPE.NAVIGATE_NEXT) {
        return isNavigationPending || isOperationPending;
      }

      // Operation actions have their own loading logic
      return getOperationLoading(actionType as any);
    },
    [isNavigationPending, isOperationPending, getOperationLoading],
  );

  const getButtonProps = useMemo(() => {
    return (buttonType: ButtonType): PadActionProps => {
      const config = BUTTON_CONFIGS[buttonType];

      if (!config) {
        console.warn(`No configuration found for button type: ${buttonType}`);
        return {
          id: `unknown-${buttonType}`,
          type: buttonType,
          label: buttonType,
          actionType: BUTTON_TYPE.NAVIGATE_NEXT,
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
