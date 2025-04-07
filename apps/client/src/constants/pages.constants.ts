import { ROUTES } from './routes.constants';

type PageTitles = {
  [K in (typeof ROUTES)[keyof typeof ROUTES]]: string;
};

export const PAGE_TITLES: PageTitles = {
  [ROUTES.HOME]: 'ServiFresc',
  [ROUTES.BEVERAGE_TYPE]: 'Select drink type:',
  [ROUTES.BEVERAGE_VOLUME]: 'Select volume:',
  [ROUTES.FINAL_TEMPERATURE]: 'Temperatura final:',
  [ROUTES.CONTAINER_TYPE]: 'Seleccione tipo de envase:',
  [ROUTES.INITIAL_TEMPERATURE]: 'Temperatura inicial:',
};
