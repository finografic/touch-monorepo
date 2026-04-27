import React, { useCallback } from 'react';

import { Box, Grid, GridItem } from 'styled-system/jsx';
import { callout } from '@styled-system/recipes';
import { useToast } from 'components/Toast';

import { useRemoveImageFile } from 'queries/images';

import type { ImageCategory, ImageFile, ImageSettings } from 'types/images.types';
import { getImageFilePublicUrl } from 'utils/imageUrls';
import { ImageLibraryCard } from './ImageLibraryCard';
import { styles } from './ImagesLibrarySection.styles';

interface ImageLibrarySectionProps {
  imageFiles: ImageFile[];
  imageSettings: ImageSettings;
  imageCategory: ImageCategory;
}

export const ImageLibrarySection: React.FC<ImageLibrarySectionProps> = ({
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

  return (
    <div css={styles}>
      <Grid columns={4} gap="6" className="test-library-grid">
        {
          /* <GridItem colSpan={2} className="test-library-item">
          <Box h="20" />
        </GridItem>
        <GridItem colSpan={1} className="test-library-item">
          <Box h="20" />
        </GridItem>
        <GridItem colSpan={1} className="test-library-item">
          <Box h="20" />
        </GridItem> */
        }
        {imageFiles.map((file) => (
          <GridItem key={file.id}>
            <ImageLibraryCard
              file={file}
              imageSettings={imageSettings}
              imageCategory={imageCategory}
              openPreview={openPreview}
              removeFile={removeFile}
              removeMutation={removeMutation}
            />
          </GridItem>
        ))}
      </Grid>

      {imageFiles.length === 0
        ? (
          <div className={callout({ status: 'info' })} role="alert">
            <span>No image files uploaded yet. Upload some files to get started!</span>
          </div>
        )
        : (
          <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={2} className="image-library-list">
            {
              /* {imageFiles.map((file) => (
              <GridItem key={file.id}>
                <ImageLibraryCard
                  file={file}
                  imageSettings={imageSettings}
                  imageCategory={imageCategory}
                  openPreview={openPreview}
                  removeFile={removeFile}
                  removeMutation={removeMutation}
                />
              </GridItem>
            ))} */
            }
          </Grid>
        )}
    </div>
  );
};
