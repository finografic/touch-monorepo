import React from 'react';
import type { FC, ReactNode } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DataDialog } from 'components/DataDialog/DataDialog';
import { ContentProvider } from 'providers/ContentProvider';
import { styles } from './Layout.styles';
// import { Suspense } from 'react';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet, useLoaderData, useMatches, useRouteLoaderData } from 'react-router-dom';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';
// import { DataLayer } from 'layout/DataLayer';
import { DevProvider } from 'providers/DevProvider/DevProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { useRouteMetadata } from 'routes/providers/RouteMetadataContext';
import { OrderFieldKeys } from 'constants/app.config';
import type { OrderFieldKey } from 'types/orders.types';

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  // const { routes } = useRouteMetadata();

  const matches = useMatches();
  const routeMatch = matches.find(
    (match) => match.id && Object.values(OrderFieldKeys).includes(match.id as OrderFieldKey),
  );
  const currentFieldKey = routeMatch?.id as OrderFieldKey | undefined;

  // const route = routes.find((route) => route.path === currentFieldKey);
  const isMounted: boolean = !!useIsMounted();

  // const loaderData = useRouteLoaderData(currentFieldKey || 'root');

  // log('LOADER_DATA - route', 'red', route);

  if (!isMounted) {
    return <Loader message="Loading..." />;
  }

  return (
    <React.Fragment>
      <OrdersProvider>
        <PaginationProvider>
          <ContentProvider>
            <LayoutUiProvider>
              <DevProvider>
                {/* <DataLayer> */}
                <div id="layout" css={styles}>
                  <Header />
                  <main>
                    <div className="main-content">
                      {/* <Suspense fallback={<Loader message="Loading..." />}> */}
                      <Outlet />

                      {/* </Suspense> */}
                      <DataDialog />
                    </div>
                  </main>
                  <Footer />
                </div>
                {/* </DataLayer> */}
              </DevProvider>
            </LayoutUiProvider>
          </ContentProvider>
        </PaginationProvider>
      </OrdersProvider>
    </React.Fragment>
  );
};
