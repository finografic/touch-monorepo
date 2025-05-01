import type { FC } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DevDialog } from 'components/DevDialog/DevDialog';
import { PageContentProvider } from 'providers/PageContentProvider/PageContentProvider';
import { styles } from './Layout.styles';
import { Suspense } from 'react';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet } from 'react-router-dom';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';

export const Layout: FC = () => {
  const isMounted: boolean = !!useIsMounted();

  if (!isMounted) {
    return <Loader message="Loading..." />;
  }

  return (
    <OrdersProvider>
      <PaginationProvider>
        <PageContentProvider>
          <div id="layout" css={styles}>
            <Header />
            <main>
              <div className="main-content">
                <Suspense fallback={<Loader message="Loading..." />}>
                  <Outlet />
                </Suspense>
                <DevDialog />
              </div>
            </main>
            <Footer />
          </div>
        </PageContentProvider>
      </PaginationProvider>
    </OrdersProvider>
  );
};
