# Performance Best Practices

> **Purpose**: Standards for React Query caching, image optimization, and code splitting  
> **When to use**: Implementing data fetching, images, or large components

## Query Stale Time

### Default Stale Times

| Data Type | Stale Time | When to Use                        |
| --------- | ---------- | ---------------------------------- |
| Static    | 1 hour     | Rarely changes (roles, countries)  |
| Standard  | 1 minutes  | Typical data (user lists, courses) |
| Dynamic   | 1 minute   | Frequently updated (notifications) |
| Realtime  | 0          | Always refetch (live data)         |

```typescript
const STALE_TIME = {
  static: 1000 * 60 * 60, // 1 hour
  standard: 1000 * 60, // 5 minutes
  dynamic: 1000 * 60, // 1 minute
  realtime: 0, // Always refetch
};
```

### Usage Examples

```tsx
// Static data (roles, countries)
useQuery({
  queryKey: ['roles'],
  queryFn: fetchRoles,
  staleTime: 1000 * 60 * 60, // 1 hour
});

// Standard data (user lists)
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 1000 * 60, // 1 minutes
  gcTime: 1000 * 60, // Cache time
});
```

## Image Optimization

**Always use `next/image`**

```tsx
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="User profile"
  width={200}
  height={200}
  quality={75} // Default quality
  priority={false} // Lazy load by default
/>;
```

### Guidelines

- Set explicit `width` and `height`
- Use `priority` only for above-fold images
- Provide descriptive `alt` text
- Optimize images before upload (< 500KB)

## Code Splitting

**Dynamic imports for large components**

```tsx
const ChartComponent = dynamic(() => import('@/components/chart/BarChart'), {
  loading: () => <Spinner />,
  ssr: false, // Client-side only if needed
});
```

### Guidelines

- Keep initial bundle < 200KB (gzipped)
- Lazy load routes with dynamic imports
- Lazy load heavy libraries (charts, editors)
- Monitor bundle with `npm run analyze`
