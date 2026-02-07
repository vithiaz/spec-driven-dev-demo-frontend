'use client';

import { Password, PasswordProps } from 'primereact/password';
import { BaseFieldProps, IconPosition } from './types';
import { FieldWrapper } from './FieldWrapper';
import clsx from 'clsx';

export interface FormPasswordProps
  extends
    Omit<PasswordProps, 'className' | 'icon' | 'size'>,
    BaseFieldProps,
    IconPosition {
  size?: 'small' | 'normal' | 'large';
  'data-testid'?: string;
}

export function FormPassword({
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
  ...passwordProps
}: FormPasswordProps) {
  const inputId =
    passwordProps.inputId ||
    `password-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const testId = dataTestId || `${inputId}-input`;

  const leftIcon = iconLeft || (icon && iconPosition === 'left' ? icon : null);
  const rightIcon =
    iconRight || (icon && iconPosition === 'right' ? icon : null);

  const renderInput = () => {
    const sizeClass =
      size === 'small'
        ? 'p-inputtext-sm'
        : size === 'large'
          ? 'p-inputtext-lg'
          : '';

    if (!leftIcon && !rightIcon) {
      return (
        <Password
          {...passwordProps}
          inputId={inputId}
          data-testid={testId}
          disabled={disabled}
          className={clsx(
            'w-full',
            sizeClass,
            {
              'p-invalid': error,
            },
            className
          )}
        />
      );
    }

    return (
      <div className="relative p-icon-left w-full">
        {leftIcon && <>{leftIcon}</>}
        <Password
          {...passwordProps}
          inputId={inputId}
          data-testid={testId}
          disabled={disabled}
          className={clsx(
            sizeClass,
            {
              'p-invalid': error,
              'p-icon-left': leftIcon,
            },
            className
          )}
        />
      </div>
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
