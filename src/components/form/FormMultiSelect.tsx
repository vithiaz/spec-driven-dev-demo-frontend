'use client';

import { useCallback, useRef } from 'react';
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';
import { BaseFieldProps } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormMultiSelectProps
  extends Omit<MultiSelectProps, 'className'>, BaseFieldProps {
  inputSize?: 'small' | 'normal' | 'large';
}

export function FormMultiSelect({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  disabled,
  inputSize = 'small',
  appendTo = 'self',
  filter,
  resetFilterOnHide,
  onHide,
  onShow,
  ...multiselectProps
}: FormMultiSelectProps) {
  const inputId =
    multiselectProps.inputId ||
    `multiselect-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const multiSelectRef = useRef<MultiSelect>(null);

  // Map inputSize prop to custom class for consistent sizing
  const sizeClass =
    inputSize === 'small'
      ? 'p-multiselect-sm'
      : inputSize === 'large'
        ? 'p-multiselect-lg'
        : '';

  // Panel class for dropdown panel sizing
  const panelSizeClass =
    inputSize === 'small'
      ? 'p-multiselect-panel-sm'
      : inputSize === 'large'
        ? 'p-multiselect-panel-lg'
        : '';

  // Handle dropdown hide
  const handleHide = useCallback(() => {
    onHide?.();
  }, [onHide]);

  /**
   * Handle dropdown show - attach event listener to prevent clear icon click
   * from closing the dropdown.
   *
   * PrimeReact issue: Clicking the clear (X) icon inside the filter input
   * propagates to the dropdown panel, causing it to close.
   *
   * Fix: Intercept clicks on the clear icon and stop propagation.
   *
   * Requirements: ac-003-user-clears-multiselect-search
   */
  const handleShow = useCallback(() => {
    onShow?.();

    // Wait for the panel to render
    setTimeout(() => {
      // Find the panel element
      const panel = document.querySelector('.p-multiselect-panel');
      if (!panel) return;

      // Find the filter container
      const filterContainer = panel.querySelector(
        '.p-multiselect-filter-container'
      );
      if (!filterContainer) return;

      // Add click handler to stop propagation on clear icon clicks
      const handleFilterContainerClick = (e: Event) => {
        const target = e.target as HTMLElement;

        // Check if the click is on a clear icon (various possible selectors)
        const isClearIcon =
          target.classList.contains('p-inputtext-clear-icon') ||
          target.closest('.p-inputtext-clear-icon') ||
          target.closest('.p-icon-field-right svg') ||
          (target.tagName === 'svg' &&
            target.closest('.p-multiselect-filter-container')) ||
          (target.tagName === 'path' &&
            target.closest('.p-multiselect-filter-container'));

        if (isClearIcon) {
          e.stopPropagation();
        }
      };

      filterContainer.addEventListener('click', handleFilterContainerClick, {
        capture: true,
      });

      // Clean up on panel close (handled by React's lifecycle)
    }, 0);
  }, [onShow]);

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
      <MultiSelect
        {...multiselectProps}
        ref={multiSelectRef}
        inputId={inputId}
        disabled={disabled}
        appendTo={appendTo}
        filter={filter}
        resetFilterOnHide={resetFilterOnHide}
        onHide={handleHide}
        onShow={handleShow}
        className={`w-full ${error ? 'p-invalid' : ''} ${sizeClass} ${className}`}
        panelClassName={`${panelSizeClass} ${multiselectProps.panelClassName || ''}`}
        aria-invalid={error ? 'true' : undefined}
      />
    </FieldWrapper>
  );
}
