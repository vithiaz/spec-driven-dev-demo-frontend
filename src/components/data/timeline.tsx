'use client';

import { ReactNode } from 'react';
import {
  Timeline as PrimeTimeline,
  TimelineProps as PrimeTimelineProps,
} from 'primereact/timeline';
import clsx from 'clsx';
import { Tag } from '../misc';

export interface TimelineEvent {
  id?: string | number;
  status?: string;
  statusColor?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  title?: string;
  tags?: string[];
  subtitle?: string;
  type?: 'user' | 'course' | 'other';
  score?: string | number;
  description?: string;
  amount?: number;
  [key: string]: unknown;
}

export interface TimelineProps
  extends Omit<PrimeTimelineProps, 'content' | 'marker'> {
  events: TimelineEvent[];
  layout?: 'vertical' | 'horizontal';
  align?: 'left' | 'right' | 'alternate' | 'top' | 'bottom';

  // Custom renderers
  marker?: (event: TimelineEvent, index: number) => ReactNode;
  content?: (event: TimelineEvent, index: number) => ReactNode;
  opposite?: (event: TimelineEvent, index: number) => ReactNode;

  // Show opposite content on right side (for align="left")
  showOpposite?: boolean;

  // Styling
  className?: string;
  containerClassName?: string;
}

export function Timeline({
  events = [],
  layout = 'vertical',
  align = 'left',
  marker,
  content,
  opposite,
  showOpposite = false,
  className = '',
  containerClassName = '',
  ...timelineProps
}: TimelineProps) {
  // Default marker renderer
  const defaultMarker = (event: TimelineEvent) => {
    if (marker) {
      return marker(event, events.indexOf(event));
    }

    const iconColor = event.color || 'var(--primary-color)';
    const icon = event.icon || 'pi pi-circle';

    if (event.image) {
      return (
        <div className="flex items-center justify-center h-10 rounded-md overflow-hidden border-2 border-surface-border bg-surface-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image}
            alt={event.title || 'Timeline event'}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-center h-10 px-2 rounded-md border-2 shadow-sm"
        style={{
          backgroundColor: iconColor,
          borderColor: iconColor,
        }}
      >
        <i className={clsx(icon, 'text-white text-lg')} />
      </div>
    );
  };

  // Default content renderer
  const defaultContent = (event: TimelineEvent) => {
    if (content) {
      return content(event, events.indexOf(event));
    }

    return (
      <div className="flex justify-between mb-4">
        <div className="px-2">
          <div className="flex gap-2 align-items-center flex-row mb-2">
            {event.title && (
              <h3 className="text-sm font-semibold text-gray-900">
                {event.title}
              </h3>
            )}
            {event.tags && event.tags.length > 0 && (
              <>
                {event.tags.map((tag, idx) => (
                  <Tag key={idx} className="text-xs" severity="secondary">
                    {tag}
                  </Tag>
                ))}
              </>
            )}
          </div>
          {event.description && (
            <p className="text-sm text-muted-foreground mb-1">
              {event.description}
            </p>
          )}
          <div className="flex gap-3 align-items-center">
            {event.subtitle && (
              <p className="text-xs text-muted-foreground">
                {event.type === 'course' && (
                  <i
                    className="pi pi-book mr-1"
                    style={{ fontSize: '0.8rem' }}
                  />
                )}
                {event.type === 'user' && (
                  <i
                    className="pi pi-user mr-1"
                    style={{ fontSize: '0.8rem' }}
                  />
                )}
                {event.subtitle}
              </p>
            )}
            {event.score && (
              <p className="text-xs text-muted-foreground flex align-items-center">
                <i
                  className="pi pi-trophy mr-1"
                  style={{ fontSize: '0.8rem' }}
                />
                {event.score}
              </p>
            )}
            {event.status && (
              <Tag
                value={
                  event.status?.charAt(0).toUpperCase() + event.status?.slice(1)
                }
                style={{
                  background: `${event.statusColor}20`, // adds ~12.5% opacity (hex alpha)
                  border: `1px solid ${event.statusColor}`,
                  color: event.statusColor,
                  fontWeight: 'bold',
                }}
              />
            )}
          </div>
        </div>
        {/* Show date in content if not showing opposite */}
        {!showOpposite && event.date && (
          <p className="text-xs text-color-secondary mt-2 flex align-items-center">
            <i className="pi pi-calendar mr-2" />
            {event.date}
          </p>
        )}
      </div>
    );
  };

  // Default opposite content renderer
  const defaultOpposite = (event: TimelineEvent) => {
    if (opposite) {
      return opposite(event, events.indexOf(event));
    }

    // Show date on opposite side if enabled
    if (showOpposite && align === 'left' && event.date) {
      return (
        <div className="text-right">
          <span className="text-sm text-color-secondary font-medium">
            {event.date}
          </span>
        </div>
      );
    }

    if (showOpposite && align === 'right' && event.date) {
      return (
        <div className="text-left">
          <span className="text-sm text-color-secondary font-medium">
            {event.date}
          </span>
        </div>
      );
    }

    if (align === 'alternate' && event.date) {
      return (
        <span className="text-sm text-color-secondary font-medium">
          {event.date}
        </span>
      );
    }

    return null;
  };

  return (
    <div className={clsx('timeline-container', containerClassName)}>
      <PrimeTimeline
        value={events}
        layout={layout}
        align={align}
        marker={defaultMarker as never}
        content={defaultContent as never}
        opposite={defaultOpposite as never}
        className={clsx('surface-ground', className)}
        {...timelineProps}
      />
    </div>
  );
}

export default Timeline;
