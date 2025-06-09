import React, { type ReactNode } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { styles } from './ErrorBoundary.styles';

const ErrorFallback: React.FC = () => {
  const error = useRouteError();

  let errorMessage: string;
  let errorStack: string | undefined;
  let errorComponentStack: string | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Unknown error';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack;
    errorComponentStack = (error as any).componentStack;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unknown error occurred';
  }

  return (
    <div role="alert" css={styles}>
      <h1>Oops! Something went wrong</h1>
      <p>{errorMessage}</p>
      {errorStack && (
        <details>
          <summary>Error Details</summary>
          <pre>{errorStack}</pre>
        </details>
      )}
      {errorComponentStack && (
        <details>
          <summary>Component Stack</summary>
          <pre>{errorComponentStack}</pre>
        </details>
      )}
      <Link to="/">Go back to main page</Link>
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
);
