import { Spinner, Theme as RadixTheme } from '@radix-ui/themes';

/**
 * Fallback shown during initial router hydration.
 * Includes minimal styling context to match app theme.
 */
export const HydrateLoader = () => (
  <RadixTheme>
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner size="3" />
    </div>
  </RadixTheme>
);
