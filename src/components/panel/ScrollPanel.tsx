'use client';

import {
  ScrollPanel as PrimeScrollPanel,
  ScrollPanelProps as PrimeScrollPanelProps,
} from 'primereact/scrollpanel';
import { ReactNode } from 'react';

export interface ScrollPanelProps
  extends Omit<PrimeScrollPanelProps, 'className'> {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function ScrollPanel({
  children,
  className = '',
  containerClassName = '',
  ...scrollPanelProps
}: ScrollPanelProps) {
  return (
    <div className={containerClassName}>
      <PrimeScrollPanel className={className} {...scrollPanelProps}>
        {children}
      </PrimeScrollPanel>
    </div>
  );
}
