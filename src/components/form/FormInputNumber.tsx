'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  InputNumber,
  InputNumberProps,
  InputNumberValueChangeEvent,
} from 'primereact/inputnumber';
import { BaseFieldProps, IconPosition } from './types';
import { FieldWrapper } from './FieldWrapper';

// Extend Window interface for E2E testing support
declare global {
  interface Window {
    __inputNumberRegistry?: Map<string, (value: number | null) => void>;
    __setInputNumberValue?: (testId: string, value: number | null) => boolean;
  }
}

export interface FormInputNumberProps
  extends Omit<InputNumberProps, 'className'>, BaseFieldProps, IconPosition {
  'data-testid'?: string;
}

export function FormInputNumber({
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
  'data-testid': dataTestId,
  pt,
  onValueChange,
  value,
  ...numberProps
}: FormInputNumberProps) {
  const inputId =
    numberProps.inputId ||
    `number-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  // Ref to track the current onValueChange callback
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // Create a setValue function that triggers the onValueChange callback
  const setValue = useCallback(
    (newValue: number | null) => {
      if (onValueChangeRef.current) {
        // Create a synthetic event that mimics PrimeReact's InputNumberValueChangeEvent
        // FormEvent requires: value, stopPropagation, preventDefault, target
        const syntheticEvent = {
          value: newValue,
          originalEvent: null,
          stopPropagation: () => {},
          preventDefault: () => {},
          target: {
            name: inputId,
            id: inputId,
            value: newValue,
          },
        } as unknown as InputNumberValueChangeEvent;

        // Call synchronously to ensure React processes it immediately
        onValueChangeRef.current(syntheticEvent);
      }
    },
    [inputId]
  );

  // Register/unregister this input with the global registry for E2E testing
  useEffect(() => {
    if (!dataTestId) return;

    // Initialize the global registry if it doesn't exist
    if (typeof window !== 'undefined') {
      if (!window.__inputNumberRegistry) {
        window.__inputNumberRegistry = new Map();
      }

      // Initialize the global setter function if it doesn't exist
      if (!window.__setInputNumberValue) {
        window.__setInputNumberValue = (
          testId: string,
          newValue: number | null
        ): boolean => {
          const setterFn = window.__inputNumberRegistry?.get(testId);
          if (setterFn) {
            setterFn(newValue);
            return true;
          }
          console.warn(
            `[__setInputNumberValue] No InputNumber found with testId: ${testId}`
          );
          return false;
        };
      }

      // Register this input's setValue function
      window.__inputNumberRegistry.set(dataTestId, setValue);

      // Cleanup on unmount
      return () => {
        window.__inputNumberRegistry?.delete(dataTestId);
      };
    }
  }, [dataTestId, setValue]);

  // Wrap InputNumber in a div with data-testid for E2E testing
  // PrimeReact's PT API is unreliable for applying data-testid to the inner input
  // By wrapping, tests can use getByTestId(id) to find the wrapper, then getByRole('spinbutton') inside
  const renderInput = () => {
    const inputNumberElement = (
      <InputNumber
        {...numberProps}
        value={value}
        onValueChange={onValueChange}
        inputId={inputId}
        disabled={disabled}
        className={`${!icon ? 'w-full' : ''} ${error ? 'p-invalid' : ''} ${className}`}
        pt={pt}
      />
    );

    // Wrap with data-testid div if provided
    const wrappedInput = dataTestId ? (
      <div data-testid={dataTestId} className={!icon ? 'w-full' : ''}>
        {inputNumberElement}
      </div>
    ) : (
      inputNumberElement
    );

    if (!icon) {
      return wrappedInput;
    }

    return (
      <div className="p-inputgroup flex-1">
        {iconPosition === 'left' && (
          <span className="p-inputgroup-addon">{icon}</span>
        )}
        {wrappedInput}
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
