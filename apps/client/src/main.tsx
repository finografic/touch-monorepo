import '@fino/globals';

import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18n/i18n-init';
import 'i18n/locale';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import PersistQueryClientProvider from 'providers/QueryClientProvider/PersistQueryClientProvider';
import { RouteMetadataProvider } from 'routes/providers/RouteMetadataProvider';
// import ErrorBoundary from './ErrorBoundary';
// import QueryClientProvider from 'providers/QueryClientProvider';

const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    {/* <QueryClientProvider> */}
    <PersistQueryClientProvider>
      <I18nextProvider i18n={i18n}>
        <HelmetProvider context={helmetContext}>
          <RouteMetadataProvider>
            <App />
          </RouteMetadataProvider>
        </HelmetProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
    {/* </QueryClientProvider> */}
    {/* </ErrorBoundary> */}
  </React.StrictMode>,
);
