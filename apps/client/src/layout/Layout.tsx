import { Outlet } from 'react-router-dom';
import { styles } from './Layout.styles';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { PageContentProvider } from 'providers/PageContentProvider/PageContentProvider';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DevDialog } from 'components/DevDialog/DevDialog';
import { DevPanel } from './DevPanel/DevPanel';
import type { FC } from 'react';
// import { DevPanel } from 'layout/DevPanel/DevPanel';

export const Layout: FC = () => {
  return (
    <OrdersProvider>
      <PaginationProvider>
        <PageContentProvider>
          <div id="layout" css={styles}>
            <Header />
            <main>
              <div className="main-content">
                <Outlet />
              </div>
            </main>
            <Footer />
          </div>
          <DevDialog />
          <DevPanel />
        </PageContentProvider>
      </PaginationProvider>
    </OrdersProvider>
  );
};
