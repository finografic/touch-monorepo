import React from 'react';
import type { FC } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DevDialog } from 'components/DevDialog/DevDialog';
import { ContentProvider } from 'providers/ContentProvider';
import { styles } from './Layout.styles';
// import { Suspense } from 'react';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet } from 'react-router-dom';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';
// import { DataLayer } from 'layout/DataLayer';
import { DevProvider } from 'providers/DevProvider/DevProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';

export const Layout: FC = () => {
  const isMounted: boolean = !!useIsMounted();

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
                <div id="layout" css={styles}>
                  <Header />
                  <main>
                    <div className="main-content">
                      {/* <Suspense fallback={<Loader message="Loading..." />}> */}
                      <Outlet />
                      {/* </Suspense> */}
                      <DevDialog />
                    </div>
                  </main>
                  <Footer />
                </div>
              </DevProvider>
            </LayoutUiProvider>
          </ContentProvider>
        </PaginationProvider>
      </OrdersProvider>
    </React.Fragment>
  );
};
