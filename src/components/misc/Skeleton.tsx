'use client';

import {
  Skeleton as PrimeSkeleton,
  SkeletonProps as PrimeSkeletonProps,
} from 'primereact/skeleton';

export interface SkeletonProps extends PrimeSkeletonProps {
  containerClassName?: string;
}

export function Skeleton({ containerClassName = '', ...props }: SkeletonProps) {
  return (
    <div className={containerClassName}>
      <PrimeSkeleton {...props} />
    </div>
  );
}
