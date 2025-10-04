import '@workspace/core';
import './index.css';

// radix css styles
import '@radix-ui/themes/styles.css'; // Removed - conflicts with custom theme
// import '@radix-ui/themes/layout.css';
// import '@radix-ui/themes/components.css';

// local css styles
// import './styles/radix-ui/radix.css'; // Custom Radix styles without color conflicts
// import './styles/radix-ui/index.css';
// import './styles/radix-ui/base.css';
// import './styles/radix-ui/components.css';
// import './styles/radix-ui/dialog.css';
// import './styles/radix-ui/radix-dialog.css';
import './styles/radix-ui/overrides.css';
import './styles/icons/icons.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from './i18n.config.ts';

import { I18nextProvider } from 'react-i18next';
import App from './App';
import PersistQueryClientProvider from 'providers/QueryClientProvider/PersistQueryClientProvider';
import { RouteMetadataProvider } from 'routes/providers/RouteMetadataProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider>
      <I18nextProvider i18n={i18n}>
        <RouteMetadataProvider>
          <App />
        </RouteMetadataProvider>
      </I18nextProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>,
);
