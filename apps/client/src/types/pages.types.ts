import { ROUTES } from 'constants/routes.constants';

export type PagePathname = (typeof ROUTES)[keyof typeof ROUTES];
