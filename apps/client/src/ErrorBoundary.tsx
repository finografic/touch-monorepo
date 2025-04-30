import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function ({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div>
          There was an error! <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
