import type { AuthUser } from 'auth';
import type { LoaderFunction, RouteObject } from 'react-router-dom';
import type { GlobalStoreValues } from 'store/GlobalSchema.types';
import { LayoutContent } from 'layout/LayoutContent';

import cloneDeep from 'lodash/cloneDeep';
import NotFound from 'pages/NotFound';
import { getAdminRoutes } from 'routes/admin/getAdminRoutes';
// ROUTES:
import { getPublicRoutes } from 'routes/public/getPublicRoutes';
import { getUserRoutes } from 'routes/user/getUserRoutes';
// import { getAuthRoutes } from './auth/getAuthRoutes';

export const getAppRoutes = ({
  user,
  store,
  routerLoader,
}: {
  user: AuthUser;
  store: GlobalStoreValues;
  routerLoader: LoaderFunction<unknown>;
}): RouteObject[] => {
  const appRoutes = [
    {
      id: 'base',
      path: '/',
      loader: routerLoader,
      element: <LayoutContent />,
      children: [
        ...getPublicRoutes({ store }),
        ...getUserRoutes({ store, user }),
        ...getAdminRoutes({ store, user }),
        { path: '*', element: <NotFound /> },
      ],
    },
  ];

  return cloneDeep(appRoutes);
};
