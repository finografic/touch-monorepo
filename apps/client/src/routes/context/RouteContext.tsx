import type { RouteContextValues } from './RouteContext.types';
import { createContext, useContext } from 'react';

export const RouteContext = createContext<RouteContextValues>({ routes: [], isInitialized: false });

export const useRoutes = () => useContext(RouteContext);
