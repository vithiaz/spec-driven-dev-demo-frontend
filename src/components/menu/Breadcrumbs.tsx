'use client';

import { BreadCrumb, BreadCrumbProps } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import type { BreadcrumbItem } from '@/state/pageHeaderStore';

export interface BreadcrumbsProps extends Omit<BreadCrumbProps, 'model'> {
  items: BreadcrumbItem[];
  containerClassName?: string;
}

export function Breadcrumbs({
  items,
  containerClassName = '',
  ...breadcrumbProps
}: BreadcrumbsProps) {
  const router = useRouter();

  // Convert BreadcrumbItem[] to MenuItem[] for PrimeReact
  const menuItems: MenuItem[] = items.map((item) => ({
    label: item.label,
    url: item.url,
    command: (e) => {
      e.originalEvent?.preventDefault();
      // If custom command is provided, use it (for navigation guards)
      // Otherwise, use default navigation
      if (item.command) {
        item.command();
      } else if (item.url) {
        router.push(item.url);
      }
    },
  }));

  return (
    <div className={containerClassName}>
      <BreadCrumb
        model={menuItems}
        aria-label="breadcrumb"
        {...breadcrumbProps}
      />
    </div>
  );
}
