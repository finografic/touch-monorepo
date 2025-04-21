import '@radix-ui/themes/styles.css';
// import 'styles/radix-ui/radix.css';

import { ScreenClassProvider } from 'react-grid-system';
import { Theme as RadixTheme } from '@radix-ui/themes';
import { Global } from '@emotion/react';
import { cssGlobal } from 'styles/global.styles';
import { RouterProvider } from 'react-router-dom';
import { router } from 'routes/router';
import { PaginationProvider } from './providers/PaginationProvider/PaginationProvider';
import { OrdersProvider } from './providers/OrdersProvider/OrdersProvider';

export function App() {
  return (
    <ScreenClassProvider>
      <Global styles={cssGlobal} />
      <RadixTheme>
        <OrdersProvider>
          <PaginationProvider>
            <RouterProvider router={router} />
          </PaginationProvider>
        </OrdersProvider>
      </RadixTheme>
    </ScreenClassProvider>
  );
}
