import { Suspense } from 'react';
import type { FC } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { ContentProvider } from 'providers/ContentProvider';
import { styles } from './Layout.styles';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet } from 'react-router-dom';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';
import { DevProvider } from 'providers/DevProvider/DevProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { DataDialog } from 'components/DataDialog/DataDialog';
import { SessionProvider } from 'providers/SessionProvider';

export const Layout: FC = () => {
  const isMounted: boolean = !!useIsMounted();
  if (!isMounted) {
    return <Loader message="Loading..." />;
  }

  return (
    <SessionProvider>
      <OrdersProvider>
        <PaginationProvider>
          <LayoutUiProvider>
            <ContentProvider>
              <AdminProvider>
                <DevProvider>
                  <div id="layout" css={styles}>
                    <Header />
                    <main>
                      <div className="main-content">
                        <Suspense fallback={<Loader message="Loading..." />}>
                          <Outlet />
                        </Suspense>
                        <DataDialog />
                      </div>
                    </main>
                    <Footer />
                  </div>
                </DevProvider>
              </AdminProvider>
            </ContentProvider>
          </LayoutUiProvider>
        </PaginationProvider>
      </OrdersProvider>
    </SessionProvider>
  );
};
