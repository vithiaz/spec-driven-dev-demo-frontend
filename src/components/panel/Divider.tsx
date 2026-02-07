'use client';

import {
  Divider as PrimeDivider,
  DividerProps as PrimeDividerProps,
} from 'primereact/divider';

export interface DividerProps extends Omit<PrimeDividerProps, 'className'> {
  label?: string;
  className?: string;
  containerClassName?: string;
}

export function Divider({
  label,
  className = '',
  containerClassName = '',
  ...dividerProps
}: DividerProps) {
  return (
    <div className={containerClassName}>
      <PrimeDivider className={className} {...dividerProps}>
        {label}
      </PrimeDivider>
    </div>
  );
}
