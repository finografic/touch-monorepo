import React from 'react';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { DropdownMenu } from '@radix-ui/themes';

import type { NavItem } from 'types/nav.types';
import { styles } from './MoreMenu.styles';
import { useTranslation } from 'react-i18next';

interface MoreButtonProps {
  items: NavItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  activePath?: string;
  className?: string;
  displayIcons?: boolean;
}

export const MoreMenu: React.FC<MoreButtonProps> = ({
  items,
  isOpen = false,
  onOpenChange,
  onNavigate,
  activePath,
  className = '',
  displayIcons = false,
}) => {
  const { t } = useTranslation();

  return (
    <div css={styles}>
      <DropdownMenu.Root open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger>
          <button type="button" className={`nav-button more-button ${className}`}>
            {t('ui.buttons.more')}
            <ChevronDownIcon
              width="16"
              height="16"
              style={{ marginLeft: '0.25rem', transition: 'transform 0.2s' }}
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={`more-dropdown ${className}`}>
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={activePath === item.path ? 'active' : ''}
            >
              {displayIcons && item.icon && (
                <item.icon width="16" height="16" style={{ marginRight: '0.5rem' }} />
              )}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
