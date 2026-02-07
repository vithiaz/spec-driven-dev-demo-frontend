'use client';

import clsx from 'clsx';
import { Dialog, DialogProps } from 'primereact/dialog';
import { ReactNode } from 'react';

export interface ModalProps extends Omit<DialogProps, 'className'> {
  visible: boolean;
  onHide: () => void;
  title?: string;
  /** Optional data-testid for the title element */
  titleTestId?: string;
  showCloseIcon?: boolean;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  dialogClassName?: string;
  modal?: boolean;
  dismissableMask?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  maximizable?: boolean;
  position?:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
}

export function Modal({
  visible,
  onHide,
  title,
  titleTestId,
  showCloseIcon = true,
  footer,
  children,
  className = '',
  containerClassName = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  modal = true,
  ...dialogProps
}: ModalProps) {
  const headerTemplate = title ? (
    <div className={`flex items-center justify-between ${headerClassName}`}>
      <h2 className="text-xl font-semibold" data-testid={titleTestId}>
        {title}
      </h2>
    </div>
  ) : undefined;

  const footerTemplate = footer ? (
    <div className={clsx('section-ground p-3', footerClassName)}>{footer}</div>
  ) : undefined;

  return (
    <div className={clsx('section-ground', containerClassName)}>
      <Dialog
        visible={visible}
        onHide={onHide}
        header={headerTemplate}
        footer={footerTemplate}
        closable={showCloseIcon}
        modal={modal}
        headerClassName="section-ground"
        className={clsx('section-ground', className)}
        contentClassName="section-ground"
        {...dialogProps}
      >
        <div className={contentClassName}>{children}</div>
      </Dialog>
    </div>
  );
}
