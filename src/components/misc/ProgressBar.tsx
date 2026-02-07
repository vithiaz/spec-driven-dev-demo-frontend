'use client';

import {
  ProgressBar as PrimeProgressBar,
  ProgressBarProps as PrimeProgressBarProps,
} from 'primereact/progressbar';

export interface ProgressBarProps extends PrimeProgressBarProps {
  containerClassName?: string;
}

export function ProgressBar({
  containerClassName = '',
  ...props
}: ProgressBarProps) {
  return (
    <div className={containerClassName}>
      <PrimeProgressBar {...props} />
    </div>
  );
}
