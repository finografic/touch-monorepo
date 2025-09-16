import React from 'react';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { AdminContentLayout } from '../shared';
import { useGetModes, useUpdateMode } from 'queries/modes';
import { SelectSimple } from 'forms/SelectSimple';
import { styles } from './AdminModePage.styles';
import { useToast } from 'components/Toast';

export const AdminModePage: React.FC = () => {
  const { t } = useTranslation();
  const { data: modes, isLoading: modesLoading } = useGetModes();
  const updateModeMutation = useUpdateMode();
  const { toast } = useToast();

  // Mode selection handler
  const handleModeChange = async (modeId: string) => {
    try {
      // First, set all modes to not default
      const updatePromises = modes?.map((mode) => {
        if (mode.id !== modeId && mode.isDefault) {
          return updateModeMutation.mutateAsync({
            id: mode.id,
            updates: { isDefault: false },
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Then set the selected mode as default
      await updateModeMutation.mutateAsync({
        id: modeId,
        updates: { isDefault: true },
      });

      toast({ variant: 'success', message: 'Mode updated successfully!' });
    } catch (error) {
      console.error('Failed to update mode:', error);
      toast({ variant: 'error', message: 'Failed to update mode. Please try again.' });
    }
  };

  // Get current default mode
  const defaultMode = modes?.find((mode) => mode.isDefault);
  const modeOptions = modes?.map((mode) => ({ value: mode.id, label: mode.name })) || [];

  // Create options array for SelectSimple (using labels as display values)
  const selectOptions = modeOptions.map((option) => ({ value: option.label, label: option.label }));
  const getModeIdFromLabel = (label: string) => {
    const mode = modeOptions.find((opt) => opt.label === label);
    return mode?.value;
  };

  return (
    <section css={styles} id="admin-slot-config">
      <AdminContentLayout title="Mode Selection">
        <Box className="admin-slot-config">
          <Flex direction="column" gap="6">
            {/* App mode selection */}
            <Heading size="8" mb="0">
              Mode Selection
            </Heading>
            <Card size="3" variant="surface">
              <Flex gap="1" justify="start">
                <Flex direction="column" gap="4" className="mode-select-container">
                  <Text size="2" color="gray">
                    Default mode
                  </Text>
                  {modesLoading ? (
                    <Text size="2">Loading modes...</Text>
                  ) : (
                    <SelectSimple
                      className="mode-select"
                      options={selectOptions}
                      value={defaultMode ? defaultMode.name : ''}
                      onSelect={(label) => {
                        const modeId = getModeIdFromLabel(label as string);
                        if (modeId) {
                          handleModeChange(modeId);
                        }
                      }}
                    />
                  )}
                </Flex>
                <Flex align="center" justify="start" gap="1" className="mode-value">
                  {defaultMode && (
                    <Text size="2" color="sky" mt="6">
                      Modo actual: <strong>{defaultMode.name}</strong>
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </Box>
      </AdminContentLayout>
    </section>
  );
};
