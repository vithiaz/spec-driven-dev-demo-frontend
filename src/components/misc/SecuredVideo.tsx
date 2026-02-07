/**
 * SecuredVideo Component
 *
 * requirements: [ac-004-lms-frontend-course-management-view-course-detail-overview]
 * scenarios: [ac-004-play-internal-video, ac-004-video-load-error]
 *
 * A wrapper around HTML5 video that handles private/secured storage URLs.
 * Automatically converts Supabase storage URLs to proxied URLs that go through
 * the authenticated Next.js API route.
 *
 * Use this component when displaying videos from private Supabase storage buckets.
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  convertPublicUrlToProxied,
  isStorageUrl,
} from '@/lib/utils/storage-url';

export interface SecuredVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  /**
   * The video source URL. Can be:
   * - A full Supabase storage URL (public or signed)
   * - A storage path (e.g., "assets/courses/abc/intro-video.webm")
   * - A regular URL (will be passed through unchanged)
   */
  src: string;
  /**
   * Fallback poster image to display if the video fails to load.
   */
  fallbackPoster?: string;
}

/**
 * SecuredVideo component for displaying videos from private storage.
 *
 * @example
 * // Basic usage with Supabase storage URL
 * <SecuredVideo
 *   src="https://xxx.supabase.co/storage/v1/object/public/assets/courses/abc/intro.webm"
 *   controls
 *   preload="none"
 *   className="w-full h-full"
 * />
 *
 * @example
 * // With storage path
 * <SecuredVideo
 *   src="assets/courses/123/intro-video.mp4"
 *   controls
 *   preload="none"
 *   aria-label="Course introduction video"
 * />
 *
 * @example
 * // With fallback poster
 * <SecuredVideo
 *   src={videoUrl}
 *   controls
 *   fallbackPoster="/images/video-error-placeholder.png"
 * />
 */
export function SecuredVideo({
  src,
  fallbackPoster,
  onError,
  ...props
}: SecuredVideoProps) {
  const [hasError, setHasError] = useState(false);

  // Convert storage URLs to proxied URLs for authentication
  const securedSrc = useMemo(() => {
    if (!src) return '';

    // Check if this is a storage URL that needs proxying
    if (isStorageUrl(src)) {
      return convertPublicUrlToProxied(src);
    }

    // For non-storage URLs (e.g., external URLs), return as-is
    return src;
  }, [src]);

  // Handle video load error
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setHasError(true);

      // Call the original onError handler if provided
      if (onError) {
        onError(e);
      }
    },
    [onError]
  );

  if (!securedSrc) {
    return null;
  }

  // If there was an error and we have a fallback poster, show it
  if (hasError && fallbackPoster) {
    return (
      <div
        className="relative flex items-center justify-center bg-gray-100 rounded-lg"
        data-testid="course-overview-video-error"
        style={{ aspectRatio: '16/9' }}
      >
        <Image
          src={fallbackPoster}
          alt="Video unavailable"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    );
  }

  // If there was an error but no fallback, show error state
  if (hasError) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8"
        data-testid="course-overview-video-error"
        style={{ aspectRatio: '16/9' }}
      >
        <i className="pi pi-exclamation-triangle text-4xl text-gray-400 mb-2" />
        <p className="text-gray-600 text-center">Video failed to load</p>
      </div>
    );
  }

  return (
    <video
      src={securedSrc}
      onError={handleError}
      poster={fallbackPoster}
      {...props}
    />
  );
}

export default SecuredVideo;
