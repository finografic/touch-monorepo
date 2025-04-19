// import { useEffect } from 'react';
// import { useOrders } from '../OrdersProvider';
import type { PageContentProviderProps } from './PageContent.types';
import { PageContentContext as PageContent } from './PageContentContext';
import { DISPLAY_NAME } from './PageContentContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ROUTES } from 'routes/routes.config';
// import { useRouteConfig } from '../../hooks/useRouteConfig';

export const PageContentProvider = ({ initialValue, children }: PageContentProviderProps) => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const { orders } = useOrders();
  // const { title } = useRouteConfig();

  // useEffect(() => {
  //   if (orders.length === 0 && location.pathname !== ROUTES.HOME) {
  //     navigate(ROUTES.HOME);
  //   }
  // }, [location.pathname]);

  return <PageContent.Provider initialValue={initialValue}>{children}</PageContent.Provider>;
};

PageContentProvider.displayName = `${DISPLAY_NAME}Provider`;
