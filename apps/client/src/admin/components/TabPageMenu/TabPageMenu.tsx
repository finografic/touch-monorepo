import React, { useMemo, useState } from 'react';

import type { UiLabelSectionData } from 'admin/pages/TranslationsUiPage/TranslationsUiPage.types';
import type { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';

import { styles } from './TabPageMenu.styles';

interface TabPageMenuProps {
  tabs: string[];
  sections: UiLabelSectionData[];
  // onTabChange: (fitteredSections: UiLabelSectionData[]) => void;
  onTabChange: (newValue: string) => void;
}

export const TabPageMenu: React.FC<TabPageMenuProps> = ({ tabs, sections, onTabChange }) => {
  const [activeNamespace, setActiveNamespace] = useState<(typeof tabs)[number]>('app');

  const tabItems = useMemo<MenuItem[]>(() => {
    return tabs.map((namespace) => ({
      label: namespace.charAt(0).toUpperCase() + namespace.slice(1),
      command: () => setActiveNamespace(namespace),
    }));
  }, []);

  // useMemo(() => {
  //   if (!activeNamespace) return sections;
  //   const filteredSections = sections.filter((section) => section.namespace === activeNamespace);
  //   onTabChange(filteredSections);
  // }, [sections, activeNamespace]);

  const activeIndex = useMemo(() => {
    return tabs.indexOf(activeNamespace);
  }, [activeNamespace]);

  return (
    <div css={styles}>
      <TabMenu
        model={tabItems}
        activeIndex={activeIndex}
        onTabChange={(e) => {
          if (e.index !== undefined) {
            onTabChange(tabs[e.index]);
          }
        }}
      />
    </div>
  );
};
