import { type HTMLAttributes } from 'react';

import { textRecipe } from './text.recipe';
import type { TextElement, TextVariants } from './text.types';

export type TextProps = TextVariants & HTMLAttributes<HTMLElement> & {
  as?: TextElement;
};

const variantToElement: Record<NonNullable<TextVariants['variant']>, TextElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  overline: 'span',
};

export function Text({ as, variant = 'body', color, truncate, className, children, ...props }: TextProps) {
  const Tag = as ?? variantToElement[variant];
  const cls = textRecipe({ variant, color, truncate });
  return (

    <Tag className={className ? `${cls} ${className}` : cls} {...(props as any)}>
      {children}
    </Tag>
  );
}
