'use client';

import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { BaseFieldProps } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormDropdownProps
  extends Omit<DropdownProps, 'className' | 'size'>, BaseFieldProps {
  size?: 'small' | 'normal' | 'large';
  minWidth?: string;
  'data-testid'?: string;
}

export function FormDropdown({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  size = 'small',
  minWidth = '12rem',
  appendTo = 'self',
  'data-testid': dataTestId,
  style,
  ...dropdownProps
}: FormDropdownProps) {
  const inputId =
    dropdownProps.inputId ||
    `dropdown-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  // Map size prop to PrimeReact className
  const sizeClass =
    size === 'small'
      ? 'p-dropdown-sm'
      : size === 'large'
        ? 'p-dropdown-lg'
        : '';

  // Merge minWidth with existing style
  const dropdownStyle = { ...style, minWidth };

  return (
    <FieldWrapper
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      htmlFor={inputId}
      className={containerClassName}
      labelClassName={labelClassName}
      data-testid={dataTestId ? `${dataTestId}-wrapper` : undefined}
    >
      <div data-testid={dataTestId}>
        <Dropdown
          {...dropdownProps}
          inputId={inputId}
          disabled={disabled}
          appendTo={appendTo}
          className={`w-full ${error ? 'p-invalid' : ''} ${sizeClass} ${className}`}
          style={dropdownStyle}
          aria-invalid={error ? 'true' : undefined}
        />
      </div>
    </FieldWrapper>
  );
}
