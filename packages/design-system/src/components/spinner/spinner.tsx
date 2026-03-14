import { LoaderIcon } from '@workspace/icons';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import { spinnerRecipe } from './spinner.recipe';

interface SpinnerProps extends ComponentPropsWithoutRef<'svg'> {
  /** Icon size in px. Default: 20 */
  size?: number;
}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(({ size = 20, className, ...props }, ref) => {
  return (
    <LoaderIcon
      ref={ref}
      width={size}
      height={size}
      className={className ? `${spinnerRecipe()} ${className}` : spinnerRecipe()}
      {...props}
    />
  );
});

Spinner.displayName = 'Spinner';

export type { SpinnerProps };
export { Spinner };
