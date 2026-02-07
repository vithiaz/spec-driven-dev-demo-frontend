'use client';

import { useEffect, useRef } from 'react';
import { usePageHeaderStore } from '@/lib/providers/ClientStateProvider';
import type { PageHeaderConfig } from '@/state/pageHeaderStore';

function areArraysShallowEqual(a?: unknown[], b?: unknown[]) {
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function areSearchConfigsEqual(
  prev?: PageHeaderConfig['search'],
  next?: PageHeaderConfig['search']
) {
  if (!prev || !next) return prev === next;

  return (
    prev.placeholder === next.placeholder &&
    prev.label === next.label &&
    prev.position === next.position &&
    prev.testId === next.testId &&
    prev.helperText === next.helperText
  );
}

function arePageHeaderConfigsEqual(
  prev: PageHeaderConfig | null,
  next: PageHeaderConfig
) {
  if (prev === null) return false;
  if (prev === next) return true;

  return (
    prev.title === next.title &&
    areArraysShallowEqual(prev.breadcrumbs, next.breadcrumbs) &&
    areArraysShallowEqual(prev.tabs, next.tabs) &&
    areSearchConfigsEqual(prev.search, next.search) &&
    prev.actions === next.actions &&
    prev.actionsPosition === next.actionsPosition
  );
}

/**
 * Custom hook to configure the page header from client components
 * This hook automatically clears the configuration when the component unmounts
 *
 * The hook updates the page header on every render, allowing you to pass
 * dynamic config without needing to memoize every property.
 *
 * IMPORTANT NOTES:
 * 1. Must be called from page components (client components), NOT from layouts.
 *    Next.js layouts are server components by default and cannot pass callbacks to children.
 * 2. Only pass static configuration - NO state or callbacks.
 * 3. State (activeTabIndex, searchValue) should be managed via store actions.
 * 4. Callbacks (onTabChange, onSearch) should be registered via store actions.
 *
 * @param config - The page header configuration (static only)
 * @example
 * ```tsx
 * function MyPage() {
 *   const t = useTranslations('MY_PAGE');
 *   const setActiveTabIndex = usePageHeaderStore(state => state.setActiveTabIndex);
 *   const setOnTabChange = usePageHeaderStore(state => state.setOnTabChange);
 *
 *   // Register callbacks
 *   useEffect(() => {
 *     setOnTabChange((index) => {
 *       setActiveTabIndex(index);
 *       // Your logic here
 *     });
 *   }, [setOnTabChange, setActiveTabIndex]);
 *
 *   // Set configuration (static only)
 *   usePageHeaderConfig({
 *     title: t('TITLE'),
 *     breadcrumbs: [
 *       { label: t('HOME'), url: '/dashboard' },
 *       { label: t('CURRENT_PAGE'), url: '/current' }
 *     ],
 *     tabs: [
 *       { label: 'Tab 1' },
 *       { label: 'Tab 2' }
 *     ],
 *     search: {
 *       placeholder: 'Search...',
 *       position: 'right'
 *     }
 *   });
 *
 *   return <div>Page content</div>;
 * }
 * ```
 */
export function usePageHeaderConfig(config: PageHeaderConfig) {
  const setConfig = usePageHeaderStore((state) => state.setConfig);
  const clearConfig = usePageHeaderStore((state) => state.clearConfig);
  const clearCallbacks = usePageHeaderStore((state) => state.clearCallbacks);

  const previousConfigRef = useRef<PageHeaderConfig | null>(null);

  // Update config when values actually change to avoid redundant notifications
  useEffect(() => {
    const prevConfig = previousConfigRef.current;
    const hasConfigChanged = !arePageHeaderConfigsEqual(prevConfig, config);

    if (hasConfigChanged) {
      previousConfigRef.current = config;
      setConfig(config);
    }
  }, [config, setConfig]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset stored config so Strict Mode double-invocation re-applies config
      previousConfigRef.current = null;
      clearConfig();
      clearCallbacks();
    };
  }, [clearConfig, clearCallbacks]);
}

// Re-export types for convenience
export type { PageHeaderConfig, BreadcrumbItem } from '@/state/pageHeaderStore';
