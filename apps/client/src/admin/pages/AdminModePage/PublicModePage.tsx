import React, { useEffect, useState } from 'react';

import { Flex } from 'styled-system/jsx';
import { AdminPageLayout, AdminSection } from 'admin/components';
import { FieldWrapper } from 'forms/FieldWrapper';
import { SelectCustom } from 'forms/SelectCustom';
import { useToast } from 'components/Toast';

import { useGetModes, useUpdateDefaultMode } from 'queries/modes';

import { styles } from './AdminModePage.styles';

export const PublicModePage: React.FC = () => {
  const { toast } = useToast();
  const [defaultModeId, setDefaultModeId] = useState<string>('');

  const { data: modes = [], isLoading: isLoadingModes } = useGetModes();
  const updateDefaultModeMutation = useUpdateDefaultMode();

  const modeOptions = modes
    .filter((mode) => mode.isActive)
    .map((mode) => ({
      value: mode.id,
      label: mode.name,
    }));

  useEffect(() => {
    const defaultMode = modes.find((mode) => mode.isDefault);
    if (defaultMode) {
      setDefaultModeId(defaultMode.id);
    }
  }, [modes]);

  // Handle default mode selection
  const handleModeSelect = (modeId: string) => {
    const previousModeId = defaultModeId;
    const selectedMode = modes.find((mode) => mode.id === modeId);

    setDefaultModeId(modeId);

    updateDefaultModeMutation.mutate(
      { modeId },
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

  return (
    <AdminPageLayout
      title={'admin.pages.mode_public.title'}
      description={'admin.pages.mode_public.description'}
      isLoading={isLoadingModes}
      styles={styles}
    >
      <AdminSection
        description={
          defaultModeId
            ? `Current default mode: ${modes.find((m) => m.id === defaultModeId)?.name}`
            : 'No default mode is currently set'
        }
        variant="border-solid"
      >
        <Flex align="start" justify="space-between">
          <Flex direction="column" gap={4} align="start">
            <Flex direction="column" gap={2} style={{ minWidth: '260px' }}>
              <FieldWrapper>
                <SelectCustom
                  className="mode-select"
                  options={modeOptions}
                  placeholder="Choose a default mode..."
                  value={defaultModeId}
                  onSelect={handleModeSelect}
                  allowEmpty={true}
                />
              </FieldWrapper>
            </Flex>
          </Flex>
          <Flex gap={8} align="start" style={{ fontSize: '0.9rem', width: '100%', maxWidth: '400px' }}></Flex>
        </Flex>
      </AdminSection>
    </AdminPageLayout>
  );
};
