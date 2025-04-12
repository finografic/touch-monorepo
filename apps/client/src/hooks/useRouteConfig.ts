import { useLocation } from 'react-router-dom';
import { ROUTE_CONFIG } from 'constants/routes.config';
import { ROUTES } from 'constants/routes.constants';

export const useRouteConfig = () => {
  const { pathname } = useLocation();
  const routeConfig = ROUTE_CONFIG[pathname] || ROUTE_CONFIG[ROUTES.HOME];

  return routeConfig;

  // return {
  //   title: config.title,
  //   // We can add more properties here as needed
  // };
};
