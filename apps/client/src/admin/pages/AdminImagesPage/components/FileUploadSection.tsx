import React, { useCallback, useRef, useState } from 'react';

import { Flex } from 'styled-system/jsx';
import { Button } from '@finografic/design-system/components';
import { useToast } from 'components/Toast';

import { useUploadImageFiles } from 'queries/images';

import type { ImageCategory } from 'types/images.types';
import { UploadIcon } from '@finografic/icons';

interface FileUploadSectionProps {
  imageCategory: ImageCategory;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({ imageCategory }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImageFiles();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);

      try {
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('files', file));

        await uploadMutation.mutateAsync({ category: imageCategory, formData });

        toast({
          variant: 'success',
          message: 'Files uploaded successfully!',
          subText: `${files.length} file(s) added to your image library`,
        });
      } catch {
        toast({
          variant: 'error',
          message: 'Upload failed',
          subText: 'Use PNG, JPEG, WebP, GIF, or SVG up to 10MB each',
        });
      } finally {
        setIsUploading(false);
        event.target.value = '';
      }
    },
    [uploadMutation, toast, imageCategory],
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Flex direction="column" gap={3}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
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
        {isUploading || uploadMutation.isPending ? 'Uploading...' : 'Choose image files'}
      </Button>

      <span>Supported formats: PNG, JPEG, WebP, GIF, SVG. Max file size: 10MB per file.</span>
    </Flex>
  );
};
