'use client';

import { Editor, EditorProps, EditorTextChangeEvent } from 'primereact/editor';
import { BaseFieldProps } from './types';
import { FieldWrapper } from './FieldWrapper';

export interface FormEditorProps
  extends Omit<EditorProps, 'className' | 'onChange'>, BaseFieldProps {
  /**
   * React Hook Form compatible onChange handler.
   * Automatically mapped to PrimeReact Editor's onTextChange.
   */
  onChange?: (value: string | null) => void;
}

export function FormEditor({
  label,
  helperText,
  error,
  required,
  className = '',
  containerClassName = '',
  labelClassName = '',
  onChange,
  onTextChange,
  ...editorProps
}: FormEditorProps) {
  const inputId =
    editorProps.id || `editor-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  /**
   * Handle text change from Editor.
   * Maps PrimeReact's onTextChange event to React Hook Form's onChange.
   */
  const handleTextChange = (event: EditorTextChangeEvent) => {
    // Call React Hook Form's onChange with the HTML value
    if (onChange) {
      onChange(event.htmlValue ?? '');
    }
    // Also call the original onTextChange if provided
    if (onTextChange) {
      onTextChange(event);
    }
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
      <Editor
        {...editorProps}
        id={inputId}
        onTextChange={handleTextChange}
        className={`${error ? 'p-invalid' : ''} ${className}`}
      />
    </FieldWrapper>
  );
}
