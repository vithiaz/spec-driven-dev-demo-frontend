'use client';

import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import { BaseFieldProps } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormInputTextareaProps
  extends Omit<InputTextareaProps, 'className'>, BaseFieldProps {
  'data-testid'?: string;
}

export function FormInputTextarea({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  'data-testid': dataTestId,
  ...textareaProps
}: FormInputTextareaProps) {
  const inputId =
    textareaProps.id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const testId = dataTestId || `${inputId}-input`;

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
      <InputTextarea
        {...textareaProps}
        id={inputId}
        data-testid={testId}
        disabled={disabled}
        className={`w-full ${error ? 'p-invalid' : ''} ${className}`}
      />
    </FieldWrapper>
  );
}
