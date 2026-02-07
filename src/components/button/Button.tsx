'use client';

import {
  Button as PrimeButton,
  ButtonProps as PrimeButtonProps,
} from 'primereact/button';

export interface ButtonProps extends Omit<
  PrimeButtonProps,
  'className' | 'label' | 'size'
> {
  label?: string;
  buttonLabel?: string;
  error?: string;
  className?: string;
  /** @deprecated This prop is ignored on Button - use className instead */
  containerClassName?: string;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
  'data-testid'?: string;
}

export function Button({
  label,
  buttonLabel,
  error,
  className = '',
  containerClassName: _containerClassName,
  disabled,
  size = 'small',
  'data-testid': dataTestId,
  ...buttonProps
}: ButtonProps) {
  // Destructure containerClassName to prevent it from being spread to DOM
  void _containerClassName;

  const inputId =
    buttonProps.id || `button-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const testId = dataTestId;

  // Map size prop to PrimeReact className
  const sizeClass =
    size === 'small' ? 'p-button-sm' : size === 'large' ? 'p-button-lg' : '';

  return (
    <PrimeButton
      {...buttonProps}
      id={inputId}
      data-testid={testId}
      label={buttonLabel ?? label}
      disabled={disabled}
      className={`${error ? 'p-invalid' : ''} ${sizeClass} whitespace-nowrap ${className}`}
    />
  );
}
