import { Outlet } from 'react-router-dom';
import { styles } from './Layout.styles';
import { OrdersProvider } from '../providers/OrdersProvider';
import { PaginationProvider } from '../providers/PaginationProvider/PaginationProvider';

export const Layout = () => {
  return (
    <OrdersProvider>
      <PaginationProvider>
        <div css={styles}>
          <main>
            <Outlet />
          </main>
        </div>
      </PaginationProvider>
    </OrdersProvider>
  );
};
