'use client';

import {
  TabView,
  TabViewProps,
  TabPanel,
  TabPanelProps as PrimeTabPanelProps,
} from 'primereact/tabview';

export interface TabPanelProps extends PrimeTabPanelProps {
  header: string;
  leftIcon?: string;
  rightIcon?: string;
  children: React.ReactNode;
  hidden?: boolean;
}

export interface TabProps extends Omit<TabViewProps, 'children'> {
  tabs: TabPanelProps[];
  containerClassName?: string;
}

export function Tab({
  tabs,
  containerClassName = '',
  ...tabViewProps
}: TabProps) {
  const activeTabs = tabs.filter((tab) => !tab.hidden);
  if (activeTabs.length === 0) {
    return null;
  }
  return (
    <div className={containerClassName}>
      <TabView {...tabViewProps}>
        {activeTabs.map((tab, index) => {
            const { header, leftIcon, rightIcon, children, ...tabProps } = tab;
            return (
              <TabPanel
                key={index}
                header={header}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                {...tabProps}
              >
                {children}
              </TabPanel>
            );
          })}
      </TabView>
    </div>
  );
}
