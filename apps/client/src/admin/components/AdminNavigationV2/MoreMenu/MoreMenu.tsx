import React from 'react';
import { useTranslation } from 'react-i18next';

import { Menu } from '@workspace/design-system/components';

import type { NavItem } from 'types/nav.types';
import { ChevronDownIcon } from '@workspace/design-system/icons';
import { styles } from './MoreMenu.styles';

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
      <Menu.Root open={isOpen} onOpenChange={({ open }) => onOpenChange(open)}>
        <Menu.Trigger asChild>
          <button type="button" className={`nav-button more-button ${className}`}>
            {t('ui.buttons.more')}
            <ChevronDownIcon
              width="16"
              height="16"
              style={{ marginLeft: '0.25rem', transition: 'transform 0.2s' }}
            />
          </button>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content className={`more-dropdown ${className}`}>
            {items.map((item) => (
              <Menu.Item
                key={item.id}
                value={item.id}
                onClick={() => onNavigate(item.path)}
                className={activePath === item.path ? 'active' : ''}
              >
                <Menu.ItemText>
                  {displayIcons && item.icon && (
                    <item.icon width="16" height="16" style={{ marginRight: '0.5rem' }} />
                  )}
                  {item.label}
                </Menu.ItemText>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>
  );
};
