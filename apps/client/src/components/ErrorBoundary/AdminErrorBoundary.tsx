import type { FC, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Box, Button, Callout, Card, Flex, Heading, Text } from '@radix-ui/themes';

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
    <Box p="6" style={{ minHeight: '400px' }}>
      <Card size="3" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Flex direction="column" gap="4" align="center" p="6">
          <ExclamationTriangleIcon width="48" height="48" color="red" />

          <Heading size="6" align="center" color="red">
            Something went wrong
          </Heading>

          <Text size="3" align="center" color="gray">
            An error occurred while loading this admin page. This might be due to navigation timing issues or
            component errors.
          </Text>

          <Callout.Root color="red" style={{ width: '100%' }}>
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>
              <strong>Error:</strong> {error?.message || 'Unknown error'}
            </Callout.Text>
          </Callout.Root>

          <Flex gap="3" mt="4">
            <Button onClick={resetErrorBoundary} variant="soft" color="blue">
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
                <Text size="2" color="gray">
                  Show Error Details (Dev Mode)
                </Text>
              </summary>
              <Box p="3" style={{ background: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{error?.stack}</pre>
              </Box>
            </details>
          )}
        </Flex>
      </Card>
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
