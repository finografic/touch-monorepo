import React, { useCallback } from 'react';

import { Flex } from 'styled-system/jsx';
import { callout } from 'styled-system/recipes';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { useRemoveSoundFile } from 'queries/sounds';

import { playSoundByPath } from 'utils/soundCache.utils';
import type { SoundFile, SoundSettings, SoundType } from 'types/sounds.types';
import { BadgeCheckIcon, SpeakerLoudIcon } from '@workspace/icons';

interface SoundLibrarySectionProps {
  soundFiles: SoundFile[];
  soundSettings: SoundSettings;
  soundType: SoundType;
}

export const SoundLibrarySection: React.FC<SoundLibrarySectionProps> = ({
  soundFiles,
  soundSettings,
  soundType,
}) => {
  const { toast } = useToast();
  const removeMutation = useRemoveSoundFile();

  // Test sound playback using file path
  const testSound = useCallback(
    async (fileId: string) => {
      try {
        const soundFile = soundFiles.find((file) => file.id === fileId);
        if (!soundFile || !soundFile.filePath) {
          throw new Error('Sound file not found or missing file path');
        }

        await playSoundByPath(soundFile.filePath);
        toast({
          variant: 'success',
          message: 'Sound played successfully',
          subText: 'Check your audio settings if you cannot hear it',
        });
      } catch (error) {
        console.error('Error playing sound:', error);
        toast({
          variant: 'error',
          message: 'Could not play sound',
          subText: 'Check browser permissions or try again',
        });
      }
    },
    [soundFiles, toast],
  );

  // Remove file
  const removeFile = useCallback(
    async (fileId: string) => {
      try {
        await removeMutation.mutateAsync({ soundType, id: fileId });
        toast({
          variant: 'success',
          message: 'File removed',
          subText: 'Sound file deleted from library',
        });
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Failed to remove file',
          subText: 'Please try again',
        });
      }
    },
    [removeMutation, toast],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <>
      {soundFiles.length === 0 ? (
        <div className={callout({ status: 'info' })} role="alert">
          <span>No sound files uploaded yet. Upload some files to get started!</span>
        </div>
      ) : (
        <Flex direction="column" gap={2} className="sound-library-list">
          {soundFiles.map((file) => (
            <div
              className="sound-library-item"
              key={file.id}
              style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: 'white',
              }}
            >
              <Flex justify="space-between" align="center" gap={3}>
                {/* Checkmark Column - Fixed Width */}
                <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                  {soundSettings[soundType] === file.id && <BadgeCheckIcon className="icon-check" />}
                </div>

                {/* Content Column - Takes remaining space */}
                <Flex direction="column" gap={1} style={{ flex: 1 }}>
                  <span>{file.name}</span>
                  <span>
                    {formatFileSize(file.size)} • {file.type} •{' '}
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </Flex>

                <Flex gap={2}>
                  <Button size="sm" variant="outline" onClick={() => testSound(file.id)}>
                    <SpeakerLoudIcon className="icon-speaker" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    color="danger"
                    onClick={() => removeFile(file.id)}
                    disabled={removeMutation.isPending}
                  >
                    {removeMutation.isPending ? 'Removing...' : 'Remove'}
                  </Button>
                </Flex>
              </Flex>
            </div>
          ))}
        </Flex>
      )}
    </>
  );
};
