import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';

import { PrimeReactProvider } from 'primereact/api';

import { PersistQueryClientProvider } from 'providers/QueryClientProvider';
import { RouteMetadataProvider } from 'routes/providers/RouteMetadataProvider';

import 'providers/HeartbeatProvider/heartbeat.store';
import '@workspace/core';

import { primeReactOptions } from 'config/app/primereact.config.ts';
import App from './App';
import i18n from './i18n.config.ts';
import './theme.css';
import '../styled-system/styles.css'; // NOTE: Panda CSS — design-system tokens + recipes
import '@radix-ui/themes/styles.css';
import './styles/radix-ui/overrides.css';
import './styles/icons/icons.css';
import '@workspace/design-system/grid/grid.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider>
      <I18nextProvider i18n={i18n}>
        <RouteMetadataProvider>
          <PrimeReactProvider value={primeReactOptions}>
            <App />
          </PrimeReactProvider>
        </RouteMetadataProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>,
);
