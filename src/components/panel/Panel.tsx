'use client';

import {
  Panel as PrimePanel,
  PanelProps as PrimePanelProps,
} from 'primereact/panel';
import { ReactNode } from 'react';

export interface PanelProps extends Omit<PrimePanelProps, 'className'> {
  header?: string;
  headerTemplate?: ReactNode;
  footerTemplate?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Panel({
  header,
  headerTemplate,
  footerTemplate,
  children,
  className = '',
  containerClassName = '',
  ...panelProps
}: PanelProps) {
  return (
    <div className={containerClassName}>
      <PrimePanel
        header={header}
        headerTemplate={headerTemplate}
        footerTemplate={footerTemplate}
        className={className}
        {...panelProps}
      >
        {children}
      </PrimePanel>
    </div>
  );
}
