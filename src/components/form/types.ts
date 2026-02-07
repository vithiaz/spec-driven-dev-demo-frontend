import { ReactNode } from 'react';

export interface BaseFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export interface IconPosition {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export interface FieldWrapperProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}
