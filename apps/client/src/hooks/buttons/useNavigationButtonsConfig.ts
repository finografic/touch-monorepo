import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMainPageOperations } from 'pages/MainPage/useMainPageOperations';
import { useTimePageStore } from 'pages/TimePage/useTimePageStore';
import { useRouteMatching } from 'routes/hooks/useRouteMatching';
import { BUTTON_TYPE, type ButtonType, type PadActionProps } from 'types/button.types';
import { ALTERNATIVE_PATHS, ROUTES_CONFIG } from 'config/routes';
import { ALTERNATIVE_ROUTE_BUTTON_CONFIG, BUTTON_CONFIGS } from 'config/ui';
import { useButtonsState } from './useButtonsState';
import { useNavigationButtons } from './useNavigationButtons';
import { useProductFlowOperations } from './useProductFlowOperations';
import { useTimeFlowOperations } from './useTimeFlowOperations';

interface UseNavigationButtonsConfigReturn {
  footerButtons: PadActionProps[];
}

/**
 * Route-aware navigation buttons configuration.
 * Returns footer buttons based on current route from ROUTES_CONFIG.
 * Uses useNavigationButtons for navigation handlers.
 * Used by FrontEndNavigation component.
 */
export const useNavigationButtonsConfig = (): UseNavigationButtonsConfigReturn => {
  const { matchRoute, currentPathname } = useRouteMatching();
  const { t } = useTranslation();

  // Get actions from both specialized hooks
  const { handleNavigateBack, handleNavigateNext, getNavigationDisabled, isNavigationPending } =
    useNavigationButtons();

  // Main Page ops (only handlers used in footer buttons)
  const {
    handleCancelSelected,
    handleResetCompleted,
    handleSelectAll,
    isPending: isMainPagePending,
  } = useMainPageOperations();

  // Time Flow ops (only handlers used in footer buttons)
  const {
    handleStartTimeProcess,
    handleCancelTimeSession,
    isPending: isTimeFlowPending,
  } = useTimeFlowOperations();

  // Product Flow ops (only handlers used in footer buttons)
  const {
    handleStartProductProcess,
    handleCancelProductSession,
    isPending: isProductFlowPending,
    isTemperatureLoading,
  } = useProductFlowOperations();

  const { getOperationDisabled, getOperationLoading, isOperationPending } = useButtonsState({
    isMainPagePending,
    isTimeFlowPending,
    isProductFlowPending,
    isTemperatureLoading,
  });

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

  const footerButtons = useMemo(() => {
    return routeConfig.footer.map((buttonType: ButtonType) => {
      const config = BUTTON_CONFIGS[buttonType];

      if (!config) {
        console.warn(`No configuration found for button type: ${buttonType}`);
        return {
          id: `unknown-${buttonType}`,
          type: buttonType,
          label: buttonType,
          actionType: BUTTON_TYPE.NAVIGATE_NEXT,
          disabled: true,
        } as PadActionProps;
      }

      const actionType = config.actionType;
      const isDisabled = getActionDisabled(actionType);
      const isLoading = getActionLoading(actionType);
      const translatedLabel = t(config.labelKey);

      const { labelKey, ...configWithoutLabelKey } = config;

      return {
        ...configWithoutLabelKey,
        label: translatedLabel,
        disabled: isDisabled,
        onClick: () => executeAction(actionType),
        children: isLoading ? t('ui.states.loading') : translatedLabel,
      } as PadActionProps;
    });
  }, [routeConfig.footer, executeAction, getActionDisabled, getActionLoading, t]);

  return {
    footerButtons,
  };
};
