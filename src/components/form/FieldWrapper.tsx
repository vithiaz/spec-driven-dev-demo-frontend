import { FieldWrapperProps } from './types';

export function FieldWrapper({
  label,
  helperText,
  error,
  required,
  htmlFor,
  className = '',
  labelClassName = 'text-muted-foreground',
  children,
}: FieldWrapperProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`block font-medium text-sm ${labelClassName} flex gap-1`}
        >
          {label}
          {required && (
            <span className="!text-red-500 dark:!text-red-400">*</span>
          )}
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p
          className="p-error text-sm text-red-500 dark:text-red-400"
          data-testid={error ? `${htmlFor}-error-message` : undefined}
        >
          {error}
        </p>
      )}
    </div>
  );
}
