import { ScreenClassProvider } from 'react-grid-system';
import { Global } from '@emotion/react';
import { cssGlobal } from 'styles/global.css';
import { RouterProvider } from 'react-router-dom';
import { router } from 'routes/router';

export function App() {
  return (
    <ScreenClassProvider>
      <Global styles={cssGlobal} />
      <RouterProvider router={router} />
    </ScreenClassProvider>
  );
}
