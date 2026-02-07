'use client';

import {
  Chip as PrimeChip,
  ChipProps as PrimeChipProps,
} from 'primereact/chip';

export interface ChipProps extends PrimeChipProps {
  containerClassName?: string;
}

export function Chip({ containerClassName = '', ...props }: ChipProps) {
  return (
    <div className={containerClassName}>
      <PrimeChip {...props} />
    </div>
  );
}
