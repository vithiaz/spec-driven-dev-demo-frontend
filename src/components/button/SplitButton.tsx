'use client';

import {
  SplitButton as PrimeSplitButton,
  SplitButtonProps as PrimeSplitButtonProps,
} from 'primereact/splitbutton';
import { BaseFieldProps } from '../form/types';
import { FieldWrapper } from '../form/FieldWrapper';

export interface SplitButtonProps
  extends
    Omit<PrimeSplitButtonProps, 'className' | 'label'>,
    Omit<BaseFieldProps, 'disabled'> {
  buttonLabel?: string;
  disabled?: boolean;
}

export function SplitButton({
  label,
  buttonLabel,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  ...splitButtonProps
}: SplitButtonProps) {
  const inputId =
    splitButtonProps.id ||
    `split-button-${label?.toLowerCase().replace(/\s+/g, '-')}`;

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
      <PrimeSplitButton
        {...splitButtonProps}
        label={buttonLabel}
        id={inputId}
        disabled={disabled}
        className={`${error ? 'p-invalid' : ''} whitespace-nowrap ${className}`}
      />
    </FieldWrapper>
  );
}
