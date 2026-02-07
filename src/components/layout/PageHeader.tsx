'use client';

import { useEffect, useRef } from 'react';
import { Breadcrumbs, TabMenu } from '@/components/menu';
import { usePageHeaderStore } from '@/lib/providers/ClientStateProvider';
import {
  selectPageHeaderConfig,
  selectPageHeaderActiveTabIndex,
  selectPageHeaderSearchValue,
  selectPageHeaderOnTabChange,
  selectPageHeaderOnSearch,
} from '@/state/pageHeaderStore';
import { FormInputText } from '@/components/form/FormInputText';
import clsx from 'clsx';

export function PageHeader() {
  const config = usePageHeaderStore(selectPageHeaderConfig);
  const activeTabIndex = usePageHeaderStore(selectPageHeaderActiveTabIndex);
  const searchValue = usePageHeaderStore(selectPageHeaderSearchValue);
  const onTabChange = usePageHeaderStore(selectPageHeaderOnTabChange);
  const onSearch = usePageHeaderStore(selectPageHeaderOnSearch);
  const headerRef = useRef<HTMLDivElement>(null);

  // Update main content padding based on header height
  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const mainContent = document.querySelector('.layout-main') as HTMLElement;
      if (mainContent) {
        mainContent.style.paddingTop = `${headerHeight}px`;
      }
    }

    // Cleanup
    return () => {
      const mainContent = document.querySelector('.layout-main') as HTMLElement;
      if (mainContent) {
        mainContent.style.paddingTop = '0';
      }
    };
  }, [config]);

  // Don't render if no config is set
  if (!config.title && !config.breadcrumbs && !config.tabs) {
    return null;
  }

  const showActionsRight =
    config.actionsPosition !== 'below' &&
    (config.actions || (config.search && config.search.position !== 'below'));

  const showActionsBelow =
    config.actionsPosition === 'below' ||
    (config.search && config.search.position === 'below');

  return (
    <div ref={headerRef} className="layout-page-header">
      <div className="layout-page-header-content">
        {/* Breadcrumbs */}
        {config.breadcrumbs && config.breadcrumbs.length > 0 && (
          <Breadcrumbs items={config.breadcrumbs} />
        )}

        {/* Title and Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {config.title && (
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 m-0">
              {config.title}
            </h1>
          )}

          {/* Actions on the right side of title */}
          {showActionsRight && (
            <div className="flex flex-wrap items-center gap-3">
              {config.search && config.search.position !== 'below' && (
                <FormInputText
                  value={searchValue}
                  onChange={(e) => onSearch?.(e.target.value)}
                  placeholder={config.search.placeholder}
                  helperText={config.search.helperText}
                  iconLeft={
                    <i className={clsx('pi pi-search absolute left-4 ')} />
                  }
                  className="w-full"
                  size="small"
                  aria-label={config.search.label || config.search.placeholder}
                  data-testid={config.search.testId ?? 'search-input'}
                />
              )}
              {config.actions && config.actionsPosition !== 'below' && (
                <div className="flex flex-wrap items-center gap-2">
                  {config.actions}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions below title */}
        {showActionsBelow && (
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {config.search && config.search.position === 'below' && (
              <FormInputText
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
                placeholder={config.search.placeholder}
                helperText={config.search.helperText}
                iconLeft={
                  <i className={clsx('pi pi-search absolute left-4 ')} />
                }
                className="w-full"
                size="small"
                aria-label={config.search.label || config.search.placeholder}
                data-testid={config.search.testId ?? 'search-input'}
              />
            )}
            {config.actions && config.actionsPosition === 'below' && (
              <div className="flex flex-wrap items-center gap-2">
                {config.actions}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      {config.tabs && config.tabs.length > 0 && (
        <div className="layout-page-header-tabs">
          <TabMenu
            items={config.tabs}
            activeIndex={activeTabIndex}
            onTabChange={(e) => onTabChange?.(e.index)}
          />
        </div>
      )}
    </div>
  );
}
