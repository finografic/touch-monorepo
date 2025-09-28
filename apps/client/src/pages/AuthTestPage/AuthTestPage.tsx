import React from 'react';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { Button } from 'components/ButtonRadix/Button';
import { styles } from './AuthTestPage.styles';

export const AuthTestPage: React.FC = () => {
  const { user, session, isLoading, isAuthenticated, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div css={styles.container}>
        <h1>Loading authentication state...</h1>
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <h1>Authentication Test Page</h1>

      <div css={styles.section}>
        <h2>Authentication Status</h2>
        <p>
          <strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}
        </p>
        <p>
          <strong>Is Loading:</strong> {isLoading ? '✅ Yes' : '❌ No'}
        </p>
      </div>

      {user && (
        <div css={styles.section}>
          <h2>User Information</h2>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Email Verified:</strong> {user.emailVerified ? '✅ Yes' : '❌ No'}
          </p>
          {user.image && (
            <p>
              <strong>Image:</strong> {user.image}
            </p>
          )}
        </div>
      )}

      {session && (
        <div css={styles.section}>
          <h2>Session Information</h2>
          <pre css={styles.json}>{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}

      <div css={styles.section}>
        <h2>Actions</h2>
        <div css={styles.actions}>
          <Button onClick={handleSignOut} disabled={!isAuthenticated}>
            Sign Out
          </Button>
          <Button onClick={() => (window.location.href = '/login')}>Go to Login</Button>
          <Button onClick={() => (window.location.href = '/admin/login')}>Go to Admin Login</Button>
          <Button onClick={() => (window.location.href = '/dashboard')}>Go to Dashboard</Button>
          <Button onClick={() => (window.location.href = '/admin')}>Go to Admin Panel</Button>
        </div>
      </div>

      <div css={styles.section}>
        <h2>Debug Information</h2>
        <p>
          <strong>Current URL:</strong> {window.location.href}
        </p>
        <p>
          <strong>User Agent:</strong> {navigator.userAgent}
        </p>
        <p>
          <strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? '✅ Yes' : '❌ No'}
        </p>
      </div>
    </div>
  );
};
