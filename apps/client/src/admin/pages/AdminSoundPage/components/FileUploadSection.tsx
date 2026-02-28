import React, { useCallback, useRef, useState } from 'react';

import { Flex } from 'styled-system/jsx';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { useUploadSoundFiles } from 'queries/sounds';

import type { SoundType } from 'types/sounds.types';
import { UploadIcon } from 'styles/icons';

interface FileUploadSectionProps {
  soundType: SoundType;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({ soundType }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadSoundFiles();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);

      try {
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('files', file));

        await uploadMutation.mutateAsync({ soundType, formData });

        toast({
          variant: 'success',
          message: 'Files uploaded successfully!',
          subText: `${files.length} file(s) added to your sound library`,
        });
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Upload failed',
          subText: 'Please try again with valid audio files',
        });
      } finally {
        setIsUploading(false);
        event.target.value = '';
      }
    },
    [uploadMutation, toast, soundType],
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Flex direction="column" gap="3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        disabled={isUploading || uploadMutation.isPending}
      />
      <Button
        size="md"
        variant="outline"
        disabled={isUploading || uploadMutation.isPending}
        onClick={handleUploadClick}
      >
        <UploadIcon />
        {isUploading || uploadMutation.isPending ? 'Uploading...' : 'Choose Sound Files'}
      </Button>

      <span>Supported formats: MP3, WAV, AIFF. Max file size: 10MB per file.</span>
    </Flex>
  );
};
