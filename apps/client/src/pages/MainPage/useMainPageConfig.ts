import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { OperationActionType } from 'hooks/buttons/button.types';
import { useButtonsState } from 'hooks/buttons/useButtonsState';
import { useProductFlowOperations } from 'hooks/buttons/useProductFlowOperations';
import { useTimeFlowOperations } from 'hooks/buttons/useTimeFlowOperations';
import { useRouteMatching } from 'routes/hooks/useRouteMatching';

import type { ButtonType, PadActionProps } from 'types/button.types';
import { BUTTON_TYPE } from 'types/button.types';
import { ROUTES_CONFIG } from 'config/routes';
import { PATHS } from 'config/routes/paths.constants';
import { BUTTON_CONFIGS } from 'config/ui';
import { useMainPageOperations } from './useMainPageOperations';

/**
 * MainPage-specific content buttons configuration.
 * Returns content buttons for MainPage (PROGRAM_TIME, PROGRAM_PRODUCT, REPEAT_SELECTION).
 */
export const useMainPageConfig = (): { contentButtons: PadActionProps[] } => {
  const { matchRoute, currentPathname } = useRouteMatching();
  const { t } = useTranslation();

  // Import handlers and pending states for MainPage content buttons
  const { handleRepeatSelection, isPending: isMainPagePending } = useMainPageOperations();
  const { handleProgramTime, isPending: isTimeFlowPending } = useTimeFlowOperations();
  const {
    handleProgramProduct,
    isPending: isProductFlowPending,
    isTemperatureLoading,
  } = useProductFlowOperations();

  // Get disabled/loading state (needs all pending states for accurate calculation)
  const { getOperationDisabled, getOperationLoading } = useButtonsState({
    isMainPagePending,
    isTimeFlowPending,
    isProductFlowPending,
    isTemperatureLoading,
  });

  // Get route config for MainPage
  const routeConfig = useMemo(() => {
    const currentRoute = matchRoute(ROUTES_CONFIG, currentPathname);
    // Only return config if we're on the main page
    if (currentPathname === PATHS.main && currentRoute) {
      return currentRoute.buttons;
    }
    return { footer: [], content: [] };
  }, [matchRoute, currentPathname]);

  // Build action handlers map (only for MainPage content buttons)
  const actionHandlers = useMemo(
    () => ({
      [BUTTON_TYPE.PROGRAM_TIME]: handleProgramTime,
      [BUTTON_TYPE.PROGRAM_PRODUCT]: handleProgramProduct,
      [BUTTON_TYPE.REPEAT_SELECTION]: handleRepeatSelection,
    }),
    [handleProgramTime, handleProgramProduct, handleRepeatSelection],
  );

  // Build content buttons
  const contentButtons = useMemo(() => {
    return routeConfig.content.map((buttonType: ButtonType) => {
      const handler = actionHandlers[buttonType];
      const buttonConfig = BUTTON_CONFIGS[buttonType];
      const actionType = (buttonConfig?.actionType || buttonType) as OperationActionType;

      if (!buttonConfig) {
        console.warn(`No configuration found for button type: ${buttonType}`);
        return {
          id: `unknown-${buttonType}`,
          type: buttonType,
          label: buttonType,
          actionType: BUTTON_TYPE.NAVIGATE_NEXT,
          disabled: true,
        } as PadActionProps;
      }

      const isDisabled = getOperationDisabled(actionType);
      const isLoading = getOperationLoading(actionType);
      const translatedLabel = t(buttonConfig.labelKey);

      const { labelKey, ...configWithoutLabelKey } = buttonConfig;

      return {
        ...configWithoutLabelKey,
        label: translatedLabel,
        disabled: isDisabled,
        onClick: handler || (() => {}),
        children: isLoading ? t('ui.states.loading') : translatedLabel,
      } as PadActionProps;
    });
  }, [routeConfig.content, actionHandlers, getOperationDisabled, getOperationLoading, t]);

  return {
    contentButtons,
  };
};
