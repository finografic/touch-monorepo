import { ROUTES } from 'routes/routes.constants';

export type PagePathname = (typeof ROUTES)[keyof typeof ROUTES];
