import { ROUTES } from '../routes/routes.constants';

type PageTitles = {
  [K in (typeof ROUTES)[keyof typeof ROUTES]]: string;
};

export const PAGE_TITLES: PageTitles = {
  [ROUTES.HOME]: 'ServiFresc',
  [ROUTES.DRINK_TYPE]: 'Select drink type:',
  [ROUTES.DRINK_VOLUME]: 'Select volume:',
  [ROUTES.FINAL_TEMPERATURE]: 'Temperatura final:',
  [ROUTES.CONTAINER_TYPE]: 'Seleccione tipo de envase:',
  [ROUTES.INITIAL_TEMPERATURE]: 'Temperatura inicial:',
};
