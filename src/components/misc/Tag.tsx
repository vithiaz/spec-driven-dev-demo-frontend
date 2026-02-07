'use client';

import { Tag as PrimeTag, TagProps as PrimeTagProps } from 'primereact/tag';

export interface TagProps extends PrimeTagProps {
  containerClassName?: string;
}

export function Tag({ containerClassName = '', ...props }: TagProps) {
  return (
    <div className={containerClassName}>
      <PrimeTag {...props} />
    </div>
  );
}
