import { createRouter } from 'lib/create-app';
// Use file manager approach instead of SDK import/export to avoid file merging issues
// import * as handlers from './ui-labels.handlers.inlang';
import * as handlers from './ui-labels.handlers';
import * as routes from './ui-labels.routes';

export default createRouter().openapi(routes.list, handlers.list).openapi(routes.save, handlers.save);
