import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContentProvider } from 'providers/ContentProvider';

import '@testing-library/jest-dom/vitest';

import { ThemeToggle } from './ThemeToggle';

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
        <ThemeToggle />
      </TestWrapper>,
    );

    // Sun icon should be visible initially; moon should not
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // After clicking, should show moon icon and hide sun icon
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
  });
});
