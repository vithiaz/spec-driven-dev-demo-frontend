'use client';

import { Sidebar, SidebarProps } from 'primereact/sidebar';
import { ReactNode } from 'react';

export interface DrawerProps
  extends Omit<SidebarProps, 'className' | 'position'> {
  visible: boolean;
  onHide: () => void;
  position?: 'top' | 'right' | 'bottom' | 'left';
  title?: string;
  showCloseIcon?: boolean;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export function Drawer({
  visible,
  onHide,
  position = 'right',
  title,
  showCloseIcon = true,
  footer,
  children,
  className = '',
  containerClassName = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  ...sidebarProps
}: DrawerProps) {
  const headerTemplate = title ? (
    <div
      className={`flex items-center justify-between pb-4 border-b border-border ${headerClassName}`}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  ) : undefined;

  const footerTemplate = footer ? (
    <div className={`pt-4 border-t border-border ${footerClassName}`}>
      {footer}
    </div>
  ) : undefined;

  return (
    <div className={containerClassName}>
      <Sidebar
        visible={visible}
        onHide={onHide}
        position={position}
        showCloseIcon={showCloseIcon}
        header={headerTemplate}
        className={className}
        {...sidebarProps}
      >
        <div className={contentClassName}>{children}</div>
        {footerTemplate}
      </Sidebar>
    </div>
  );
}
