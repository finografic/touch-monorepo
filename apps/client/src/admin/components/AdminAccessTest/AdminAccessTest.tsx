import React from 'react';

import { useAuth } from 'providers/AuthProvider/AuthContext';

/**
 * Simple component to test role-based access [Claude v3.5]
 */
export const AdminAccessTest = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem' }}>
        <h3>🔒 Not Authenticated</h3>
        <p>Please log in to see role information.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem' }}>
      <h3>👤 User Information</h3>
      <p>
        <strong>Name:</strong> {user?.name}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Role:</strong> {user?.role}
      </p>
      <p>
        <strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}
      </p>

      {isAdmin && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.5rem',
            backgroundColor: '#e8f5e8',
            border: '1px solid #4caf50',
          }}
        >
          <h4>🎉 Admin Access Granted!</h4>
          <p>You have access to admin features.</p>
        </div>
      )}

      {!isAdmin && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.5rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
          }}
        >
          <h4>⚠️ Limited Access</h4>
          <p>You have regular user access only.</p>
        </div>
      )}
    </div>
  );
};
