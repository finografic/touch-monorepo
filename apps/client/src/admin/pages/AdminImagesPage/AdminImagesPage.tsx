import React, { useState } from 'react';
import { Tabs } from '@finografic/design-system/components';

import { AdminPageLayout, AdminSection } from 'admin/components';

import { useGetImageFiles, useGetImageSettings } from 'queries/images';

import type { ImageCategory } from 'types/images.types';
import { FileUploadSection, ImagesConfigurationSection, ImagesLibrarySection } from './components';
import { styles } from './AdminImagesPage.styles';

export const AdminImagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ImageCategory>('product');

  const { data: imageFiles = [], isLoading: isLoadingFiles } = useGetImageFiles();
  const { data: imageSettings = { product: null, label: null }, isLoading: isLoadingSettings } =
    useGetImageSettings();

  const { data: activeTabFiles = [], isLoading: isLoadingActiveTabFiles } = useGetImageFiles(activeTab);

  return (
    <AdminPageLayout
      title={'admin.pages.images.title'}
      description={'admin.pages.images.description'}
      isLoading={isLoadingFiles || isLoadingSettings || isLoadingActiveTabFiles}
      styles={styles}
    >
      <Tabs.Root
        value={activeTab}
        variant="line"
        onValueChange={(details) => setActiveTab(details.value as ImageCategory)}
      >
        <Tabs.List>
          <Tabs.Trigger value="product">Product images</Tabs.Trigger>
          <Tabs.Trigger value="label">Label images</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value="product">
          <AdminSection title="Product image configuration">
            <AdminSection
              title="Default product image"
              description="Select which uploaded file is used as the default product image where applicable"
              variant="border-solid"
            >
              <ImagesConfigurationSection
                imageFiles={activeTabFiles}
                imageSettings={imageSettings}
                imageCategory="product"
              />
            </AdminSection>

            <AdminSection
              title="Upload product images"
              description="Add images to the product library (PNG, JPEG, WebP, GIF, SVG)"
              variant="border-solid"
            >
              <FileUploadSection imageCategory="product" />
            </AdminSection>

            <AdminSection
              title="Product image library"
              description={`${activeTabFiles.length} product image file(s) available`}
              variant="border-solid"
            >
              <ImagesLibrarySection
                imageFiles={activeTabFiles}
                imageSettings={imageSettings}
                imageCategory="product"
              />
            </AdminSection>
          </AdminSection>
        </Tabs.Content>

        <Tabs.Content value="label">
          <AdminSection title="Label image configuration">
            <AdminSection
              title="Default label image"
              description="Select which uploaded file is used as the default label image where applicable"
              variant="border-solid"
            >
              <ImagesConfigurationSection
                imageFiles={activeTabFiles}
                imageSettings={imageSettings}
                imageCategory="label"
              />
            </AdminSection>

            <AdminSection
              title="Upload label images"
              description="Add images to the label library (PNG, JPEG, WebP, GIF, SVG)"
              variant="border-solid"
            >
              <FileUploadSection imageCategory="label" />
            </AdminSection>

            <AdminSection
              title="Label image library"
              description={`${activeTabFiles.length} label image file(s) available`}
              variant="border-solid"
            >
              <ImagesLibrarySection
                imageFiles={activeTabFiles}
                imageSettings={imageSettings}
                imageCategory="label"
              />
            </AdminSection>
          </AdminSection>
        </Tabs.Content>
      </Tabs.Root>
    </AdminPageLayout>
  );
};
