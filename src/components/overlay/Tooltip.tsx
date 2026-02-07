'use client';

import {
  Tooltip as PrimeTooltip,
  TooltipProps as PrimeTooltipProps,
} from 'primereact/tooltip';
import { ReactNode, SyntheticEvent, useCallback, useRef } from 'react';

// Define TooltipEvent type based on PrimeReact's internal type
interface TooltipEventType {
  originalEvent: SyntheticEvent;
  target: HTMLElement;
}

export interface TooltipProps extends Omit<PrimeTooltipProps, 'className'> {
  target?: string;
  content?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  mouseTrack?: boolean;
  mouseTrackTop?: number;
  mouseTrackLeft?: number;
  showDelay?: number;
  hideDelay?: number;
  autoHide?: boolean;
  className?: string;
  containerClassName?: string;
}

/**
 * Get the best position for tooltip based on viewport boundaries
 */
function getBestPosition(
  targetEl: HTMLElement,
  preferredPosition: 'top' | 'bottom' | 'left' | 'right'
): 'top' | 'bottom' | 'left' | 'right' {
  const rect = targetEl.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Estimated tooltip size (can be adjusted based on actual tooltip dimensions)
  const tooltipEstimatedWidth = 200;
  const tooltipEstimatedHeight = 50;
  const margin = 10;

  const spaceTop = rect.top;
  const spaceBottom = viewportHeight - rect.bottom;
  const spaceLeft = rect.left;
  const spaceRight = viewportWidth - rect.right;

  // Check if preferred position has enough space
  switch (preferredPosition) {
    case 'top':
      if (spaceTop >= tooltipEstimatedHeight + margin) return 'top';
      break;
    case 'bottom':
      if (spaceBottom >= tooltipEstimatedHeight + margin) return 'bottom';
      break;
    case 'left':
      if (spaceLeft >= tooltipEstimatedWidth + margin) return 'left';
      break;
    case 'right':
      if (spaceRight >= tooltipEstimatedWidth + margin) return 'right';
      break;
  }

  // Find the best alternative position
  const positions: Array<{
    pos: 'top' | 'bottom' | 'left' | 'right';
    space: number;
  }> = [
    { pos: 'top', space: spaceTop },
    { pos: 'bottom', space: spaceBottom },
    { pos: 'left', space: spaceLeft },
    { pos: 'right', space: spaceRight },
  ];

  // Sort by available space and return the best one
  positions.sort((a, b) => b.space - a.space);

  return positions[0].pos;
}

export function Tooltip({
  target,
  content,
  position = 'top',
  className = '',
  containerClassName = '',
  onBeforeShow,
  ...tooltipProps
}: TooltipProps) {
  const tooltipRef = useRef<PrimeTooltip>(null);
  const currentPositionRef = useRef<'top' | 'bottom' | 'left' | 'right'>(
    position
  );

  const handleBeforeShow = useCallback(
    (e: TooltipEventType) => {
      // Calculate best position based on viewport
      const bestPosition = getBestPosition(e.target, position);
      currentPositionRef.current = bestPosition;

      // Update tooltip position dynamically
      if (tooltipRef.current) {
        const tooltipEl = (
          tooltipRef.current as unknown as { el: HTMLElement | null }
        ).el;
        if (tooltipEl) {
          // Remove existing position classes
          tooltipEl.classList.remove(
            'p-tooltip-top',
            'p-tooltip-bottom',
            'p-tooltip-left',
            'p-tooltip-right'
          );
          // Add the correct position class
          tooltipEl.classList.add(`p-tooltip-${bestPosition}`);
        }
      }

      // Call original onBeforeShow if provided
      onBeforeShow?.(e);
    },
    [position, onBeforeShow]
  );

  return (
    <div className={containerClassName}>
      <PrimeTooltip
        ref={tooltipRef}
        target={target}
        content={content}
        position={currentPositionRef.current}
        className={className}
        onBeforeShow={handleBeforeShow}
        {...tooltipProps}
      />
    </div>
  );
}
