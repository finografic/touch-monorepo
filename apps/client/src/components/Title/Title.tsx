import React from 'react';

import { Heading, Text } from '@radix-ui/themes';
import clsx from 'clsx';

import type { Align, Theme } from 'types/ui.types';

import type { TitleHeadingProps } from './Title.types';
import { styles } from './Title.styles';

interface TitleProps extends Partial<TitleHeadingProps> {
  title?: string | undefined;
  subtitle?: string | undefined;
  description?: string | undefined;
  align?: Align;
  message?: {
    type: 'success' | 'error' | 'warning' | 'info';
    content: string;
  };
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  description,
  align = 'left',
  message,
  isLoading = false,
  error,
  className,
  ...headingProps
}) => {
  return (
    <div css={styles}>
      <header className={clsx('title-wrapper', className, { align })}>
        <Heading size="8" className="title" align={align} {...headingProps}>
          {title}
          {subtitle && (
            <span className="title-subtitle" style={{ opacity: 0.4 }}>
              {' '}
              : {subtitle}
            </span>
          )}
        </Heading>
        {description && (
          <div className="title-description">
            <Text>{description}</Text>
          </div>
        )}
      </header>
    </div>
  );
};
