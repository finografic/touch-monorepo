import '@fino/globals';

import React from 'react';
import ReactDOM from 'react-dom/client';
import QueryClientProvider from 'providers/QueryClientProvider';
import i18n from 'i18n/i18n-init';
import 'i18n/locale';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import { RoutesProvider__V1 } from 'routes/context/RoutesProvider';
// import ErrorBoundary from './ErrorBoundary';
// import { DevProvider } from 'providers/DevProvider/DevProvider';

const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider>
      {/* <ErrorBoundary> */}
      <I18nextProvider i18n={i18n}>
        <HelmetProvider context={helmetContext}>
          <RoutesProvider__V1>
            <App />
          </RoutesProvider__V1>
        </HelmetProvider>
      </I18nextProvider>
      {/* </ErrorBoundary> */}
    </QueryClientProvider>
  </React.StrictMode>,
);
