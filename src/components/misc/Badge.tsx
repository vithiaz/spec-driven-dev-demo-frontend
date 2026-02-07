'use client';

import {
  Badge as PrimeBadge,
  BadgeProps as PrimeBadgeProps,
} from 'primereact/badge';

export interface BadgeProps extends PrimeBadgeProps {
  containerClassName?: string;
}

export function Badge({ containerClassName = '', ...props }: BadgeProps) {
  return (
    <div className={containerClassName}>
      <PrimeBadge {...props} />
    </div>
  );
}
