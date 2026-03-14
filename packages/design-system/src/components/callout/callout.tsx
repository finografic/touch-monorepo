import { forwardRef, type HTMLAttributes } from 'react';

import { calloutRecipe } from './callout.recipe';
import type { CalloutVariants } from './callout.types';

export type CalloutProps = CalloutVariants & HTMLAttributes<HTMLDivElement>;

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ status, className, children, ...props }, ref) => {
    const cls = calloutRecipe({ status });
    return (
      <div ref={ref} role="alert" className={className ? `${cls} ${className}` : cls} {...props}>
        {children}
      </div>
    );
  },
);

Callout.displayName = 'Callout';
