// import type { RouteConfig } from 'routes/routes.types';

export interface RouterCurrent {
  PATH_BASE: string;
  // basePath: string;
  pathname: string;
  params: {
    [key: string]: any; // Adjust the type based on the actual structure of paramsCustom and paramsRouter
  };
  slug: string | undefined;
  location: Location; // Adjust the type if location has a specific type
  // fromLocation: RouteConfig; // Adjust the type if fromLocation has a specific type
  navigateTo: (href: string) => void;
  // route: RouteConfig; // Adjust the type if routeMeta has a specific type
}
