# Date and Time Formatting Standards

> **Purpose**: Default date-time formats for Indonesian and English locales  
> **When to use**: Displaying dates, timestamps, or any temporal data

## Standard Format (REQUIRED)

**All date fields MUST include time information.**

### Indonesian Format

```
Format: "d MMM yyyy HH:mm"
Example: "8 Des 2025 11:16"
```

**Guidelines**:

- **Short month name**: "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
- **24-hour time**: "HH:mm" (e.g., "11:16", "23:45")
- **No leading zero for day**: "8 Des" not "08 Des"
- **No comma**: Between date and time

### English Format

```
Format: "MMM d, yyyy hh:mm a"
Example: "Dec 8, 2025 11:16 AM"
```

**Guidelines**:

- **Short month name**: "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
- **12-hour time with AM/PM**: "hh:mm a" (e.g., "11:16 AM", "11:45 PM")
- **Comma after day**: "Dec 8, 2025"

---

## Implementation

### Using date-fns (Recommended)

```typescript
import { format } from 'date-fns';
import { enUS, id as idLocale } from 'date-fns/locale';

function formatDateTime(date: Date | string, locale: 'en' | 'id' = 'id'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (locale === 'id') {
    // Indonesian: "8 Des 2025 11:16"
    return format(dateObj, 'd MMM yyyy HH:mm', { locale: idLocale });
  }

  // English: "Dec 8, 2025 11:16 AM"
  return format(dateObj, 'MMM d, yyyy hh:mm a', { locale: enUS });
}
```

### Usage in Components

```typescript
import { useTranslations, useLocale } from 'next-intl';
import { formatDateTime } from '@/utils/date';

function MyComponent({ createdAt }: { createdAt: string }) {
  const locale = useLocale() as 'en' | 'id';

  return (
    <div>
      <span className="text-sm text-gray-600">
        {formatDateTime(createdAt, locale)}
      </span>
    </div>
  );
}
```

---

## Table Column Display

For date columns in tables/lists:

```typescript
const columns = [
  {
    field: 'createdAt',
    header: t('TABLE_HEADER_CREATED'),
    body: (rowData: any) => formatDateTime(rowData.createdAt, locale),
    style: { width: '180px' }, // Fixed width for consistency
  },
];
```

**Column Width**: `180px` (increased from 150px to accommodate time)

---

## Special Cases

### Activity Logs / Detailed Timestamps

For activity logs or audit trails where full month names are preferred:

**Indonesian**:

```
Format: "dd MMMM yyyy HH:mm"
Example: "18 Desember 2025 14:30"
```

**English**:

```
Format: "MMMM dd, yyyy hh:mm a"
Example: "December 18, 2025 02:30 PM"
```

**Implementation**:

```typescript
import { format } from 'date-fns';
import { enUS, id as idLocale } from 'date-fns/locale';

function formatActivityTimestamp(
  date: Date | string,
  locale: 'en' | 'id' = 'id'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (locale === 'id') {
    return format(dateObj, 'dd MMMM yyyy HH:mm', { locale: idLocale });
  }

  return format(dateObj, 'MMMM dd, yyyy hh:mm a', { locale: enUS });
}

<time dateTime={createdAt}>
  {formatActivityTimestamp(createdAt, locale)}
</time>
```

### Relative Time (Optional)

Use relative time ONLY when context makes it more useful (e.g., notifications, recent activity):

```typescript
import { formatRelativeTime } from '@/utils/date';

// "2 minutes ago", "3 hours ago", "5 days ago"
formatRelativeTime(date);
```

**When to use relative time**:

- Notifications list (supplementary to absolute time)
- Real-time activity feeds
- "Last updated" indicators

**Always provide absolute time on hover**:

```tsx
<span title={formatDateTime(date, locale)}>{formatRelativeTime(date)}</span>
```

---

## Accessibility

Always wrap dates in `<time>` element with ISO datetime attribute:

```tsx
<time dateTime={new Date(createdAt).toISOString()}>{formatDateTime(createdAt, locale)}</time>
```

**Benefits**:

- Screen readers can announce dates clearly
- Browsers can offer calendar integration
- Semantic HTML for better SEO

---

## Common Patterns

### Created/Updated Timestamps

```tsx
<div className="flex gap-2 text-sm text-gray-600">
  <span>
    {t('CREATED')}: {formatDateTime(item.createdAt, locale)}
  </span>
  <span>•</span>
  <span>
    {t('UPDATED')}: {formatDateTime(item.updatedAt, locale)}
  </span>
</div>
```

### Date Range Display

```tsx
<span>
  {formatDateTime(startDate, locale)} - {formatDateTime(endDate, locale)}
</span>
```

### Empty/Null Dates

```typescript
function formatDateTime(date: Date | string | null, locale: 'en' | 'id' = 'id'): string {
  if (!date) return '-'; // or t('NOT_SET')

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '-'; // Invalid date
  }

  // ... format logic
}
```

---

## Comparison: Before vs After

### ❌ Before (Date Only - Wrong)

```
Created: 8 Des 2025
Updated: 15 Nov 2025
```

**Problems**:

- No time information
- Can't distinguish between items created on same day
- Less useful for audit trails

### ✅ After (Date + Time - Correct)

```
Created: 8 Des 2025 11:16
Updated: 15 Nov 2025 08:30
```

**Benefits**:

- Complete temporal information
- Clear ordering for same-day items
- Better for debugging and audit trails

---

## Migration Guide

### Step 1: Update Utility Functions

Ensure `src/utils/date.ts` exports `formatDateTime`:

```typescript
import { format } from 'date-fns';
import { enUS, id as idLocale } from 'date-fns/locale';

export function formatDateTime(date: Date | string, locale: 'en' | 'id' = 'id'): string {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  if (locale === 'id') {
    return format(dateObj, 'd MMM yyyy HH:mm', { locale: idLocale });
  }

  return format(dateObj, 'MMM d, yyyy hh:mm a', { locale: enUS });
}
```

### Step 2: Replace Old formatDate Calls

**Before**:

```typescript
formatDate(date, 'id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
```

**After**:

```typescript
formatDateTime(date, 'id');
```

### Step 3: Update Table Columns

**Before**:

```typescript
{ field: 'createdAt', header: t('CREATED'), style: { width: '150px' } }
```

**After**:

```typescript
{
  field: 'createdAt',
  header: t('CREATED'),
  body: (row) => formatDateTime(row.createdAt, locale),
  style: { width: '180px' }
}
```

---

## Checklist

When displaying any date:

- [ ] Include time information (HH:mm format)
- [ ] Use correct format for locale (Indonesian: "d MMM yyyy HH:mm", English: "MMM d, yyyy hh:mm a")
- [ ] Use `formatDateTime()` utility function
- [ ] Handle null/undefined dates (return '-' or t('NOT_SET'))
- [ ] Wrap in `<time dateTime="...">` for accessibility
- [ ] Adjust table column width to 180px if needed
- [ ] Test with both Indonesian and English locales
- [ ] Verify 24-hour format for Indonesian, 12-hour with AM/PM for English

---

## References

- **Utility**: `src/utils/date.ts` - General date formatting
- **Activity Logs**: `src/utils/formatActivityTimestamp.ts` - Detailed activity timestamps
- **Locales**: Uses `date-fns/locale` for Indonesian and English
- **Component Example**: See `src/modules/profile/components/ActivityLog.tsx` for reference implementation
