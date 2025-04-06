import { Outlet } from 'react-router-dom';
import { styles } from './Layout.styles';
import { OrdersProvider } from '../providers/OrdersProvider';

export const Layout = () => {
  return (
    <OrdersProvider>
      <div css={styles}>
        <main>
          <Outlet />
        </main>
      </div>
    </OrdersProvider>
  );
};
