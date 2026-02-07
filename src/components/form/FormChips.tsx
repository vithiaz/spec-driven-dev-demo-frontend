'use client';

import { Chips, ChipsProps } from 'primereact/chips';
import { BaseFieldProps } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormChipsProps
  extends Omit<ChipsProps, 'className'>,
    BaseFieldProps {}

export function FormChips({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  ...chipsProps
}: FormChipsProps) {
  const inputId =
    chipsProps.inputId || `chips-${label?.toLowerCase().replace(/\s+/g, '-')}`;

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
      <Chips
        {...chipsProps}
        inputId={inputId}
        disabled={disabled}
        className={`w-full ${error ? 'p-invalid' : ''} ${className}`}
      />
    </FieldWrapper>
  );
}
