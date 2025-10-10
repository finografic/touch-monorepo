import React, { useEffect, useState } from 'react';
import { Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminModePage.styles';
import { useGetModes } from 'queries/modes';
import { SelectCustom } from 'forms/SelectCustom';
import { useToast } from 'components/Toast';

// Storage key for default mode
const DEFAULT_MODE_STORAGE_KEY = 'touch-monorepo.default-mode';

export const AdminModeBasicPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedModeId, setSelectedModeId] = useState<string>('');

  // API hooks
  const { data: modes = [], isLoading: isLoadingModes } = useGetModes();

  // Transform modes into dropdown options
  const modeOptions = modes.map((mode) => ({
    value: mode.id,
    label: mode.name,
  }));

  // Load saved default mode on component mount
  useEffect(() => {
    const savedModeId = localStorage.getItem(DEFAULT_MODE_STORAGE_KEY);
    if (savedModeId) {
      setSelectedModeId(savedModeId);
    }
  }, []);

  // Handle mode selection
  const handleModeSelect = (modeId: string) => {
    setSelectedModeId(modeId);

    // Save to localStorage
    localStorage.setItem(DEFAULT_MODE_STORAGE_KEY, modeId);

    // Find the selected mode name for toast
    const selectedMode = modes.find((mode) => mode.id === modeId);

    toast({
      variant: 'success',
      message: 'Default mode updated!',
      subText: `Default mode set to: ${selectedMode?.name || 'Unknown'}`,
    });
  };

  // Clear default mode
  const handleClearMode = () => {
    setSelectedModeId('');
    localStorage.removeItem(DEFAULT_MODE_STORAGE_KEY);

    toast({
      variant: 'info',
      message: 'Default mode cleared',
      subText: 'No default mode is currently set',
    });
  };

  if (isLoadingModes) {
    return (
      <section css={styles} className="admin-content-page">
        <AdminContentLayout title="Mode Selection (BASIC)" subtitle="Select default mode for the system">
          <Flex direction="column" gap="4" align="center" justify="center" p="6">
            <Spinner size="3" />
            <Text>Loading available modes...</Text>
          </Flex>
        </AdminContentLayout>
      </section>
    );
  }

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout title="Mode Selection (BASIC)" subtitle="Select default mode for the system">
        <AdminSection
          title="Default Mode Configuration"
          description="Choose the default mode that will be used when no specific mode is selected"
          // variant="border-solid"
        >
          <Flex direction="column" gap="4" align="start">
            <Flex direction="column" gap="2" style={{ width: '100%', maxWidth: '400px' }}>
              <Text size="3" weight="medium">
                Select Default Mode
              </Text>
              <SelectCustom
                className="mode-select"
                options={modeOptions}
                placeholder="Choose a default mode..."
                value={selectedModeId}
                onSelect={handleModeSelect}
              />
            </Flex>

            {selectedModeId && (
              <Flex direction="column" gap="2">
                <Text size="2" color="gray">
                  Current default mode:{' '}
                  <Text weight="medium">{modes.find((m) => m.id === selectedModeId)?.name}</Text>
                </Text>
                <Button variant="outline" size="2" color="red" onClick={handleClearMode}>
                  Clear Default Mode
                </Button>
              </Flex>
            )}

            {!selectedModeId && (
              <Text size="2" color="gray">
                No default mode is currently set
              </Text>
            )}
          </Flex>
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
