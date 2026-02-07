'use client';

import {
  Avatar as PrimeAvatar,
  AvatarProps as PrimeAvatarProps,
} from 'primereact/avatar';

export interface AvatarProps extends PrimeAvatarProps {
  containerClassName?: string;
}

export function Avatar({ containerClassName = '', ...props }: AvatarProps) {
  return (
    <div className={containerClassName}>
      <PrimeAvatar {...props} />
    </div>
  );
}
