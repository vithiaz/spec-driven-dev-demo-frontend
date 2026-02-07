'use client';

import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Dialog, DialogProps } from 'primereact/dialog';
import { ReactNode } from 'react';

export interface DialogConfirmationProps extends Omit<
  DialogProps,
  'footer' | 'header' | 'visible' | 'onHide'
> {
  visible: boolean;
  onHide: () => void;
  title?: string;
  description?: string | ReactNode;
  children?: ReactNode;
  showCloseIcon?: boolean;
  headerIcon?: ReactNode;

  // Footer actions
  footer?: ReactNode;
  showCancelButton?: boolean;
  showSubmitButton?: boolean;
  cancelText?: string;
  submitText?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  submitLoading?: boolean;
  submitSeverity?:
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'help';
  cancelSeverity?:
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'help';

  // Test identifiers for E2E testing
  cancelTestId?: string;
  submitTestId?: string;
  'data-testid'?: string;

  // Styling
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  descriptionClassName?: string;
}

export function DialogConfirmation({
  visible,
  onHide,
  title = 'Confirm Action',
  description,
  children,
  showCloseIcon = true,
  headerIcon,

  // Footer props
  footer,
  showCancelButton = true,
  showSubmitButton = true,
  cancelText = 'Cancel',
  submitText = 'Submit',
  onCancel,
  onSubmit,
  submitDisabled = false,
  cancelDisabled = false,
  submitLoading = false,
  submitSeverity = 'secondary',
  cancelSeverity = 'secondary',

  // Test identifiers
  cancelTestId,
  submitTestId,
  'data-testid': dataTestId,

  // Styling
  className = '',
  containerClassName = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  descriptionClassName = '',

  ...dialogProps
}: DialogConfirmationProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onHide();
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const headerTemplate = (
    <div className={`flex items-center gap-3 ${headerClassName}`}>
      {headerIcon && <div className="flex-shrink-0">{headerIcon}</div>}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );

  const defaultFooterTemplate = (
    <div className={`flex gap-2 justify-end p-4 ${footerClassName}`}>
      {showCancelButton && (
        <Button
          type="button"
          label={cancelText}
          severity={cancelSeverity}
          outlined
          onClick={handleCancel}
          disabled={cancelDisabled || submitLoading}
          size="small"
          data-testid={cancelTestId}
        />
      )}
      {showSubmitButton && (
        <Button
          type="button"
          label={submitText}
          severity={submitSeverity}
          onClick={handleSubmit}
          disabled={submitDisabled}
          loading={submitLoading}
          size="small"
          data-testid={submitTestId}
        />
      )}
    </div>
  );

  const footerTemplate = footer || defaultFooterTemplate;

  return (
    <div className={clsx(containerClassName)}>
      <Dialog
        visible={visible}
        onHide={onHide}
        header={headerTemplate}
        footer={footerTemplate}
        closable={showCloseIcon}
        headerClassName="section-ground"
        className={clsx('section-ground', className)}
        contentClassName="section-ground"
        pt={{
          root: {
            'data-testid': dataTestId,
          } as React.HTMLAttributes<HTMLDivElement>,
          footer: { className: 'section-ground' },
        }}
        {...dialogProps}
      >
        <div className={contentClassName}>
          {description && (
            <div className={`mb-4 ${descriptionClassName}`}>
              {typeof description === 'string' ? (
                <p className="text-gray-700 dark:text-gray-300">
                  {description}
                </p>
              ) : (
                description
              )}
            </div>
          )}
          {children}
        </div>
      </Dialog>
    </div>
  );
}
