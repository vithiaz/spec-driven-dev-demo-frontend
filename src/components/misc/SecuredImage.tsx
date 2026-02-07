/**
 * SecuredImage Component
 *
 * A wrapper around Next.js Image that handles private/secured storage URLs.
 * Automatically converts Supabase storage URLs to proxied URLs that go through
 * the authenticated Next.js API route.
 *
 * Use this component when displaying images from private Supabase storage buckets.
 */

'use client';

import Image, { ImageProps } from 'next/image';
import { useMemo } from 'react';
import {
  convertPublicUrlToProxied,
  isStorageUrl,
} from '@/lib/utils/storage-url';

export interface SecuredImageProps extends Omit<ImageProps, 'src'> {
  /**
   * The image source URL. Can be:
   * - A full Supabase storage URL (public or signed)
   * - A storage path (e.g., "assets/courses/abc/cover.jpg")
   * - A regular URL (will be passed through unchanged)
   */
  src: string;
  /**
   * Fallback image to display if the main image fails to load.
   * If not provided, a default placeholder will be used.
   */
  fallbackSrc?: string;
}

/**
 * SecuredImage component for displaying images from private storage.
 *
 * @example
 * // Basic usage with Supabase storage URL
 * <SecuredImage
 *   src="https://xxx.supabase.co/storage/v1/object/public/assets/image.jpg"
 *   alt="My image"
 *   width={200}
 *   height={200}
 * />
 *
 * @example
 * // With storage path
 * <SecuredImage
 *   src="assets/announcements/123/attachment.jpg"
 *   alt="Attachment"
 *   fill
 *   className="object-cover"
 * />
 *
 * @example
 * // With fallback
 * <SecuredImage
 *   src={imageUrl}
 *   alt="User photo"
 *   width={100}
 *   height={100}
 *   fallbackSrc="/images/placeholder.png"
 * />
 */
export function SecuredImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: SecuredImageProps) {
  // Convert storage URLs to proxied URLs for authentication
  const securedSrc = useMemo(() => {
    if (!src) return fallbackSrc || '';

    // Check if this is a storage URL that needs proxying
    if (isStorageUrl(src)) {
      return convertPublicUrlToProxied(src);
    }

    // For non-storage URLs (e.g., external URLs), return as-is
    return src;
  }, [src, fallbackSrc]);

  // Handle image load error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
  };

  if (!securedSrc) {
    return null;
  }

  return (
    <Image
      src={securedSrc}
      alt={alt}
      onError={handleError}
      unoptimized // Required for proxied URLs
      {...props}
    />
  );
}

export default SecuredImage;
