import { ErrorBoundary } from 'react-error-boundary';

import type { ReactNode } from 'react';

export default function ({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div>
          There was an error! (ROOT)<pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
