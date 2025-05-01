import type { RouterCurrent } from './useRouterLoader.types';
import { useParams } from 'react-router-dom';
import { getPathSlug } from 'routes/utils/routes.utils';

export const useRouterLoader = () => {
  const paramsRouter = useParams();
  const pathname = window.location.pathname;

  const routerLoader = async (): Promise<RouterCurrent> => {
    const PATH_BASE = '/';
    const slug = getPathSlug(location.pathname);

    // FROM LOCATION ======================================================== //

    // const fromLocation = getFromLocation({
    //   location: location as unknown as LocationWithState,
    //   metaRoutes,
    //   paramsCustom,
    // });

    // FIX (not sure why this is present):
    if ('*' in paramsRouter) delete (paramsRouter as { [key: string]: unknown })['*'];

    const routerCurrent: RouterCurrent = {
      PATH_BASE,
      // basePath: '',
      pathname,
      params: {
        // ...paramsCustom,
        ...paramsRouter,
      },
      slug,
      location,
      // fromLocation,
      navigateTo: (href: string) => {
        window.location.href = href;
      },
      // route: routeMeta,
    };

    return routerCurrent;
  };

  return { routerLoader };
};
