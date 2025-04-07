import { Outlet } from 'react-router-dom';
import { styles } from './Layout.styles';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';

export const Layout = () => {
  return (
    <OrdersProvider>
      <PaginationProvider>
        <main css={styles}>
          <Header />
          <div className="main-content">
            <Outlet />
          </div>
          <Footer />
        </main>
      </PaginationProvider>
    </OrdersProvider>
  );
};
