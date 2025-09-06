import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ContentProvider } from 'providers/ContentProvider';

// Mock the icon components
jest.mock('styles/icons', () => ({
  MoonIcon: () => <div data-testid="moon-icon">Moon</div>,
  SunIcon: () => <div data-testid="sun-icon">Sun</div>,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ContentProvider>{children}</ContentProvider>
);

describe('ThemeToggle', () => {
  it('renders sun icon in dark mode', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>,
    );

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // After clicking, should show moon icon (light mode)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
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
