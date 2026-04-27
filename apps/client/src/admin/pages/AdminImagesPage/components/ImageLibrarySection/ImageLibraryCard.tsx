import React from 'react';

import { Flex } from 'styled-system/jsx';
import { Button } from '@finografic/design-system/components';

import type { ImageCategory, ImageFile, ImageSettings } from 'types/images.types';
import { getImageFilePublicUrl } from 'utils/imageUrls';
import { BadgeCheckIcon } from '@finografic/icons';
import { ImageIcon } from 'lucide-react';
import type { UseMutationResult } from '@tanstack/react-query';
import { styles } from './ImageLibraryCard.styles';

interface ImageLibraryCardProps {
  file: ImageFile;
  imageSettings: ImageSettings;
  imageCategory: ImageCategory;
  openPreview: (fileId: string) => void;
  removeFile: (fileId: string) => void;
  removeMutation: UseMutationResult<
    { message: string },
    Error,
    { category: ImageCategory; id: string }
  >;
}

export const ImageLibraryCard: React.FC<ImageLibraryCardProps> = ({
  file,
  imageSettings,
  imageCategory,
  openPreview,
  removeFile,
  removeMutation,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="image-library-item" key={file.id} css={styles}>
      <Flex direction="column" justify="center" align="center" gap={3}>
        <div className="image-library-selection-marker">
          {imageSettings[imageCategory] === file.id && <BadgeCheckIcon className="icon-check" />}
        </div>

        {file.filePath
          ? (
            <Flex onClick={() => openPreview(file.id)}>
              <img
                src={getImageFilePublicUrl(file.filePath)}
                alt=""
                className="image-library-thumbnail"
              />
            </Flex>
          )
          : null}

        <Flex
          direction="column"
          gap={1}
          justify="center"
          align="center"
          className="image-library-meta"
        >
          <span>{file.name}</span>
          <span>
            {formatFileSize(file.size)} • {file.type}
          </span>
          <span>
            {new Date(file.uploadedAt).toLocaleDateString()}
          </span>
        </Flex>

        <Flex gap={2} justify="center" align="center">
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
  );
};
