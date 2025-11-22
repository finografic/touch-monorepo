import React, { useMemo, useState } from 'react';

import { SectionedTranslationPage } from 'admin/components/SectionedTranslationPage';
import { UiLabelSection } from 'admin/components/UiLabelsSection/UiLabelSection';
import type { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';

import { useUiLabelSections } from './hooks/useUiLabelSections';
import { styles, stylesTabs } from './TranslationsUiPage.styles';

const NAMESPACES = ['app', 'admin', 'shared'] as const;
type Namespace = (typeof NAMESPACES)[number];

export const TranslationsUiPage: React.FC = () => {
  const {
    sections,
    supportedLanguages,
    isLoading,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
  } = useUiLabelSections();

  const [activeNamespace, setActiveNamespace] = useState<Namespace>('app');

  const tabItems = useMemo<MenuItem[]>(() => {
    return NAMESPACES.map((namespace) => ({
      label: namespace.charAt(0).toUpperCase() + namespace.slice(1),
      command: () => setActiveNamespace(namespace),
    }));
  }, []);

  const filteredSections = React.useMemo(() => {
    if (!activeNamespace) return [...sections];

    return [...sections.filter((section) => section.namespace === activeNamespace)];
  }, [sections, activeNamespace]);

  const activeIndex = useMemo(() => {
    return NAMESPACES.indexOf(activeNamespace);
  }, [activeNamespace]);

  return (
    <SectionedTranslationPage
      key={activeNamespace}
      subtitle="UI Labels / Translations"
      sections={filteredSections}
      supportedLanguages={supportedLanguages}
      isLoading={isLoading}
      handleValueChange={handleValueChange}
      resetSection={resetSection}
      saveSection={saveSection}
      isSectionDirty={isSectionDirty}
      renderSection={(props) => (
        <UiLabelSection
          key={props.sectionKey}
          sectionKey={props.sectionKey}
          title={props.title.replace(/^(app|admin|shared)\s+/i, '')}
          description={props.description}
          items={props.items}
          supportedLanguages={props.supportedLanguages}
          onItemChange={props.onItemChange}
          onReset={props.onReset}
          onSave={props.onSave}
          isDirty={props.isDirty}
        />
      )}
      styles={styles}
      renderHeader={() => (
        <div css={stylesTabs}>
          <TabMenu
            model={tabItems}
            activeIndex={activeIndex}
            onTabChange={(e) => {
              if (e.index !== undefined) {
                setActiveNamespace(NAMESPACES[e.index]);
              }
            }}
          />
        </div>
      )}
    />
  );
};
