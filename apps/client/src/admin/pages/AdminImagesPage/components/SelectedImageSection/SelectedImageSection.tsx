import React, { useCallback } from 'react';

import { Box, Flex } from 'styled-system/jsx';
import { Button } from '@finografic/design-system/components';
import { FieldBox } from '@finografic/design-system/forms';
import { SelectCustom } from 'forms/SelectCustom';
import { useToast } from 'components/Toast';

import { useUpdateImageSettings } from 'queries/images';

import type { ImageCategory, ImageFile, ImageSettings } from 'types/images.types';
import { ExternalLink } from 'lucide-react';

import { getImageFilePublicUrl } from 'utils/imageUrls';
import { styles } from './SelectedImageSection.styles';

interface SelectedImageSectionProps {
  imageFiles: ImageFile[];
  imageSettings: ImageSettings;
  imageCategory: ImageCategory;
}

export const SelectedImageSection: React.FC<SelectedImageSectionProps> = ({
  imageFiles,
  imageSettings,
  imageCategory,
}) => {
  const { toast } = useToast();
  const updateSettingsMutation = useUpdateImageSettings();

  const handleSelection = useCallback(
    async (fileId: string | null) => {
      try {
        const newSettings = { ...imageSettings, [imageCategory]: fileId };

        await updateSettingsMutation.mutateAsync(newSettings);

        const selectedFile = imageFiles.find((file) => file.id === fileId);
        if (selectedFile) {
          toast({
            variant: 'success',
            message: `${imageCategory} image updated`,
            subText: `Now using: ${selectedFile.name}`,
          });
        }
      } catch {
        toast({
          variant: 'error',
          message: 'Failed to update image settings',
          subText: 'Please try again',
        });
      }
    },
    [imageSettings, imageFiles, updateSettingsMutation, toast, imageCategory],
  );

  const openPreview = useCallback(
    (fileId: string) => {
      const imageFile = imageFiles.find((file) => file.id === fileId);
      if (!imageFile?.filePath) return;

      window.open(getImageFilePublicUrl(imageFile.filePath), '_blank', 'noopener,noreferrer');
    },
    [imageFiles],
  );

  const label = imageCategory === 'product' ? 'Product image' : 'Label image';

  return (
    <div css={styles} className="image-configuration-section">
      <Flex direction="column" gap={3}>
        <Flex gap={4} align="center" className="image-config-row">
          <Box className="image-select-container" pb={5}>
            <FieldBox name="image-selector" label={label}>
              <SelectCustom
                value={imageSettings[imageCategory] || 'none'}
                onSelect={(value) => handleSelection(value === 'none' ? null : value)}
                disabled={updateSettingsMutation.isPending}
                placeholder={`Select ${imageCategory} image...`}
                options={[
                  { value: 'none', label: 'None' },
                  ...imageFiles.map((file) => ({
                    value: file.id,
                    label: file.name,
                  })),
                ]}
              />
            </FieldBox>
          </Box>
          {imageSettings[imageCategory] && (
            <Flex pt={5} gap={3} align="center">
              {(() => {
                const selected = imageFiles.find((file) =>
                  file.id === imageSettings[imageCategory]
                );
                const src = selected?.filePath
                  ? getImageFilePublicUrl(selected.filePath)
                  : undefined;

                return src
                  ? (
                    <img
                      src={src}
                      alt=""
                      style={{
                        maxHeight: '5rem',
                        maxWidth: '8rem',
                        objectFit: 'contain',
                        borderRadius: 8,
                      }}
                    />
                  )
                  : null;
              })()}
              <Button
                size="md"
                variant="outline"
                palette="success"
                onClick={() => openPreview(imageSettings[imageCategory]!)}
                className="preview-button"
              >
                <ExternalLink className="icon-speaker" size={18} aria-hidden />
                Open
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
