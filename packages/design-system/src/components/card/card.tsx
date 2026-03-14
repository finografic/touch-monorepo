import { forwardRef, type HTMLAttributes } from 'react';

import { cardRecipe } from './card.recipe';
import type { CardVariants } from './card.types';

export type CardProps = CardVariants & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ size, variant, className, children, ...props }, ref) => {
    const cls = cardRecipe({ size, variant });
    return (
      <div ref={ref} className={className ? `${cls} ${className}` : cls} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
