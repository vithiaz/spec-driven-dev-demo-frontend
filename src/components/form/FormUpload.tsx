'use client';

import {
  FileUpload,
  FileUploadProps,
  FileUploadSelectEvent,
  FileUploadRemoveEvent,
} from 'primereact/fileupload';
import { BaseFieldProps } from './types';
import { FieldWrapper } from './FieldWrapper';
import { useRef, useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useToast } from '@/lib/providers/ToastProvider';

/**
 * Represents an uploaded file with its URL
 */
export interface UploadedFile {
  name: string;
  url: string;
  size?: number;
}

/**
 * Result of uploading a single file
 */
export interface FileUploadResult {
  file: File;
  success: boolean;
  url?: string;
  error?: string;
}

export interface FormUploadProps
  extends Omit<FileUploadProps, 'className' | 'onUpload'>, BaseFieldProps {
  // File validation
  maxFileSize?: number; // in bytes
  acceptedExtensions?: string[]; // e.g., ['.pdf', '.jpg', '.png']
  maxFiles?: number;

  // Controlled mode - list of already uploaded files (URLs)
  uploadedFiles?: UploadedFile[];

  // Upload callback - returns results indicating success/failure for each file
  onUpload?: (
    files: File[]
  ) => Promise<FileUploadResult[]> | FileUploadResult[] | void | Promise<void>;
  onFileSelect?: (event: FileUploadSelectEvent) => void;
  onFileRemove?: (file: File) => void;
  onUploadedFileRemove?: (file: UploadedFile) => void;

  // Display options
  showCancelButton?: boolean;
  chooseButtonLabel?: string;
  cancelButtonLabel?: string;

  // Drag and drop
  enableDragDrop?: boolean;
  dragDropLabel?: string;

  /**
   * When true, hides PrimeReact's built-in validation messages (shown inside the dropzone).
   * Use this when you handle validation errors yourself (e.g., via toast notifications).
   * Default: false
   */
  hideBuiltInValidation?: boolean;
}

