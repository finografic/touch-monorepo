import React, { type ReactNode, useState } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { styles } from './ErrorBoundary.styles';

const ErrorFallback: React.FC = () => {
  const error = useRouteError();
  const [copied, setCopied] = useState(false);
  const timestamp = new Date().toLocaleString();

  let errorName: string | undefined;
  let errorMessage: string;
  let errorStack: string | undefined;
  let errorComponentStack: string | undefined;
  let errorData: any;

  if (isRouteErrorResponse(error)) {
    errorName = `RouteErrorResponse (${error.status})`;
    errorMessage = error.statusText || error.data?.message || 'Unknown error';
    errorData = error.data;
  } else if (error instanceof Error) {
    errorName = error.name;
    errorMessage = error.message;
    errorStack = error.stack;
    errorComponentStack = (error as any).componentStack;
    errorData = (error as any).data;
  } else if (typeof error === 'string') {
    errorName = 'StringError';
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    errorName = error.constructor?.name || 'UnknownObjectError';
    errorMessage = JSON.stringify(error);
    errorData = error;
  } else {
    errorName = 'UnknownError';
    errorMessage = 'An unknown error occurred';
  }

  // Helper to copy error details
  const handleCopy = () => {
    const details = [
      `Time: ${timestamp}`,
      `Name: ${errorName}`,
      `Message: ${errorMessage}`,
      errorStack ? `Stack:\n${errorStack}` : '',
      errorComponentStack ? `Component Stack:\n${errorComponentStack}` : '',
      errorData ? `Data:\n${JSON.stringify(errorData, null, 2)}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div role="alert" css={styles}>
      <h1>Oops! Something went wrong (router)</h1>
      <p style={{ color: 'gray', fontSize: '0.95em' }}>Time: {timestamp}</p>
      <p>
        <strong>{errorName}</strong>: {errorMessage}
      </p>
      {errorStack && (
        <details open>
          <summary>Error Stack</summary>
          <pre>{errorStack}</pre>
        </details>
      )}
      {errorComponentStack && (
        <details>
          <summary>Component Stack</summary>
          <pre>{errorComponentStack}</pre>
        </details>
      )}
      {errorData && (
        <details>
          <summary>Error Data</summary>
          <pre>{JSON.stringify(errorData, null, 2)}</pre>
        </details>
      )}
      <button onClick={handleCopy} style={{ margin: '1em 0', padding: '0.5em 1em' }}>
        {copied ? 'Copied!' : 'Copy error details'}
      </button>
      <br />
      <Link to="/">Go back to main page</Link>
      {/* DEV ONLY: Show full error JSON */}
      {process.env.NODE_ENV === 'development' && error && (
        <details style={{ marginTop: '1em' }}>
          <summary>Raw Error Object (dev only)</summary>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </details>
      )}
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
);
