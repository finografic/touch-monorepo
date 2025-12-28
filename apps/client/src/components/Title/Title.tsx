import React from 'react';

import { useTranslation } from 'react-i18next';
import { Heading, Text } from '@radix-ui/themes';
import clsx from 'clsx';

import type { Align, Theme } from 'types/ui.types';
import type { TitleHeadingProps } from './Title.types';
import { isTranslationKey, translatePageKey } from 'utils/i18n/i18n.helpers-V1';

import { styles } from './Title.styles';
import { useAuth } from 'providers/AuthProvider';

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
  as = 'header',
  ...headingProps
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const role = user?.role;

  title = isTranslationKey(title) ? translatePageKey({ t, key: title, role }) : title;
  subtitle = isTranslationKey(subtitle) ? translatePageKey({ t, key: subtitle, role }) : subtitle;
  description = isTranslationKey(description) ? translatePageKey({ t, key: description, role }) : description;

  const AsWrapperElement = as;

  return (
    <div css={styles}>
      <AsWrapperElement className={clsx('title-wrapper', className, { align })}>
        <Heading size="8" className="title" align={align} {...headingProps}>
          {title}
          {subtitle && <span className="title-subtitle"> : {subtitle}</span>}
        </Heading>
        {description && (
          <div className="title-description">
            <Text>{description}</Text>
          </div>
        )}
      </AsWrapperElement>
    </div>
  );
};
