import type { FC } from 'react';
import { useContent } from 'providers/ContentProvider';

export const ThemeDebug: FC = () => {
  const { theme, toggleTheme } = useContent();

  // Get computed CSS variable values
  const getComputedValue = (variable: string) => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(variable);
    }
    return 'N/A';
  };

  // Test direct background change
  const testDirectBackground = () => {
    if (theme === 'light') {
      document.body.style.backgroundColor = '#0f172a'; // dark background
    } else {
      document.body.style.backgroundColor = '#f8fafc'; // light background
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'var(--color-background)',
        color: 'var(--color-text)',
        padding: '10px',
        border: '1px solid var(--color-grey)',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
      }}
    >
      <div>Current Theme: {theme}</div>
      <div>Background: var(--color-background)</div>
      <div>Background Value: {getComputedValue('--color-background')}</div>
      <div>Text: var(--color-text)</div>
      <div>Text Value: {getComputedValue('--color-text')}</div>
      <div>Data Theme: {document.documentElement.getAttribute('data-theme')}</div>
      <div>Debug Theme: {getComputedValue('--debug-theme')}</div>
      <div>Body BG: {getComputedStyle(document.body).backgroundColor}</div>
      <button onClick={toggleTheme} style={{ marginTop: '5px' }}>
        Toggle Theme
      </button>
      <button onClick={testDirectBackground} style={{ marginTop: '5px', marginLeft: '5px' }}>
        Test Direct BG
      </button>
    </div>
  );
};
