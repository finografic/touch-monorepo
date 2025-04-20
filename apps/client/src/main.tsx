import './globals';

import React from 'react';
import ReactDOM from 'react-dom/client';
import QueryClientProvider from 'providers/QueryClientProvider';
import i18n from 'i18next';
import 'i18n/i18n-init';
import 'i18n/locale';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { App } from './App';

const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider>
      <I18nextProvider i18n={i18n}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </I18nextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
