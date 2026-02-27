import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  fluid?: boolean;
}

const Container = forwardRef<ElementRef<'div'>, ContainerProps>(
  ({ fluid, className, ...props }, ref) => (
    <div
      ref={ref}
      className={['ds-container', className].filter(Boolean).join(' ')}
      data-fluid={fluid || undefined}
      {...props}
    />
  ),
);

Container.displayName = 'Container';

export type { ContainerProps };
export { Container };
