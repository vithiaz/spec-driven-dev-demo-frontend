/**
 * SecuredAudio Component
 *
 * requirements: [ac-001-lms-frontend-course-management-manage-course-material]
 * scenarios: [preview-audio-file, ac-004-audio-load-error]
 *
 * A wrapper around HTML5 audio that handles private/secured storage URLs.
 * Automatically converts Supabase storage URLs to proxied URLs that go through
 * the authenticated Next.js API route.
 *
 * Use this component when displaying audio from private Supabase storage buckets.
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  convertPublicUrlToProxied,
  isStorageUrl,
} from '@/lib/utils/storage-url';

export interface SecuredAudioProps extends React.AudioHTMLAttributes<HTMLAudioElement> {
  /**
   * The audio source URL. Can be:
   * - A full Supabase storage URL (public or signed)
   * - A storage path (e.g., "assets/courses/abc/audio.mp3")
   * - A regular URL (will be passed through unchanged)
   */
  src: string;
  /**
   * Fallback message to display if the audio fails to load.
   */
  fallbackMessage?: string;
  /**
   * Callback when audio fails to load
   */
  onLoadError?: () => void;
}

/**
 * SecuredAudio component for displaying audio from private storage.
 *
 * @example
 * // Basic usage with Supabase storage URL
 * <SecuredAudio
 *   src="https://xxx.supabase.co/storage/v1/object/public/materials/audio.mp3"
 *   controls
 *   preload="none"
 *   className="w-full"
 * />
 *
 * @example
 * // With storage path
 * <SecuredAudio
 *   src="courses/123/materials/lecture.mp3"
 *   controls
 *   preload="metadata"
 *   aria-label="Lecture audio"
 * />
 *
 * @example
 * // With fallback message
 * <SecuredAudio
 *   src={audioUrl}
 *   controls
 *   fallbackMessage="Audio not available"
 * />
 */
export function SecuredAudio({
  src,
  fallbackMessage = 'Audio failed to load',
  onLoadError,
  onError,
  ...props
}: SecuredAudioProps) {
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

  // Handle audio load error
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      setHasError(true);

      // Call the original onError handler if provided
      if (onError) {
        onError(e);
      }

      // Call the onLoadError callback if provided
      if (onLoadError) {
        onLoadError();
      }
    },
    [onError, onLoadError]
  );

  if (!securedSrc) {
    return null;
  }

  // If there was an error, show error state
  if (hasError) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
        data-testid="secured-audio-error"
      >
        <i className="pi pi-exclamation-triangle text-2xl text-gray-400 mr-2" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {fallbackMessage}
        </p>
      </div>
    );
  }

  return (
    <audio
      src={securedSrc}
      onError={handleError}
      data-testid="secured-audio-player"
      {...props}
    />
  );
}

export default SecuredAudio;
