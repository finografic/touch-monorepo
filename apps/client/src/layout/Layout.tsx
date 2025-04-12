import { Outlet } from 'react-router-dom';
import { styles } from './Layout.styles';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DevPanel } from 'layout/DevPanel/DevPanel';

export const Layout = () => {
  return (
    <OrdersProvider>
      <PaginationProvider>
        <div id="layout" css={styles}>
          <Header />
          <main>
            <div className="main-content">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
        <DevPanel />
      </PaginationProvider>
    </OrdersProvider>
  );
};
