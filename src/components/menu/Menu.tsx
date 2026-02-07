/**
 * requirements: [
 *   component-library-menu-wrapper
 * ]
 * scenarios: [
 *   popup-menu-with-actions,
 *   action-menu-for-data-rows
 * ]
 */

'use client';

import React, { forwardRef } from 'react';
import {
  Menu as PrimeMenu,
  MenuProps as PrimeMenuProps,
} from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';

export interface MenuProps extends Omit<PrimeMenuProps, 'model'> {
  /** Menu items to display */
  items: MenuItem[];
  /** Test ID for the menu */
  'data-testid'?: string;
  /** Additional class name */
  className?: string;
}

/**
 * Menu Component
 *
 * Wrapper around PrimeReact Menu that provides:
 * - Consistent API with other wrapper components
 * - Built-in data-testid support
 * - Popup menu functionality for action menus
 *
 * @example
 * ```tsx
 * const menuRef = useRef<Menu>(null);
 *
 * const items: MenuItem[] = [
 *   { label: 'Edit', icon: 'pi pi-pencil', command: () => handleEdit() },
 *   { separator: true },
 *   { label: 'Delete', icon: 'pi pi-trash', command: () => handleDelete() },
 * ];
 *
 * <Menu
 *   ref={menuRef}
 *   items={items}
 *   popup
 *   popupAlignment="right"
 *   data-testid="my-action-menu"
 * />
 * <Button
 *   icon="pi pi-ellipsis-v"
 *   onClick={(e) => menuRef.current?.toggle(e)}
 * />
 * ```
 */
export const Menu = forwardRef<PrimeMenu, MenuProps>(
  ({ items, 'data-testid': dataTestId, className = '', ...menuProps }, ref) => {
    return (
      <PrimeMenu
        ref={ref}
        model={items}
        className={className}
        data-testid={dataTestId}
        {...menuProps}
      />
    );
  }
);

Menu.displayName = 'Menu';

// Export the ref type for use with useRef
export type MenuRef = PrimeMenu;

// Re-export MenuItem type for convenience
export type { MenuItem } from 'primereact/menuitem';
