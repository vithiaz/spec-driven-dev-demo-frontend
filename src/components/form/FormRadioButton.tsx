'use client';

import { RadioButton } from 'primereact/radiobutton';
import { BaseFieldProps } from './types';

export interface RadioOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

export interface FormRadioButtonProps extends Omit<
  BaseFieldProps,
  'className'
> {
  options: RadioOption[];
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  name: string;
  radioClassName?: string;
  'data-testid'?: string;
  /**
   * When true, generates individual data-testid for each option
   * Format: `{data-testid}-{option.value}`
   * @example data-testid="radio-video-type" with value="upload" -> radio-video-type-upload
   */
  generateOptionTestIds?: boolean;
}

export function FormRadioButton({
  label,
  helperText,
  error,
  required,
  containerClassName = '',
  labelClassName = '',
  disabled,
  options,
  value,
  onChange,
  name,
  radioClassName = '',
  'data-testid': dataTestId,
  generateOptionTestIds = true,
}: FormRadioButtonProps) {
  return (
    <div className={`space-y-2 ${containerClassName}`} data-testid={dataTestId}>
      {label && (
        <label className={`block font-medium text-sm ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          const optionTestId =
            generateOptionTestIds && dataTestId
              ? `${dataTestId}-${option.value}`
              : undefined;
          return (
            <div
              key={optionId}
              className="flex items-center gap-3"
              data-testid={optionTestId}
            >
              <RadioButton
                inputId={optionId}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.value)}
                disabled={disabled || option.disabled}
                className={`${error ? 'p-invalid' : ''} ${radioClassName}`}
                pt={{
                  input: {
                    'data-testid': optionTestId
                      ? `${optionTestId}-input`
                      : undefined,
                  },
                }}
              />
              <label
                htmlFor={optionId}
                className="cursor-pointer"
                data-testid={optionTestId ? `${optionTestId}-label` : undefined}
              >
                {option.label}
              </label>
            </div>
          );
        })}
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
