import { useMemo } from 'react';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { NAVIGATION_BUTTONS_CONFIG, ROUTE_NAVIGATION_CONFIG } from 'constants/navigation.config';
import { useNavigationActions } from 'hooks/useNavigationActions';
import type { ActionButtonProps, ActionButtonType } from 'types/navigation.types';

interface UseNavigationConfigReturn {
  footerButtons: ActionButtonProps[];
  contentButtons: ActionButtonProps[];
  getButtonProps: (buttonType: ActionButtonType) => ActionButtonProps;
}

export const useNavigationConfig = (): UseNavigationConfigReturn => {
  const { fieldKey } = useRouteConfig();
  const { executeAction, getActionDisabled, getActionLoading } = useNavigationActions();

  const routeConfig = useMemo(() => {
    if (!fieldKey || !ROUTE_NAVIGATION_CONFIG[fieldKey]) {
      return { footer: [], content: [] };
    }
    return ROUTE_NAVIGATION_CONFIG[fieldKey];
  }, [fieldKey]);

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
