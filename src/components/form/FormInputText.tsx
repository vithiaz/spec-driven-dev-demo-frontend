'use client';

import { InputText, InputTextProps } from 'primereact/inputtext';
import { BaseFieldProps, IconPosition } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormInputTextProps
  extends Omit<InputTextProps, 'className'>, BaseFieldProps, IconPosition {
  size?: 'small' | 'normal' | 'large';
  'data-testid'?: string;
}

export function FormInputText({
  label,
  helperText,
  error,
  required,
  className = 'w-full',
  containerClassName = 'w-full',
  labelClassName = '',
  icon,
  iconPosition = 'left',
  iconLeft,
  iconRight,
  disabled,
  size = 'small',
  'data-testid': dataTestId,
  ...inputProps
}: FormInputTextProps) {
  const inputId =
    inputProps.id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const testId = dataTestId || `${inputId}-input`;

  const leftIcon = iconLeft || (icon && iconPosition === 'left' ? icon : null);
  const rightIcon =
    iconRight || (icon && iconPosition === 'right' ? icon : null);

  // Map size prop to PrimeReact className
  const sizeClass =
    size === 'small'
      ? 'p-inputtext-sm'
      : size === 'large'
        ? 'p-inputtext-lg'
        : '';

  const renderInput = () => {
    if (!leftIcon && !rightIcon) {
      return (
        <InputText
          {...inputProps}
          id={inputId}
          data-testid={testId}
          disabled={disabled}
          className={`${error ? 'p-invalid' : ''} ${sizeClass} ${className}`}
          aria-invalid={error ? 'true' : undefined}
        />
      );
    }

    // Build wrapper classes based on icon positions
    const wrapperClasses = ['w-full'];
    if (leftIcon && !rightIcon) {
      wrapperClasses.push('p-input-icon-left');
    } else if (!leftIcon && rightIcon) {
      wrapperClasses.push('p-input-icon-right');
    } else if (leftIcon && rightIcon) {
      wrapperClasses.push('p-input-icon-left', 'p-input-icon-right');
    }

    return (
      <span className={wrapperClasses.join(' ')}>
        {leftIcon}
        <InputText
          {...inputProps}
          id={inputId}
          data-testid={testId}
          disabled={disabled}
          className={`${error ? 'p-invalid' : ''} ${sizeClass} ${className}`}
          aria-invalid={error ? 'true' : undefined}
        />
        {rightIcon}
      </span>
    );
  };

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
      {renderInput()}
    </FieldWrapper>
  );
}
