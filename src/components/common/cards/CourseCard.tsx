'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from '@/components/misc';
import { Tag } from '@/components/misc';
import clsx from 'clsx';

/**
 * Validates if a URL is valid for next/image component.
 * Must be an absolute URL (http/https) or start with a leading slash.
 * Returns the default image for invalid URLs.
 */
function getValidImageUrl(url: string | undefined, defaultUrl: string): string {
  if (!url) return defaultUrl;
  // Valid patterns: starts with /, http://, or https://
  if (
    url.startsWith('/') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    return url;
  }
  // Invalid relative path - return default
  return defaultUrl;
}

export interface CourseCardProps {
  // Basic Info
  id?: string | number;
  title: string;
  image?: string;
  imageAlt?: string;

  // Category & Tags
  category?: string;
  tags?: string[];

  // Progress (optional)
  showProgress?: boolean;
  progress?: number; // 0-100
  remainingDays?: number;
  remainingHours?: number;

  // Hierarchy
  roadmapTitle?: string;
  programTitle?: string;
  codeProgram?: string;
  codeRoadmap?: string;
  facultyTitle?: string;

  // Metadata
  creator?: string;
  creatorAvatar?: string;
  createdAt?: string | Date;

  // Actions
  onEdit?: () => void;
  onContinue?: () => void;
  editLabel?: string;
  continueLabel?: string;

  // Styling
  className?: string;
  imageHeight?: number;

  // Custom render
  footer?: ReactNode;
  actions?: ReactNode;
  showActions?: boolean;
}

export function CourseCard({
  title,
  image = '/images/default-course.jpg',
  imageAlt,
  category,
  tags = [],
  showProgress = false,
  progress = 0,
  remainingDays,
  remainingHours,
  creator,
  createdAt,
  onEdit,
  onContinue,
  editLabel = 'Edit',
  continueLabel = 'Continue',
  className = '',
  imageHeight = 200,
  footer,
  actions,
  roadmapTitle,
  programTitle,
  id,
  showActions = false,
  codeProgram,
  codeRoadmap,
  facultyTitle,
}: CourseCardProps) {
  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderRemaining = () => {
    if (!showProgress) return null;

    if (remainingDays !== undefined && remainingDays > 0) {
      return (
        <span className="text-xs text-muted-foreground flex items-center">
          <i className="pi pi-clock mr-1 text-muted-foreground" />
          {remainingDays} day{remainingDays !== 1 ? 's' : ''} remaining
        </span>
      );
    }

    if (remainingHours !== undefined && remainingHours > 0) {
      return (
        <span className="text-xs text-muted-foreground">
          <i className="pi pi-clock mr-1" />
          {remainingHours} hour{remainingHours !== 1 ? 's' : ''} remaining
        </span>
      );
    }

    return null;
  };

  const header = (
    <div
      className="relative w-full overflow-hidden bg-surface-100"
      style={{ height: imageHeight }}
    >
      <Image
        src={getValidImageUrl(image, '/images/default-course.jpg')}
        alt={imageAlt || title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {category && (
        <div className="absolute top-3 right-3">
          <Tag value={category} severity="success" className="shadow-md" />
        </div>
      )}
    </div>
  );

  const cardFooter = footer || (
    <div className="flex gap-2 pt-3">
      {onEdit && (
        <Button
          label={editLabel}
          icon="pi pi-pencil"
          severity="info"
          outlined
          size="small"
          onClick={onEdit}
          className="flex-1"
        />
      )}
      {onContinue && (
        <Button
          label={continueLabel}
          size="small"
          onClick={onContinue}
          className="flex-1"
        />
      )}
    </div>
  );

  return (
    <Card
      header={header}
      footer={showActions ? cardFooter : undefined}
      className={clsx(
        'overflow-hidden hover:shadow-lg transition-shadow duration-300 min-w-[32%]',
        className
      )}
    >
      <div className="">
        {id && <p className="text-xs text-muted-foreground">{id}</p>}

        {/* Title */}
        <h3 className="mb-3">{title}</h3>

        {/* Description */}
        {roadmapTitle && codeRoadmap && (
          <div>
            <div className="text-sm line-clamp-3 primary-color">
              {roadmapTitle}
            </div>
            <div className="text-xs line-clamp-3 text-muted-foreground">
              {codeRoadmap} - {facultyTitle}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Tag key={index} value={tag} severity="secondary" />
            ))}
          </div>
        )}

        {/* Progress Section */}
        {showProgress && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary">{progress}% Complete</span>
              {renderRemaining()}
            </div>
            <ProgressBar
              mode="determinate"
              value={progress}
              showValue={false}
            />
          </div>
        )}

        {programTitle && codeProgram && (
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex text-xs items-center text-muted-foreground">
              <span>{codeProgram}</span>
            </div>
            <div className="flex text-sm items-center gap-1">
              <i className="pi pi-book" />
              <span>{programTitle}</span>
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        {creator && createdAt && (
          <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground border-t mt-3">
            {creator && (
              <div className="flex items-center gap-2">
                <span>{creator}</span>
              </div>
            )}
            {createdAt && (
              <div className="flex items-center gap-1">
                <i className="pi pi-calendar" />
                <span>{formatDate(createdAt)}</span>
              </div>
            )}
          </div>
        )}

        {/* Custom Actions */}
        {actions && showActions && <div className="pt-2">{actions}</div>}
      </div>
    </Card>
  );
}

export default CourseCard;
