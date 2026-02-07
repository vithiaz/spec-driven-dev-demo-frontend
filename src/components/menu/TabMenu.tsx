'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  TabMenu as PrimeTabMenu,
  TabMenuProps as PrimeTabMenuProps,
} from 'primereact/tabmenu';
import { MenuItem } from 'primereact/menuitem';

export interface TabMenuProps extends Omit<PrimeTabMenuProps, 'model'> {
  items: MenuItem[];
  containerClassName?: string;
}

export function TabMenu({
  items,
  containerClassName = '',
  ...tabMenuProps
}: TabMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Function to apply testIds and aria-selected to menu items
  const applyAttributes = useCallback(() => {
    if (!containerRef.current) return;

    const menuItems = containerRef.current.querySelectorAll(
      '.p-tabmenu-nav > li[role="presentation"]'
    );

    menuItems.forEach((menuItem, index) => {
      const testId = items[index]?.data?.testId;
      if (testId && menuItem.getAttribute('data-testid') !== testId) {
        menuItem.setAttribute('data-testid', testId);
      }

      const isActive = index === tabMenuProps.activeIndex;
      const newAriaSelected = isActive ? 'true' : 'false';
      if (menuItem.getAttribute('aria-selected') !== newAriaSelected) {
        menuItem.setAttribute('aria-selected', newAriaSelected);
      }
    });
  }, [items, tabMenuProps.activeIndex]);

  // Use MutationObserver to continuously apply attributes
  useEffect(() => {
    if (!containerRef.current) return;

    // Apply initially
    applyAttributes();

    // Create observer to watch for changes
    observerRef.current = new MutationObserver(() => {
      // Re-apply whenever DOM changes
      applyAttributes();
    });

    // Observe the container for all changes
    observerRef.current.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [applyAttributes]);

  return (
    <div className={containerClassName} ref={containerRef}>
      <PrimeTabMenu model={items} {...tabMenuProps} />
    </div>
  );
}
