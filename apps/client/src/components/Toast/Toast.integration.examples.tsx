/**
 * INTEGRATION EXAMPLES
 *
 * This file shows how to integrate the Toast system into your layouts.
 * Copy the relevant parts to your actual layout files.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastProvider, ToastSystem, useToast } from './index';

// Example 1: AdminLayout with Toast integration
export const AdminLayoutWithToast: React.FC = () => {
  return (
    <ToastProvider>
      <div className="admin-layout">
        {/* Your existing admin layout content */}
        <header>Admin Header</header>
        <nav>Admin Navigation</nav>
        <main>
          <Outlet />
        </main>

        {/* Add Toast system */}
        <ToastSystem />
      </div>
    </ToastProvider>
  );
};

// Example 2: Main Layout with Toast integration
export const MainLayoutWithToast: React.FC = () => {
  return (
    <ToastProvider>
      <div className="main-layout">
        {/* Your existing main layout content */}
        <header>Main Header</header>
        <main>
          <Outlet />
        </main>
        <footer>Footer</footer>

        {/* Add Toast system */}
        <ToastSystem />
      </div>
    </ToastProvider>
  );
};

// Example 3: Usage examples in components
export const ToastUsageExamples: React.FC = () => {
  const { toast } = useToast();

  const handleSuccessAction = () => {
    // Simple success toast with default message
    toast({ variant: 'success' });
  };

  const handleErrorAction = () => {
    // Error toast with custom message and subtext
    toast({
      variant: 'error',
      message: 'Failed to save changes',
      subText: 'Please check your connection and try again',
    });
  };

  const handleWarningAction = () => {
    // Warning toast with action button
    toast({
      variant: 'warning',
      message: 'Unsaved changes',
      subText: 'You have unsaved changes that will be lost',
      action: {
        label: 'Save Now',
        onClick: () => {
          // Handle save action
          toast({ variant: 'success', message: 'Changes saved!' });
        },
      },
    });
  };

  const handleInfoAction = () => {
    // Info toast with custom duration
    toast({
      variant: 'info',
      message: 'System maintenance scheduled',
      subText: 'The system will be unavailable from 2-4 AM',
      duration: 8000, // 8 seconds
    });
  };

  return (
    <div className="toast-examples">
      <h2>Toast Examples</h2>
      <div className="button-group">
        <button onClick={handleSuccessAction}>Show Success Toast</button>
        <button onClick={handleErrorAction}>Show Error Toast</button>
        <button onClick={handleWarningAction}>Show Warning Toast</button>
        <button onClick={handleInfoAction}>Show Info Toast</button>
      </div>
    </div>
  );
};

// Example 4: API integration example
export const ApiWithToastExample: React.FC = () => {
  const { toast } = useToast();

  const saveData = async () => {
    try {
      // Show loading state if needed
      toast({
        variant: 'info',
        message: 'Saving changes...',
        duration: 0, // Don't auto-dismiss
      });

      // Make API call
      await fetch('/api/save', { method: 'POST' });

      // Show success
      toast({
        variant: 'success',
        message: 'Changes saved successfully',
      });
    } catch (error) {
      // Show error
      toast({
        variant: 'error',
        message: 'Failed to save changes',
        subText: error instanceof Error ? error.message : 'Unknown error occurred',
        action: {
          label: 'Retry',
          onClick: saveData, // Retry the operation
        },
      });
    }
  };

  return <button onClick={saveData}>Save Data (with Toast feedback)</button>;
};

/**
 * INTEGRATION STEPS:
 *
 * 1. Wrap your layout with ToastProvider
 * 2. Add <ToastSystem /> component inside the provider
 * 3. Use the useToast hook in any component to show toasts
 * 4. Replace existing toast implementations with the new system
 *
 * USAGE PATTERNS:
 *
 * - Simple: toast({ variant: 'success' })
 * - With message: toast({ variant: 'error', message: 'Custom error' })
 * - With subtext: toast({ variant: 'warning', message: 'Title', subText: 'Details' })
 * - With action: toast({ variant: 'error', message: 'Error', action: { label: 'Retry', onClick: retryFn } })
 * - Custom duration: toast({ variant: 'info', message: 'Info', duration: 10000 })
 */
