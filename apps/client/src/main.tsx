import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';

import { PrimeReactProvider } from 'primereact/api';

import { PersistQueryClientProvider } from 'providers/QueryClientProvider';
import { RouteMetadataProvider } from 'routes/providers/RouteMetadataProvider';

import 'providers/HeartbeatProvider/heartbeat.store';
import '@workspace/core';

import App from './App';
import i18n from './i18n.config.ts';
import './theme.css';
import 'styled-system/styles.css'; // NOTE: Panda CSS — design-system tokens + recipes + keyframes
import './styles/css/icons.css';
import '@finografic/design-system/grid/grid.css';
import '@finografic/design-system/forms/forms.css';
// import '@finografic/design-system/components/dialog/dialog.css';
// import '@finografic/design-system/components/generic-dialog.css';
// import './styles/css/dialog-V2.css';
import './styles/css/Checkbox.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider>
      <I18nextProvider i18n={i18n}>
        <RouteMetadataProvider>
          <PrimeReactProvider>
            <App />
          </PrimeReactProvider>
        </RouteMetadataProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>,
);
