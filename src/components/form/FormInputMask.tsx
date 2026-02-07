'use client';

import { InputMask, InputMaskProps } from 'primereact/inputmask';
import { BaseFieldProps, IconPosition } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormInputMaskProps
  extends Omit<InputMaskProps, 'className'>,
    BaseFieldProps,
    IconPosition {}

export function FormInputMask({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  icon,
  iconPosition = 'left',
  disabled,
  ...maskProps
}: FormInputMaskProps) {
  const inputId =
    maskProps.id || `mask-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  const renderInput = () => {
    if (!icon) {
      return (
        <InputMask
          {...maskProps}
          id={inputId}
          disabled={disabled}
          className={`w-full ${error ? 'p-invalid' : ''} ${className}`}
        />
      );
    }

    return (
      <div className="p-inputgroup flex-1">
        {iconPosition === 'left' && (
          <span className="p-inputgroup-addon">{icon}</span>
        )}
        <InputMask
          {...maskProps}
          id={inputId}
          disabled={disabled}
          className={`${error ? 'p-invalid' : ''} ${className}`}
        />
        {iconPosition === 'right' && (
          <span className="p-inputgroup-addon">{icon}</span>
        )}
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
