'use client';

import {
  ProgressSpinner,
  ProgressSpinnerProps,
} from 'primereact/progressspinner';

export interface SpinnerProps extends ProgressSpinnerProps {
  containerClassName?: string;
}

export function Spinner({ containerClassName = '', ...props }: SpinnerProps) {
  return (
    <div className={containerClassName}>
      <ProgressSpinner {...props} />
    </div>
  );
}
