import { ROUTES } from 'routes/routes.config';

export type PagePathname = (typeof ROUTES)[keyof typeof ROUTES];
