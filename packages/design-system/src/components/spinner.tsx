import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { forwardRef } from 'react';

import { icons } from '../icons';

interface SpinnerProps extends ComponentPropsWithoutRef<'svg'> {
  /** Icon size in px. Default: 20 */
  size?: number;
}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(({ size = 20, style, ...props }, ref) => {
  const combinedStyle: CSSProperties = { animation: 'spin 1s linear infinite', ...style };

  return (
    <icons.LoaderIcon
      ref={ref}
      width={size}
      height={size}
      style={combinedStyle}
      {...props}
    />
  );
});

Spinner.displayName = 'Spinner';

export type { SpinnerProps };
export { Spinner };
