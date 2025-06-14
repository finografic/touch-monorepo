// import 'packages/globals/src';
import '@workspace/globals';
import './i18n.config';

import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'src/i18n.config';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import PersistQueryClientProvider from 'providers/QueryClientProvider/PersistQueryClientProvider';
import { RouteMetadataProvider } from 'routes/providers/RouteMetadataProvider';
// import ErrorBoundary from './ErrorBoundary';

const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    <PersistQueryClientProvider>
      <I18nextProvider i18n={i18n}>
        <HelmetProvider context={helmetContext}>
          <RouteMetadataProvider>
            <App />
          </RouteMetadataProvider>
        </HelmetProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
    {/* </ErrorBoundary> */}
  </React.StrictMode>,
);
