import React, { useCallback, useState } from 'react';

import { Dialog, Flex, IconButton, Tabs, VisuallyHidden } from '@radix-ui/themes';
import clsx from 'clsx';
import { Button } from 'components/Button';
import type { DialogConfig } from 'components/Dialog/GenericDialog.types';
import { useAppConfig } from 'providers/AppConfigProvider';

import { CloseIcon } from 'styles/icons';
import { styles } from './GenericDialog.styles';

interface GenericDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: DialogConfig;
  className?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

export const GenericDialog: React.FC<GenericDialogProps> = ({
  isOpen,
  onClose,
  config,
  className,
  defaultTab,
  onTabChange,
}) => {
  const { theme: appTheme } = useAppConfig();
  const [activeTab, setActiveTab] = useState(defaultTab || config.tabs[0]?.id || '');

  const hasTabs = config.tabs.length > 1;
  const currentTab = config.tabs.find((tab) => tab.id === activeTab) || config.tabs[0];

  const theme = {
    appearance: appTheme as 'light' | 'dark', // Use app theme instead of hardcoded dark
    scaling: '100%' as const,
    ...(config.theme ?? {}),
  };

  // Create dynamic styles for max width/height constraints
  const dynamicStyles = {
    ...(config.maxWidth && { maxWidth: config.maxWidth }),
    ...(config.maxHeight && { maxHeight: config.maxHeight }),
    ...(config.minWidth && { minWidth: config.minWidth }),
    ...(config.minHeight && { minHeight: config.minHeight }),
  };

  // Get the portal container element
  const portalContainer = document.getElementById('radix-portal-container') || document.body;

  // Object.assign(config, { title: 'TEST TITLE', subtitle: 'TEST SUBTITLE' });

  const hasTitle = config.title;
  const hasSubtitle = config.subtitle;
  const hasDescription = config.description;

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      onTabChange?.(tab);
    },
    [activeTab, onTabChange],
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content
        size={config.size || '4'}
        className={clsx('dialog-content', `theme-${appTheme}`, className)}
        css={styles}
        style={dynamicStyles}
        container={portalContainer}
      >
        {/* DIALOG HEADER =========================================================== */}

        <div className={clsx('dialog-header', { 'has-title': hasTitle })}>
          {hasTitle ? (
            <Flex display="flex" justify="between" align="center">
              <Dialog.Title size="5">
                {config.title} <span className="subtitle">{config.subtitle}</span>
              </Dialog.Title>
              <IconButton className="close-button" variant="ghost" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Flex>
          ) : (
            <Flex display="flex" justify="end" align="center" style={{ position: 'absolute', zIndex: 99999 }}>
              <VisuallyHidden>
                <Dialog.Title />
              </VisuallyHidden>
              <IconButton className="close-button" variant="ghost" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Flex>
          )}
          {/* Accessible description for screen readers */}
          <Dialog.Description
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            {config.title} -{' '}
            {hasTabs ? 'Navigate between tabs to access different sections' : 'Dialog content'}
          </Dialog.Description>
        </div>

        {/* DIALOG TABBED CONTENT ========================================== */}

        <div className="dialog-main">
          {hasTabs ? (
            <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
              <Tabs.List>
                {config.tabs.map((tab) => (
                  <Tabs.Trigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                    {tab.icon ? tab.icon : null} {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              <div className="dialog-content">
                {config.tabs.map((tab) => (
                  <Tabs.Content key={tab.id} value={tab.id}>
                    {tab.content}
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>
          ) : (
            <div className="dialog-content" style={{ marginTop: '1.5rem' }}>
              {currentTab?.content}
            </div>
          )}
        </div>

        {/* FOOTER ========================================================= */}

        {config.footer && (
          <div className="footer">
            <Flex justify="end" gap="4" width="100%">
              {config.footer.secondaryButton && (
                <Button
                  variant="outline"
                  color="default"
                  size="lg"
                  fullWidth={config.footer.secondaryButton && !config.footer.primaryButton}
                  onClick={config.footer.secondaryButton.onClick}
                >
                  A: {config.footer.secondaryButton.label}
                </Button>
              )}

              {config.footer.primaryButton && (
                <Button
                  variant="outline"
                  color="default"
                  fullWidth={config.footer.primaryButton && !config.footer.secondaryButton}
                  size="lg"
                  onClick={config.footer.primaryButton.onClick}
                >
                  B: {config.footer.primaryButton.label}
                </Button>
              )}
            </Flex>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