export function FormUpload({
  label,
  helperText,
  error,
  required,
  className = 'w-full',
  containerClassName = 'w-full',
  labelClassName = '',
  disabled,

  // File validation
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  acceptedExtensions,
  maxFiles = 10,

  // Controlled mode
  uploadedFiles = [],

  // Callbacks
  onUpload,
  onFileSelect,
  onFileRemove,
  onUploadedFileRemove,

  // Display options
  chooseButtonLabel,
  cancelButtonLabel,

  // Drag and drop
  enableDragDrop = true,
  dragDropLabel,

  // Built-in validation
  hideBuiltInValidation = false,

  ...fileUploadProps
}: FormUploadProps) {
  const t = useTranslations('FORM_UPLOAD');
  const toast = useToast();
  const fileUploadRef = useRef<FileUpload>(null);
  // Flag to prevent infinite loop when clearing
  const isClearingRef = useRef(false);
  // Track files that are pending upload (not yet uploaded)
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const inputId =
    fileUploadProps.id || `upload-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  // Calculate total files count for max files validation
  const totalFilesCount = useMemo(
    () => pendingFiles.length + uploadedFiles.length,
    [pendingFiles.length, uploadedFiles.length]
  );

  // Use translations with fallback to provided labels
  const labels = {
    choose: chooseButtonLabel || t('CHOOSE_BUTTON'),
    cancel: cancelButtonLabel || t('CANCEL_BUTTON'),
    dragDrop: dragDropLabel || t('CLICK_OR_DRAG_DROP'),
  };

  // Build accept string from extensions
  const acceptString = acceptedExtensions?.join(',') || '*';

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file extension
  const validateFileExtension = (file: File): boolean => {
    if (!acceptedExtensions || acceptedExtensions.length === 0) {
      return true;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return acceptedExtensions.some(
      (ext) => ext.toLowerCase() === fileExtension
    );
  };

  // Validate file size
  const validateFileSize = (file: File): boolean => {
    return file.size <= maxFileSize;
  };

  // Handle file selection
  const handleSelect = async (event: FileUploadSelectEvent) => {
    const files = event.files;
    let validFiles: File[] = [];
    const errors: string[] = [];

    // Get names of files that are already pending
    const existingPendingNames = new Set(pendingFiles.map((f) => f.name));

    files.forEach((file: File) => {
      // Skip files that are already pending or uploaded
      if (existingPendingNames.has(file.name)) {
        return;
      }
      // Check if file is already uploaded (need to match against sanitized name)
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const isAlreadyUploaded = uploadedFiles.some((uf) => {
        return (
          uf.name === file.name ||
          uf.name === sanitizedName ||
          uf.name.endsWith(`_${sanitizedName}`)
        );
      });
      if (isAlreadyUploaded) {
        return;
      }

      // Check extension
      if (!validateFileExtension(file)) {
        errors.push(
          t('INVALID_FILE_TYPE', {
            fileName: file.name,
            acceptedTypes: acceptedExtensions?.join(', ') || '',
          })
        );
        return;
      }

      // Check size
      if (!validateFileSize(file)) {
        errors.push(
          t('FILE_SIZE_EXCEEDS', {
            fileName: file.name,
            maxSize: formatFileSize(maxFileSize),
          })
        );
        return;
      }

      validFiles.push(file);
    });

    // Check max files limit - add as many as possible instead of rejecting all
    const availableSlots = maxFiles - totalFilesCount;

    if (availableSlots <= 0) {
      errors.push(t('MAX_FILES_EXCEEDED', { maxFiles }));
      validFiles = []; // No slots available
    } else if (validFiles.length > availableSlots) {
      const rejectedCount = validFiles.length - availableSlots;
      errors.push(
        t('PARTIAL_FILES_ADDED', {
          added: availableSlots,
          rejected: rejectedCount,
          maxFiles,
        })
      );
      validFiles = validFiles.slice(0, availableSlots); // Take only what fits
    }

    // Show toast notification for validation errors
    if (errors.length > 0) {
      toast.error(errors.join('. '), t('VALIDATION_ERROR'));

      // Clear FileUpload's internal state to reset the input for invalid files
      fileUploadRef.current?.clear();
    }

    if (validFiles.length > 0) {
      onFileSelect?.(event);

      // Auto-upload files immediately after selection
      if (onUpload) {
        // Add to pending files first
        setPendingFiles((prev) => [...prev, ...validFiles]);

        // Then upload - the result will determine which files to remove from pending
        await handleUpload(validFiles);
      } else {
        // No upload handler, just add to pending
        setPendingFiles((prev) => [...prev, ...validFiles]);
      }
    }
  };

  // Handle pending file removal (file not yet uploaded)
  const handlePendingFileRemove = (file: File) => {
    // Update local React state - only remove this specific file
    setPendingFiles((prev) => {
      const newPending = prev.filter((f) => f.name !== file.name);
      // If no more pending files and no uploaded files, clear PrimeReact's internal state
      if (newPending.length === 0 && uploadedFiles.length === 0) {
        isClearingRef.current = true;
        fileUploadRef.current?.clear();
        isClearingRef.current = false;
      }
      return newPending;
    });

    // Notify parent component
    onFileRemove?.(file);
  };

  // Handle uploaded file removal (file already uploaded with URL)
  const handleUploadedFileRemove = (file: UploadedFile) => {
    // Clear PrimeReact's internal state if this is the last file
    if (uploadedFiles.length === 1 && pendingFiles.length === 0) {
      isClearingRef.current = true;
      fileUploadRef.current?.clear();
      isClearingRef.current = false;
    }
    onUploadedFileRemove?.(file);
  };

  // Wrapper for PrimeReact's onRemove callback
  const handleRemoveEvent = (event: FileUploadRemoveEvent) => {
    handlePendingFileRemove(event.file as File);
  };

  // Handle upload
  const handleUpload = async (filesToUpload?: File[]) => {
    const files = filesToUpload || pendingFiles;
    if (files.length === 0 || !onUpload) return;

    setIsUploading(true);

    try {
      const result = await onUpload(files);

      // Check if we got upload results back
      if (Array.isArray(result)) {
        // Clear only the files that were successfully uploaded
        const successfulFileNames = result
          .filter((r) => r.success)
          .map((r) => r.file.name);

        if (successfulFileNames.length > 0) {
          setPendingFiles((prev) => {
            const newPending = prev.filter(
              (pf) => !successfulFileNames.includes(pf.name)
            );
            // Clear PrimeReact's internal state if no more pending files
            if (newPending.length === 0) {
              isClearingRef.current = true;
              fileUploadRef.current?.clear();
              isClearingRef.current = false;
            }
            return newPending;
          });
        }
      } else {
        // Legacy behavior: if no result returned, assume all succeeded
        // and clear all pending files that were uploaded
        const uploadedFileNames = files.map((f) => f.name);
        setPendingFiles((prev) => {
          const newPending = prev.filter(
            (pf) => !uploadedFileNames.includes(pf.name)
          );
          // Clear PrimeReact's internal state if no more pending files
          if (newPending.length === 0) {
            isClearingRef.current = true;
            fileUploadRef.current?.clear();
            isClearingRef.current = false;
          }
          return newPending;
        });
      }
    } catch {
      toast.error(t('UPLOAD_FAILED'));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle clear/cancel - only clear our state if not already clearing
  const handleClear = () => {
    if (isClearingRef.current) return; // Prevent infinite loop
    setPendingFiles([]);
  };

  // Template for pending files (being uploaded)
  const renderPendingFile = (file: File) => {
    return (
      <div
        key={`pending-${file.name}`}
        className="flex gap-4 items-center justify-between p-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
      >
        <div className="flex items-center gap-3 flex-1">
          <i className="pi pi-file text-2xl text-gray-400" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{file.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
              {isUploading && (
                <span className="ml-2 text-primary-500">Uploading...</span>
              )}
            </div>
          </div>
          <Tag
            value={file.name.split('.').pop()?.toUpperCase()}
            severity="info"
            className="text-xs"
          />
        </div>
        <Button
          icon="pi pi-trash"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePendingFileRemove(file);
          }}
          disabled={isUploading || disabled}
          severity="danger"
          rounded
          size="small"
          tooltip="Remove file"
          tooltipOptions={{ position: 'left' }}
          data-testid={`remove-pending-file-${file.name.replace(/\s+/g, '-')}`}
        />
      </div>
    );
  };

  // Template for uploaded files (already uploaded with URL)
  const renderUploadedFile = (file: UploadedFile, index: number) => {
    return (
      <div
        key={`uploaded-${file.url}`}
        className="flex gap-4 items-center justify-between p-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
      >
        <div className="flex items-center gap-3 flex-1">
          <i className="pi pi-file text-2xl text-green-500" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{file.name}</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Uploaded
              {file.size && ` • ${formatFileSize(file.size)}`}
            </div>
          </div>
          <Tag
            value={file.name.split('.').pop()?.toUpperCase()}
            severity="success"
            className="text-xs"
          />
        </div>
        <Button
          icon="pi pi-trash"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleUploadedFileRemove(file);
          }}
          disabled={isUploading || disabled}
          severity="danger"
          rounded
          size="small"
          tooltip="Remove file"
          tooltipOptions={{ position: 'left' }}
          data-testid={`remove-uploaded-file-${index}`}
        />
      </div>
    );
  };

  // Empty template for drag and drop area
  const emptyTemplate = () => {
    // If there are files (pending or uploaded), don't show empty state
    if (pendingFiles.length > 0 || uploadedFiles.length > 0) {
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all rounded-lg">
        <i className="pi pi-cloud-upload text-4xl text-primary-500 dark:text-primary-400 mb-3" />
        <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {enableDragDrop ? t('CLICK_OR_DRAG_DROP') : t('CLICK_TO_SELECT')}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {acceptedExtensions && acceptedExtensions.length > 0
            ? t('ACCEPTED_FORMATS', { formats: acceptedExtensions.join(', ') })
            : t('ALL_FORMATS_ACCEPTED')}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {t('MAX_FILE_SIZE', { size: formatFileSize(maxFileSize) })}
        </p>
      </div>
    );
  };

  // Check if we have any files (pending or uploaded)
  const hasFiles = pendingFiles.length > 0 || uploadedFiles.length > 0;

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
      <div
        className={clsx(
          className,
          '[&_.p-fileupload-buttonbar]:hidden',
          // Hide PrimeReact's content when we have our own files to show
          hasFiles && '[&_.p-fileupload-content]:hidden'
        )}
      >
        <div onClick={() => fileUploadRef?.current?.getInput()?.click()}>
          <FileUpload
            ref={fileUploadRef}
            id={inputId}
            multiple={maxFiles > 1}
            accept={acceptString}
            // When hideBuiltInValidation is true, don't pass maxFileSize to PrimeReact
            // so it won't validate internally - our handleSelect will do custom validation
            {...(!hideBuiltInValidation && { maxFileSize })}
            disabled={disabled || isUploading}
            onSelect={handleSelect}
            onRemove={handleRemoveEvent}
            onClear={handleClear}
            emptyTemplate={emptyTemplate}
            itemTemplate={() => null}
            chooseLabel={labels.choose}
            cancelLabel={labels.cancel}
            className={`w-full ${error ? 'p-invalid' : ''}`}
            customUpload
            auto={false}
            {...fileUploadProps}
          />
        </div>
        {/* Custom file list - only shown when we have files */}
        {hasFiles && (
          <div
            className="border border-surface-200 dark:border-surface-700 border-t-0 rounded-b-lg bg-surface-0 dark:bg-surface-900 p-2 cursor-pointer"
            onClick={() => fileUploadRef?.current?.getInput()?.click()}
          >
            {/* Uploaded files first */}
            {uploadedFiles.map((file, index) =>
              renderUploadedFile(file, index)
            )}
            {/* Then pending files */}
            {pendingFiles.map((file) => renderPendingFile(file))}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
