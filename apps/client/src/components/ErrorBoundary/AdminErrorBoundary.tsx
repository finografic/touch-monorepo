import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';
import { Box, Button, Callout, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('AdminErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    // Clear error state and reload
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  handleRetry = () => {
    // Just clear the error state to retry rendering
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for admin section
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p="6" style={{ minHeight: '400px' }}>
          <Card size="3" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Flex direction="column" gap="4" align="center" p="6">
              <ExclamationTriangleIcon width="48" height="48" color="red" />

              <Heading size="6" align="center" color="red">
                Something went wrong
              </Heading>

              <Text size="3" align="center" color="gray">
                An error occurred while loading this admin page. This might be due to navigation timing issues
                or component errors.
              </Text>

              <Callout.Root color="red" style={{ width: '100%' }}>
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>
                  <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
                </Callout.Text>
              </Callout.Root>

              <Flex gap="3" mt="4">
                <Button onClick={this.handleRetry} variant="soft" color="blue">
                  <ReloadIcon width="16" height="16" />
                  Try Again
                </Button>

                <Button onClick={this.handleReload} variant="outline">
                  Reload Page
                </Button>
              </Flex>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details style={{ marginTop: '1rem', width: '100%' }}>
                  <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                    <Text size="2" color="gray">
                      Show Error Details (Dev Mode)
                    </Text>
                  </summary>
                  <Box p="3" style={{ background: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
                    <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                      {this.state.error?.stack}
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </Box>
                </details>
              )}
            </Flex>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}
