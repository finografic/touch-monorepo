import { type FC, type PropsWithChildren, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export interface DataLayerContext {
  isMounted: boolean;
}

/**
 * DataLayer component that provides a stable context for data initialization
 * and prevents state updates during unmounting/transitions
 */
export const DataLayer: FC<PropsWithChildren> = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return <div data-layer="page-data">{/* <Outlet context={{ isMounted }} /> */}</div>;
};
