'use client';

import { InputSwitch, InputSwitchProps } from 'primereact/inputswitch';
import { BaseFieldProps } from './types';

export interface FormInputSwitchProps
  extends Omit<InputSwitchProps, 'className'>, BaseFieldProps {
  switchLabel?: string;
  'data-testid'?: string;
}

export function FormInputSwitch({
  label,
  switchLabel,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  'data-testid': dataTestId,
  ...switchProps
}: FormInputSwitchProps) {
  const inputId =
    switchProps.inputId ||
    `switch-${(switchLabel || label)?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className={`block font-medium text-sm ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-3">
        <InputSwitch
          {...switchProps}
          inputId={inputId}
          disabled={disabled}
          className={`${error ? 'p-invalid' : ''} ${className}`}
          pt={{
            root: { 'data-testid': dataTestId },
          }}
        />
        {switchLabel && (
          <label htmlFor={inputId} className="cursor-pointer">
            {switchLabel}
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
