import React, { useCallback } from 'react';

import { ListBox } from 'primereact/listbox';
import { Flex } from 'styled-system/jsx';
import { useToast } from 'components/Toast';

import { useUpdateSoundSettings } from 'queries/sounds';

import type { SoundFile, SoundSettings, SoundType } from 'types/sounds.types';

interface ListBoxSelectProps {
  soundSettings: SoundSettings;
  soundType: SoundType;
  soundFiles: SoundFile[];
}

export const ListBoxSelect: React.FC<ListBoxSelectProps> = ({ soundSettings, soundType, soundFiles }) => {
  const { toast } = useToast();
  const updateSettingsMutation = useUpdateSoundSettings();

  // Handle sound selection
  const handleSoundSelection = useCallback(
    async (fileId: string | null) => {
      try {
        const newSettings = { ...soundSettings, [soundType]: fileId };

        await updateSettingsMutation.mutateAsync(newSettings);

        const selectedFile = soundFiles.find((file) => file.id === fileId);
        if (selectedFile) {
          toast({
            variant: 'success',
            message: `${soundType} sound updated`,
            subText: `Now using: ${selectedFile.name}`,
          });
        }
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Failed to update sound settings',
          subText: 'Please try again',
        });
      }
    },
    [soundSettings, soundFiles, updateSettingsMutation, toast, soundType],
  );

  return (
    <Flex
      direction="column"
      gap={4}
      align="center"
      style={{ width: '100%', fontSize: '1.5rem', fontWeight: '600', padding: '2rem' }}
    >
      <ListBox
        value={soundSettings[soundType] || 'none'}
        onChange={(e) => handleSoundSelection(e.value)}
        options={[
          { value: 'none', label: 'None' },
          ...soundFiles.map((file) => ({
            value: file.id,
            label: file.name,
          })),
        ]}
        optionLabel="label"
        style={{ width: '100%' }}
      />
    </Flex>
  );
};
