/* eslint-disable prefer-const */
import type { RouteConfig } from 'routes/routes.types';
import type { GlobalStore } from 'store/GlobalContext.types';
import type { CatMeta, LocationWithState } from 'types';
import type { ParamsCustom, RouterCurrent } from './useRouterLoader.types';
import { config } from 'config';
import {
  LoaderFunction,
  matchPath,
  type Params,
  type PathMatch,
  useLocation,
  useMatch,
  useParams,
} from 'react-router-dom';
import { cleanRoutePath } from 'routes/utils/routes.utils';
import { getPathBase, getPathSlug, isAdminPath, isUserPath } from 'routes/utils/routes.utils.paths';
import { useGlobal } from 'store/useGlobalContext';
import { ACTIONS } from 'types';
import { getRoutePathParams } from '../../user/getRoutePathParams';
import { useRouteMetadata } from '../useRouteMetadata';
import { getFromLocation, getRouteAction, getUserRouteParams } from './useRouter.utils';

// TODO: REFACTOR, CLEAN-UP + OPTIMISE !!!!!
// TODO: CLEAN + *GREATLY* SIMPLIFY THESE !!

let r = 0;

export const useRouterLoader = () => {
  // log('__A - useRouter()', 'yellow', r++);

  const state = useGlobal();
  const paramsRouter = useParams();
  const pathname = window.location.pathname;

  const routerLoader = async (): Promise<RouterCurrent> => {
    const { PATH_BASE } = getPathBase();
    // const PATH_HOME = cleanRoutePath(`${PATH_BASE}/${isAdminPath() ? config.PATH_HOME_ADMIN : config.PATH_HOME_WEB}`);

    const isRoot = !!matchPath({ path: PATH_BASE }, pathname);
    const match = !isRoot
      ? matchPath({ path: `${PATH_BASE}/:basePath/*` }, pathname)
      : matchPath({ path: `${PATH_BASE}/:basePath` }, pathname) || { basePath: null };

    // TODO: FIX !!!
    const matchParams = (match as PathMatch<'*' | 'cat' | 'parent' | 'basePath'>)?.params;
    type PathBaseMatch = Params<'*' | 'cat' | 'parent'> | Params<'basePath'> | { basePath: null };
    const basePath = isUserPath() ? 'account/registros' : ((match as any)?.cat ?? (match as any)?.basePath);

    const slug = getPathSlug(location.pathname);

    // log('__LOADER', 'orange', { pathname, paramsRouter });
    // log('__LOADER', 'magenta', { slug, slugMatch, basePath, matchParams });

    // INIT META ARRAY ======================================================== //

    const metaCats: CatMeta[] = state.metaCats;
    const metaRoutes: RouteConfig[] = state.metaRoutes;

    // ======================================================================== //
    // (return): ============================================================== //
    // ======================================================================== //

    // return useMemo(() => {
    const { routeMeta, catMeta, paramsCustom } = await getRoutePathParams({
      pathname,
      slug,
      metaRoutes,
      metaCats,
      state: state as unknown as GlobalStore,
      isUserPath: isUserPath(),
    });

    // CATEGORY ============================================================= //

    if (catMeta?.parent && typeof catMeta.parent === 'string') {
      const parent = metaCats?.find((cat: CatMeta) => cat.slug === (catMeta?.parent as unknown as string));
      parent && Object.assign(catMeta, { parent });
    }

    // FROM LOCATION ======================================================== //

    const fromLocation = getFromLocation({
      location: location as unknown as LocationWithState,
      metaRoutes,
      paramsCustom,
    });

    if ('from' in paramsCustom && (!paramsCustom?.from || paramsCustom.from === '/undefined')) {
      if (fromLocation) {
        Object.assign(paramsCustom, { from: fromLocation });
      } else {
        delete paramsCustom.from;
      }
    }

    // CLEAN-UP: ID, SLUG, NEW ============================================== //

    for (const param of Object.keys(paramsCustom)) {
      const key = param as keyof ParamsCustom;
      if (!paramsCustom[key] && paramsCustom[key] !== false) delete paramsCustom[key];
    }
    // FIX (not sure why this is present):
    if ('*' in paramsRouter) delete (paramsRouter as { [key: string]: unknown })['*'];
    // NEW ENTRY ??
    if (paramsCustom?.new === false) delete paramsCustom.new;
    // if (pathname.endsWith('/new') || pathname.endsWith('/register') || pathname.endsWith('/registration')) {
    if (pathname.endsWith('/new') || pathname.endsWith('/register')) {
      paramsCustom.new = true;
      delete paramsCustom.id;
    }

    // ACTION =============================================================== //

    const action = getRouteAction({ location: location as unknown as LocationWithState, paramsCustom });

    const routerCurrent: RouterCurrent = {
      PATH_BASE,
      // PATH_HOME,
      isAdminPath: isAdminPath(),
      isUserPath: isUserPath(),
      basePath,
      pathname,
      params: {
        ...paramsCustom,
        ...paramsRouter,
      },
      slug: routeMeta?.slug || slug,
      action,
      location,
      fromLocation,
      navigateTo: (href: string) => {
        window.location.href = href;
      },
      route: routeMeta,
      category: catMeta as CatMeta,
    };

    return routerCurrent;
  };

  return { routerLoader };
};
