import React, { useEffect, useState } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../..';
import { useGetModes, useUpdateDefaultMode } from 'queries/modes';
import { SelectCustom } from 'forms/SelectCustom';
import { useToast } from 'components/Toast';
import { styles } from './AdminModePage.styles';

export const AdminModeBasicPage: React.FC = () => {
  const { toast } = useToast();
  const [defaultModeId, setDefaultModeId] = useState<string>('');

  // API hooks
  const { data: modes = [], isLoading: isLoadingModes } = useGetModes();
  const updateDefaultModeMutation = useUpdateDefaultMode();

  // Transform active modes into dropdown options
  const modeOptions = modes
    .filter((mode) => mode.isActive)
    .map((mode) => ({
      value: mode.id,
      label: mode.name,
    }));

  // Load default mode from database on component mount
  useEffect(() => {
    const defaultMode = modes.find((mode) => mode.isDefault);
    if (defaultMode) {
      setDefaultModeId(defaultMode.id);
    }
  }, [modes]);

  // Handle default mode selection
  const handleModeSelect = (modeId: string) => {
    const previousModeId = defaultModeId;

    // Update local state immediately for responsive UI
    setDefaultModeId(modeId);

    // Find the selected mode name for toast
    const selectedMode = modes.find((mode) => mode.id === modeId);

    // Update database
    updateDefaultModeMutation.mutate(
      { defaultModeId: modeId },
      {
        onSuccess: () => {
          toast({
            variant: 'success',
            message: 'Default mode updated!',
            subText: `Default mode set to: ${selectedMode?.name || 'Unknown'}`,
          });
        },
        onError: () => {
          // Revert on error
          setDefaultModeId(previousModeId);
          toast({
            variant: 'error',
            message: 'Failed to update default mode',
            subText: 'Please try again',
          });
        },
      },
    );
  };

  if (isLoadingModes) {
    return (
      <AdminContentLayout
        title="Mode Selection"
        subtitle="User"
        description="Select default mode for the system"
        css={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading available modes...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout title="Mode Selection" description="Select default mode for the system" css={styles}>
      <AdminSection
        title="Default Mode Configuration"
        description="Choose the default mode that will be used when no specific mode is selected"
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
              value={defaultModeId}
              onSelect={handleModeSelect}
            />
          </Flex>

          <Flex direction="column" gap="2">
            {defaultModeId ? (
              <Text size="2" color="gray">
                Current default mode:{' '}
                <Text weight="bold">{modes.find((m) => m.id === defaultModeId)?.name}</Text>
              </Text>
            ) : (
              <Text size="2" color="gray">
                No default mode is currently set
              </Text>
            )}
          </Flex>
        </Flex>
      </AdminSection>
    </AdminContentLayout>
  );
};
