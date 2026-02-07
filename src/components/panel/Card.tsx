'use client';

import clsx from 'clsx';
import {
  Card as PrimeCard,
  CardProps as PrimeCardProps,
} from 'primereact/card';
import { ReactNode } from 'react';

export interface CardProps extends Omit<PrimeCardProps, 'className'> {
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  'data-testid'?: string;
  onClick?: () => void;
}

export function Card({
  title,
  subtitle,
  header,
  footer,
  children,
  className = '',
  containerClassName = '',
  'data-testid': dataTestId,
  onClick,
  ...cardProps
}: CardProps) {
  return (
    <div
      className={containerClassName}
      data-testid={dataTestId}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <PrimeCard
        title={title}
        subTitle={subtitle}
        header={
          <div
            className={clsx({
              'bg-section-background px-5 py-4 flex items-center justify-between border-b border-border':
                !!header,
            })}
          >
            {header}
          </div>
        }
        footer={footer}
        className={className}
        {...cardProps}
      >
        {children}
      </PrimeCard>
    </div>
  );
}
