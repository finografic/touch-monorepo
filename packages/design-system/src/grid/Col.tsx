import { ComponentPropsWithoutRef, forwardRef } from 'react';

type ColSpan = number | 'content';

interface ColProps extends ComponentPropsWithoutRef<'div'> {
  xs?: ColSpan;
  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
  xxl?: ColSpan;
}

const Col = forwardRef<HTMLDivElement, ColProps>(
  ({ xs, sm, md, lg, xl, xxl, className, ...props }, ref) => {
    const classes = [
      'ds-col',
      xs != null && `ds-col-xs-${xs}`,
      sm != null && `ds-col-sm-${sm}`,
      md != null && `ds-col-md-${md}`,
      lg != null && `ds-col-lg-${lg}`,
      xl != null && `ds-col-xl-${xl}`,
      xxl != null && `ds-col-xxl-${xxl}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <div ref={ref} className={classes} {...props} />;
  },
);

Col.displayName = 'Col';

export type { ColProps };
export { Col };
