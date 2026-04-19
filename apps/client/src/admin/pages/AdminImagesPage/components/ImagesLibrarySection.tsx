import React, { useCallback } from 'react';

import { Flex } from 'styled-system/jsx';
import { callout } from '@styled-system/recipes';
import { Button } from '@finografic/design-system/components';
import { useToast } from 'components/Toast';

import { useRemoveImageFile } from 'queries/images';

import type { ImageCategory, ImageFile, ImageSettings } from 'types/images.types';
import { getImageFilePublicUrl } from 'utils/imageUrls';
import { BadgeCheckIcon } from '@finografic/icons';
import { ImageIcon } from 'lucide-react';

interface ImagesLibrarySectionProps {
  imageFiles: ImageFile[];
  imageSettings: ImageSettings;
  imageCategory: ImageCategory;
}

export const ImagesLibrarySection: React.FC<ImagesLibrarySectionProps> = ({
  imageFiles,
  imageSettings,
  imageCategory,
}) => {
  const { toast } = useToast();
  const removeMutation = useRemoveImageFile();

  const openPreview = useCallback(
    (fileId: string) => {
      const imageFile = imageFiles.find((file) => file.id === fileId);
      if (!imageFile?.filePath) return;

      window.open(getImageFilePublicUrl(imageFile.filePath), '_blank', 'noopener,noreferrer');
    },
    [imageFiles],
  );

  const removeFile = useCallback(
    async (fileId: string) => {
      try {
        await removeMutation.mutateAsync({ category: imageCategory, id: fileId });
        toast({
          variant: 'success',
          message: 'File removed',
          subText: 'Image deleted from library',
        });
      } catch {
        toast({
          variant: 'error',
          message: 'Failed to remove file',
          subText: 'Please try again',
        });
      }
    },
    [removeMutation, toast, imageCategory],
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
      {imageFiles.length === 0
        ? (
          <div className={callout({ status: 'info' })} role="alert">
            <span>No image files uploaded yet. Upload some files to get started!</span>
          </div>
        )
        : (
          <Flex direction="column" gap={2} className="sound-library-list">
            {imageFiles.map((file) => (
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
                  <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                    {imageSettings[imageCategory] === file.id && (
                      <BadgeCheckIcon className="icon-check" />
                    )}
                  </div>

                  {file.filePath
                    ? (
                      <img
                        src={getImageFilePublicUrl(file.filePath)}
                        alt=""
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: 'cover',
                          borderRadius: 8,
                          flexShrink: 0,
                        }}
                      />
                    )
                    : null}

                  <Flex direction="column" gap={1} style={{ flex: 1 }}>
                    <span>{file.name}</span>
                    <span>
                      {formatFileSize(file.size)} • {file.type} •{' '}
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </Flex>

                  <Flex gap={2}>
                    <Button size="sm" variant="outline" onClick={() => openPreview(file.id)}>
                      <ImageIcon size={16} aria-hidden />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      palette="danger"
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
