import type { FC, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Box, Flex } from 'styled-system/jsx';
import { Button } from 'components/Button';
import { callout, card } from 'styled-system/recipes';

import { ExclamationTriangleIcon, ReloadIcon } from 'styles/icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AdminErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box p={6} style={{ minHeight: '400px' }}>
      <div className={card({ size: 'lg' })} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Flex direction="column" gap={4} align="center" p={6}>
          <ExclamationTriangleIcon width="48" height="48" color="red" />

          <h2>Something went wrong</h2>

          <span>
            An error occurred while loading this admin page. This might be due to navigation timing issues or
            component errors.
          </span>

          <div className={callout({ status: 'error' })} role="alert" style={{ width: '100%' }}>
            <ExclamationTriangleIcon />
            <span>
              <strong>Error:</strong> {error?.message || 'Unknown error'}
            </span>
          </div>

          <Flex gap={3} mt={4}>
            <Button onClick={resetErrorBoundary} variant="outline" color="info">
              <ReloadIcon width="16" height="16" />
              Try Again
            </Button>

            <Button onClick={handleReload} variant="outline">
              Reload Page
            </Button>
          </Flex>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', width: '100%' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                <span>Show Error Details (Dev Mode)</span>
              </summary>
              <Box p={3} style={{ background: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{error?.stack}</pre>
              </Box>
            </details>
          )}
        </Flex>
      </div>
    </Box>
  );
};

export const AdminErrorBoundary: FC<Props> = ({ children, fallback }) => {
  if (fallback) {
    return <ErrorBoundary fallbackRender={() => fallback}>{children}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary
      FallbackComponent={AdminErrorFallback}
      onError={(error, errorInfo) => {
        console.error('AdminErrorBoundary caught an error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
