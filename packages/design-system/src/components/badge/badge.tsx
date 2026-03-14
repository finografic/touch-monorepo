import { forwardRef, type HTMLAttributes } from 'react';

import { badgeRecipe } from './badge.recipe';
import type { BadgeVariants } from './badge.types';

export interface BadgeProps extends BadgeVariants, HTMLAttributes<HTMLSpanElement> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, colorScheme, size, className, children, ...props }, ref) => {
    const cls = badgeRecipe({ variant, colorScheme, size });
    return (
      <span ref={ref} className={className ? `${cls} ${className}` : cls} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
