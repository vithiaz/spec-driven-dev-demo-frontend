'use client';

import { Checkbox, CheckboxProps } from 'primereact/checkbox';
import { BaseFieldProps } from './types';

export interface FormCheckboxProps
  extends Omit<CheckboxProps, 'className'>,
    BaseFieldProps {
  checkboxLabel?: string;
}

export function FormCheckbox({
  label,
  checkboxLabel,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  ...checkboxProps
}: FormCheckboxProps) {
  const inputId =
    checkboxProps.inputId ||
    `checkbox-${(checkboxLabel || label)?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`block font-medium text-sm ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-3">
        <Checkbox
          {...checkboxProps}
          inputId={inputId}
          disabled={disabled}
          className={`${error ? 'p-invalid' : ''} ${className}`}
        />
        {checkboxLabel && (
          <label htmlFor={inputId} className="cursor-pointer">
            {checkboxLabel}
          </label>
        )}
      </div>
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
