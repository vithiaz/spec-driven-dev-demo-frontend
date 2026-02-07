'use client';

import {
  Tooltip as PrimeTooltip,
  TooltipProps as PrimeTooltipProps,
} from 'primereact/tooltip';

export interface TooltipProps extends PrimeTooltipProps {
  /**
   * Content to display in the tooltip
   */
  content: string;
  /**
   * CSS selector for the target element
   */
  target: string;
  /**
   * Prevent text wrapping in tooltip
   * @default true
   */
  noWrap?: boolean;
}

export function Tooltip({
  noWrap = true,
  pt,
  ...props
}: TooltipProps) {
  const passthroughProps = noWrap
    ? {
        ...pt,
        text: {
          style: {
            whiteSpace: 'nowrap',
          },
        },
      }
    : pt;

  return <PrimeTooltip pt={passthroughProps} {...props} />;
}
