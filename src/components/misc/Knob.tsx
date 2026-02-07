'use client';

import { Knob as PrimeKnob, KnobProps as PrimeKnobProps } from 'primereact/knob';

export interface KnobProps extends PrimeKnobProps {
  containerClassName?: string;
}

export function Knob({ containerClassName = '', ...props }: KnobProps) {
  return (
    <div className={containerClassName}>
      <PrimeKnob {...props} />
    </div>
  );
}
