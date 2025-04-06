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
        <div css={styles}>
          <main>
            <Header />
            <div className="main-content">
              <Outlet />
            </div>
            <Footer />
          </main>
        </div>
      </PaginationProvider>
    </OrdersProvider>
  );
};
