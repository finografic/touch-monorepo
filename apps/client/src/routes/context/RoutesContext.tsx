import type { RoutesContextValues } from './RoutesContext.types';
import { createContext, useContext } from 'react';

export const RoutesContext = createContext<RoutesContextValues>({ routes: [], isInitialized: false });

export const useRoutes = () => useContext(RoutesContext);
