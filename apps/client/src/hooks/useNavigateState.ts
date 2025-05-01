import { useLocation, useNavigate } from 'react-router-dom';
import type { Location, NavigateOptions, To } from 'react-router-dom';
import type { LocationState, LocationWithState } from 'types/location.types';
import { cleanRoutePath } from 'routes/utils/routes.utils';
import { getFromLocation } from 'routes/utils/useRouter.utils';
import { ROUTES_CONFIG } from 'routes/routes.config';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';

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
  const { route } = useRouteMetadata();

  const navigateReactRouter = useNavigate();
  const location = useLocation();
  const fromLocation = getFromLocation({
    location: location as unknown as LocationWithState,
    metaRoutes: ROUTES_CONFIG,
  });

  const navigate: NavigateWithState = async (to: To | number, options: NavigateOptions = {}) => {
    if (typeof to === 'number') return navigateReactRouter(to); // Directly return as no additional options are needed

    // TODO: REMOVE `PATH_BASE` ?? 2024-12-31
    // const href = cleanRoutePath(PATH_BASE + to); // Assume to is a string here
    const href = cleanRoutePath(to as string); // Assume to is a string here
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
    from: fromLocation,
    action: locationState?.action,
    navigateExternal,
  };
};
