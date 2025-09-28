import React, { useState } from 'react';
import { Dialog, Flex, IconButton, Tabs, Theme } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAppConfig } from 'providers/AppConfigProvider';
import { styles } from './GenericDialog.styles';
import type { DialogConfig } from 'components/Dialog/GenericDialog.types';
// import { Button } from 'components/ButtonRadix';
import { Button } from 'components/Button';
import clsx from 'clsx';

interface GenericDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: DialogConfig;
  defaultTab?: string;
}

export const GenericDialog: React.FC<GenericDialogProps> = ({ isOpen, onClose, config, defaultTab }) => {
  const { theme: appTheme } = useAppConfig();
  const [activeTab, setActiveTab] = useState(defaultTab || config.tabs[0]?.id || '');

  const hasTabs = config.tabs.length > 1;
  const currentTab = config.tabs.find((tab) => tab.id === activeTab) || config.tabs[0];

  const defaultTheme = {
    appearance: appTheme as 'light' | 'dark', // Use app theme instead of hardcoded dark
    // grayColor: 'slate' as const,
    // accentColor: 'blue' as const,
    // scaling: '100%' as const,
  };

  // console.log('%c __THEME:', 'color:yellow', defaultTheme);
  // console.log('%c __THEME:', 'color:orange', appTheme);

  const theme = { ...defaultTheme, ...config.theme };

  // console.log('%c __THEME:', 'color:lime', theme);

  // Create dynamic styles for max width/height constraints
  const dynamicStyles = {
    ...(config.maxWidth && { maxWidth: config.maxWidth }),
    ...(config.maxHeight && { maxHeight: config.maxHeight }),
    ...(config.minWidth && { minWidth: config.minWidth }),
    ...(config.minHeight && { minHeight: config.minHeight }),
  };

  // Get the portal container element
  const portalContainer = document.getElementById('radix-portal-container') || document.body;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content
        size={config.size || '4'}
        className={clsx('dialog-content', `theme-${appTheme}`)}
        css={styles}
        style={dynamicStyles}
        container={portalContainer}
      >
        {/* Header - Fixed at top */}
        <div className="dialog-header">
          <Flex
            justify="between"
            align="center"
            //  mb="4"
          >
            <Dialog.Title size="5">{config.title}</Dialog.Title>
            <IconButton className="close-button" variant="ghost" onClick={onClose}>
              <Cross2Icon width="20" height="20" />
            </IconButton>
          </Flex>

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

        {/* Content Area - Flexible height */}
        <div className="dialog-content">
          {hasTabs ? (
            /* Multi-tab layout */
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List>
                {config.tabs.map((tab) => (
                  <Tabs.Trigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <div className="tab-content">
                {config.tabs.map((tab) => (
                  <Tabs.Content key={tab.id} value={tab.id}>
                    {tab.content}
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>
          ) : (
            /* Single content layout (no tabs) */
            <div className="single-content">{currentTab?.content}</div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        {config.footer && (
          <div className="footer">
            <Flex justify="end" gap="4" width="100%" id="__ABC__">
              {config.footer.secondaryButton && (
                <Button
                  // variant={config.footer.secondaryButton.variant || 'soft'}
                  // color={config.footer.secondaryButton.color || 'gray'}
                  size="2"
                  onClick={config.footer.secondaryButton.onClick}
                >
                  {config.footer.secondaryButton.label}
                </Button>
              )}

              {config.footer.primaryButton && (
                <Button
                  // variant={config.footer.primaryButton.variant || 'soft'}
                  // color={config.footer.primaryButton.color || 'blue'}
                  size="2"
                  onClick={config.footer.primaryButton.onClick}
                >
                  {config.footer.primaryButton.label}
                </Button>
              )}
            </Flex>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
