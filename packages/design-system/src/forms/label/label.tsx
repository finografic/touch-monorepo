import { forwardRef, type LabelHTMLAttributes } from 'react';

import { labelRecipe } from './label.recipe';
import type { LabelVariants } from './label.types';

export type LabelProps = LabelVariants & LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size, className, children, ...props }, ref) => {
    const cls = labelRecipe({ size });
    return (
      <label ref={ref} className={className ? `${cls} ${className}` : cls} {...props}>
        {children}
      </label>
    );
  },
);

Label.displayName = 'Label';
