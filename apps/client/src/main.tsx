import '@workspace/core';
import './index.css';
import '@radix-ui/themes/styles.css';
// import 'styles/radix-ui/radix.css';
import './styles/icons/icons.css';
// import './styles/radix-ui/radix-dialog.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from './i18n.config.ts';

import { I18nextProvider } from 'react-i18next';
import App from './App';
import PersistQueryClientProvider from 'providers/QueryClientProvider/PersistQueryClientProvider';
import { RouteMetadataProvider } from 'routes/providers/RouteMetadataProvider';
// import ErrorBoundary from './ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    <PersistQueryClientProvider>
      <I18nextProvider i18n={i18n}>
        <RouteMetadataProvider>
          <App />
        </RouteMetadataProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
    {/* </ErrorBoundary> */}
  </React.StrictMode>,
);
