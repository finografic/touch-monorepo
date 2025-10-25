import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContentProvider } from 'providers/ContentProvider';

import '@testing-library/jest-dom/vitest';

import { ThemeToggleButton } from './ThemeToggleButton';

// Mock the icon components
vi.mock('styles/icons', () => ({
  MoonIcon: () => <div data-testid="moon-icon">Moon</div>,
  SunIcon: () => <div data-testid="sun-icon">Sun</div>,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ContentProvider>{children}</ContentProvider>
);

describe('themeToggle', () => {
  it('renders sun icon in dark mode', () => {
    render(
      <TestWrapper>
        <ThemeToggleButton />
      </TestWrapper>,
    );
    // Sun icon should be visible initially; moon should not
    expect(screen.getByTestId('sun-icon')).toBeTruthy();
    expect(screen.queryByTestId('moon-icon')).toBeFalsy();
  });

  it('toggles theme when clicked', () => {
    render(
      <TestWrapper>
        <ThemeToggleButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // After clicking, should show moon icon and hide sun icon
    expect(screen.getByTestId('moon-icon')).toBeTruthy();
    expect(screen.queryByTestId('sun-icon')).toBeFalsy();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <ThemeToggleButton />
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
    expect(button.getAttribute('title')).toBe('Switch to dark mode');
  });
});
