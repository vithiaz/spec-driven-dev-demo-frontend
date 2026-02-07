'use client';

import {
  Stepper as PrimeStepper,
  StepperProps as PrimeStepperProps,
} from 'primereact/stepper';
import {
  StepperPanel,
  StepperPanelProps as PrimeStepperPanelProps,
} from 'primereact/stepperpanel';

export interface StepperPanelProps extends PrimeStepperPanelProps {
  header: string;
  children: React.ReactNode;
}

export interface StepperProps extends Omit<PrimeStepperProps, 'children'> {
  steps: StepperPanelProps[];
  containerClassName?: string;
}

export function Stepper({
  steps,
  containerClassName = '',
  ...stepperProps
}: StepperProps) {
  return (
    <div className={containerClassName}>
      <PrimeStepper {...stepperProps}>
        {steps.map((step, index) => {
          const { header, children, ...stepProps } = step;
          return (
            <StepperPanel key={index} header={header} {...stepProps}>
              {children}
            </StepperPanel>
          );
        })}
      </PrimeStepper>
    </div>
  );
}
