'use client';

import {
  SelectButton as PrimeSelectButton,
  SelectButtonProps as PrimeSelectButtonProps,
} from 'primereact/selectbutton';
import { BaseFieldProps } from '../form/types';
import { FieldWrapper } from '../form/FieldWrapper';

export interface SelectButtonProps
  extends Omit<PrimeSelectButtonProps, 'className' | 'size'>, BaseFieldProps {
  size?: 'small' | 'normal' | 'large';
}

export function SelectButton({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  size = 'normal',
  ...selectButtonProps
}: SelectButtonProps) {
  const inputId =
    selectButtonProps.id ||
    `select-button-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  // Map size prop to PrimeReact className
  const sizeClass =
    size === 'small'
      ? 'p-selectbutton-sm'
      : size === 'large'
        ? 'p-selectbutton-lg'
        : '';

  return (
    <FieldWrapper
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      htmlFor={inputId}
      className={containerClassName}
      labelClassName={labelClassName}
    >
      <PrimeSelectButton
        {...selectButtonProps}
        id={inputId}
        disabled={disabled}
        className={`${error ? 'p-invalid' : ''} ${sizeClass} whitespace-nowrap ${className}`}
      />
    </FieldWrapper>
  );
}
