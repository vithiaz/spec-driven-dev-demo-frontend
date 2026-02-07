'use client';

import { Calendar, CalendarProps } from 'primereact/calendar';
import { BaseFieldProps } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormCalendarProps
  extends Omit<CalendarProps, 'className'>, BaseFieldProps {
  size?: 'small' | 'normal' | 'large';
}

export function FormCalendar({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  size = 'small',
  ...calendarProps
}: FormCalendarProps) {
  const inputId =
    calendarProps.inputId ||
    `calendar-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  // Map size prop to custom class for consistent sizing with FormInputText
  const sizeClass =
    size === 'small'
      ? 'p-calendar-sm'
      : size === 'large'
        ? 'p-calendar-lg'
        : '';

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
      <Calendar
        {...calendarProps}
        inputId={inputId}
        disabled={disabled}
        className={`w-full ${error ? 'p-invalid' : ''} ${sizeClass} ${className}`}
      />
    </FieldWrapper>
  );
}
