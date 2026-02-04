# Data Display Best Practices

> **Purpose**: Default values for pagination, tables, search, and filters  
> **When to use**: Implementing list views, data tables, search functionality

## Pagination Defaults

```typescript
rows: 10; // Items per page
rowsPerPageOptions: [10, 20, 50, 100]; // Size options
```

**Guidelines**:

- **10 items** - Standard lists
- Show page count: "Showing 1-10 of 157"
- Preserve pagination when filters change

## Table Column Widths

| Column Type   | Width | Notes                                                    |
| ------------- | ----- | -------------------------------------------------------- |
| Actions       | 120px | Fixed                                                    |
| Status/Badge  | 100px | Fixed                                                    |
| Date + Time   | 180px | See [date-time-formatting.md](./date-time-formatting.md) |
| Short Text    | auto  | Min 100px, max 200px                                     |
| Long Text     | auto  | Min 200px                                                |
| Number        | 100px | Right-aligned                                            |
| Avatar + Name | 250px | User columns                                             |

## Search & Filters

**Search Debounce**: `500ms` (default)

```typescript
const debouncedSearch = useDebounce(searchTerm, 500);
```

**Guidelines**:

- Search box: top-right above table or on the header
- Include clear button (X icon)
- Show result count: "3 results for 'admin'"
- Preserve filters during pagination
- Reset filters: explicit user action only

## Empty States

**Icons**:

- `pi-inbox` - Empty lists
- `pi-search` - No search results
- `pi-filter` - No filtered results
- `pi-exclamation-triangle` - Errors

**Example**:

```tsx
<div className="flex flex-col items-center py-12">
  <i className="pi pi-inbox text-6xl text-gray-300 mb-4" />
  <h3 className="text-xl font-semibold mb-2">No items found</h3>
  <p className="text-sm text-gray-500 mb-4">Try adjusting your filters</p>
  <Button label="Clear Filters" onClick={clearFilters} />
</div>
```

## Date Columns

**All date columns MUST display both date and time.**

**Format**:

- **Indonesian**: "8 Des 2025 11:16" (24-hour)
- **English**: "Dec 8, 2025 11:16 AM" (12-hour)

**Implementation**:

```tsx
import { formatDateTime } from '@/utils/date';
import { useLocale } from 'next-intl';

const locale = useLocale() as 'en' | 'id';

const columns = [
  {
    field: 'createdAt',
    header: t('TABLE_HEADER_CREATED'),
    body: (rowData: any) => formatDateTime(rowData.createdAt, locale),
    style: { width: '180px' },
  },
];
```

**See**: [date-time-formatting.md](./date-time-formatting.md) for complete formatting standards.
