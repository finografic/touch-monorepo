import { Hono } from 'hono';
import temperatureRoutes from './temperature.routes';

const router = new Hono();

router.route('/', temperatureRoutes);

export default router;
