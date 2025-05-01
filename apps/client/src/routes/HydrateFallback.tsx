import { Theme as RadixTheme, Spinner } from '@radix-ui/themes';
import { Global } from '@emotion/react';
import { cssGlobal } from 'styles/global.styles';

/**
 * Fallback shown during initial router hydration.
 * Includes minimal styling context to match app theme.
 */
export const HydrateFallback = () => (
  <>
    <Global styles={cssGlobal} />
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
  </>
);
