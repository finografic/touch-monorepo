import type { Location, NavigateOptions, To } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { getFromLocation } from 'routes/utils/useRouter.utils';

import type { LocationState, LocationWithState } from 'types/location.types';
import { ROUTES_CONFIG } from 'config/routes';

type NavigateWithState = (to: To | number, options?: NavigateOptions) => Promise<void>;
interface FromLocationProps extends Omit<Location, 'pathname' | 'search'>, LocationState {}

interface UseNavigateState {
  navigate: NavigateWithState;
  key: FromLocationProps['key'];
  hash: FromLocationProps['hash'];
  state: FromLocationProps['state'];
  from: FromLocationProps['from'] | undefined;
  action: FromLocationProps['action'];
  navigateExternal: ({ url }: { url: string }) => void;
}

export const useNavigateState = (): UseNavigateState => {
  const { route } = useRouteConfig();

  const navigateReactRouter = useNavigate();
  const location = useLocation();
  const fromLocation = getFromLocation({
    location: location as unknown as LocationWithState,
    metaRoutes: ROUTES_CONFIG,
  });

  const navigate: NavigateWithState = async (to: To | number, options: NavigateOptions = {}) => {
    if (typeof to === 'number') return navigateReactRouter(to); // Directly return as no additional options are needed

    const href = typeof to === 'string' ? to : to.pathname;
    const optionsWithState = {
      ...options,
      state: {
        ...options?.state,
        from: fromLocation,
      },
    };

    await navigateReactRouter(href, optionsWithState);
  };

  const navigateExternal = ({ url }: { url: string }) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer') as Window;
    if (newWindow) newWindow.opener = null;
  };

  const locationState = (location as unknown as LocationWithState)?.state;

  return {
    navigate,
    key: location.key,
    hash: location.hash,
    state: location.state,
    from: route || fromLocation,
    action: locationState?.action,
    navigateExternal,
  };
};
