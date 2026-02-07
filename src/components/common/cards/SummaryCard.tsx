'use client';

import { ReactNode } from 'react';
import clsx from '@/utils/cn';
import { Card } from '@/components/panel';

type ValuePosition = 'top' | 'bottom';

export interface SummaryCardProps {
  // Icon
  icon: string;
  iconColor?: string;
  iconBackground?: string;

  // Content
  title: string;
  value: string | number;
  valuePosition?: ValuePosition;

  // Styling
  className?: string;
  iconClassName?: string;

  // Custom render
  customIcon?: ReactNode;
  footer?: ReactNode;

  // Testing
  'data-testid'?: string;
}

export function SummaryCard({
  icon,
  iconColor = 'text-white',
  iconBackground = 'bg-primary',
  title,
  value,
  valuePosition = 'top',
  className = '',
  iconClassName = '',
  customIcon,
  footer,
  'data-testid': dataTestId,
}: SummaryCardProps) {
  const renderIcon = () => {
    if (customIcon) {
      return customIcon;
    }

    return (
      <div
        className={clsx(
          'flex items-center justify-center w-14 h-14 rounded-lg',
          iconBackground,
          iconClassName
        )}
      >
        <i className={clsx(icon, 'text-2xl', iconColor)} />
      </div>
    );
  };

  const renderContent = () => {
    if (valuePosition === 'top') {
      return (
        <>
          <div className="text-3xl text-color mb-1">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </>
      );
    }

    return (
      <>
        <div className="text-sm text-muted-foreground mb-1">{title}</div>
        <div className="text-3xl text-color">{value}</div>
      </>
    );
  };

  return (
    <Card
      className={clsx('h-full', className, 'w-full')}
      containerClassName="w-full"
      data-testid={dataTestId}
    >
      <div className="flex items-center gap-4">
        {/* Icon Section */}
        {customIcon ||
          (icon && <div className="flex-shrink-0">{renderIcon()}</div>)}

        {/* Content Section */}
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-3 pt-3 border-t border-surface-border">{footer}</div>
      )}
    </Card>
  );
}

export default SummaryCard;
