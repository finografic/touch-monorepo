import type { ComponentPropsWithoutRef, CSSProperties, ElementRef } from 'react';
import { forwardRef } from 'react';

interface RowProps extends ComponentPropsWithoutRef<'div'> {
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'wrap' | 'nowrap' | 'reverse';
  nogutter?: boolean;
  gutterWidth?: number;
}

const Row = forwardRef<ElementRef<'div'>, RowProps>(
  ({ align, justify, direction, wrap, nogutter, gutterWidth, className, style, ...props }, ref) => {
    const combinedStyle: CSSProperties =
      gutterWidth != null
        ? ({ '--ds-grid-gutter': `${gutterWidth}px`, ...style } as CSSProperties)
        : (style ?? {});

    return (
      <div
        ref={ref}
        data-component="___ROW___"
        className={['ds-row', className].filter(Boolean).join(' ')}
        data-align={align}
        data-justify={justify}
        data-direction={direction}
        data-wrap={wrap}
        data-nogutter={nogutter || undefined}
        style={combinedStyle}
        {...props}
      />
    );
  },
);

Row.displayName = 'Row';

export type { RowProps };
export { Row };
