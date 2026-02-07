# DataTable Component

A comprehensive, feature-rich DataTable component built on top of PrimeReact DataTable with enhanced functionality.

## Features

### ✅ Implemented Features

1. **Checkbox Selection** - Multi-select rows with checkboxes
2. **Custom Pagination** - Full pagination control with:
   - Page numbers
   - Previous/Next navigation
   - Current page indicator
   - Total records display
   - Rows per page selector
3. **Frozen Columns** - Freeze columns on left or right
4. **Custom Rendering** - Custom cell rendering with `body` function
5. **Status Indicators** - Easy to add tags, badges, or custom components
6. **Action Buttons** - Add action buttons/icons per row
7. **Sorting** - Column sorting
8. **Filtering** - Global and column-specific filtering
9. **Striped Rows** - Alternating row colors
10. **Loading State** - Loading indicator
11. **Empty State** - Custom empty message
12. **Responsive** - Mobile-friendly design
13. **TypeScript** - Full type safety

## Basic Usage

```tsx
import { DataTable, DataTableColumn } from '@/components/data';

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
}

function MyComponent() {
  const columns: DataTableColumn<Product>[] = [
    {
      field: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      field: 'name',
      header: 'Product Name',
      sortable: true,
    },
    {
      field: 'price',
      header: 'Price',
      body: (data) => `$${data.price.toFixed(2)}`,
    },
  ];

  const products: Product[] = [
    { id: '1', name: 'Product 1', price: 29.99, status: 'active' },
    // ... more data
  ];

  return (
    <DataTable data={products} columns={columns} pagination={{ rows: 10 }} />
  );
}
```

## Advanced Features

### 1. Selection with Checkboxes

```tsx
const [selectedItems, setSelectedItems] = useState<Product[]>([]);

<DataTable
  data={products}
  columns={columns}
  selectionMode="checkbox"
  selection={selectedItems}
  onSelectionChange={(e) => setSelectedItems(e.value as Product[])}
/>;
```

### 2. Frozen Columns

```tsx
const columns: DataTableColumn<Product>[] = [
  {
    field: 'id',
    header: 'ID',
    frozen: true,
    frozenPosition: 'left', // Freeze on left
  },
  // ... other columns
  {
    field: 'actions',
    header: 'Actions',
    frozen: true,
    frozenPosition: 'right', // Freeze on right
    body: (data) => <Button icon="pi pi-pencil" onClick={() => edit(data)} />,
  },
];
```

### 3. Custom Cell Rendering

#### Status Tags

```tsx
import { Tag } from '@/components/misc';

{
  field: 'status',
  header: 'Status',
  body: (data) => {
    const severity = data.status === 'active' ? 'success' : 'danger';
    return <Tag value={data.status} severity={severity} />;
  },
}
```

#### Action Buttons

```tsx
{
  field: 'actions',
  header: 'Actions',
  body: (data) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => handleEdit(data)}
        tooltip="Edit"
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(data)}
        tooltip="Delete"
      />
    </div>
  ),
}
```

#### Custom Formatting

```tsx
// Currency
{
  field: 'price',
  header: 'Price',
  body: (data) => (
    <span className="font-semibold">${data.price.toFixed(2)}</span>
  ),
}

// Date
{
  field: 'date',
  header: 'Date',
  body: (data) => new Date(data.date).toLocaleDateString(),
}

// Progress
{
  field: 'progress',
  header: 'Progress',
  body: (data) => (
    <div className="flex items-center gap-2">
      <span>{data.progress}%</span>
      <ProgressBar value={data.progress} style={{ width: '100px' }} />
    </div>
  ),
}
```

### 4. Custom Pagination

```tsx
<DataTable
  data={products}
  columns={columns}
  pagination={{
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    showPageInfo: true,
    showPrevNext: true,
    showPageNumbers: true,
  }}
  onPageChange={(e) => {
    console.log('Page changed:', e.page);
  }}
/>
```

### 5. Global Filtering

```tsx
const [globalFilter, setGlobalFilter] = useState('');

<div className="mb-4">
  <FormInputText
    placeholder="Search..."
    value={globalFilter}
    onChange={(e) => setGlobalFilter(e.target.value)}
    icon={<i className="pi pi-search" />}
  />
</div>

<DataTable
  data={products}
  columns={columns}
  globalFilter={globalFilter}
  globalFilterFields={['name', 'category', 'status']}
/>
```

### 6. Loading State

```tsx
const [loading, setLoading] = useState(false);

<DataTable
  data={products}
  columns={columns}
  loading={loading}
  emptyMessage="No products found"
/>;
```

## Props

### DataTable Props

| Prop                 | Type                                                    | Default           | Description                 |
| -------------------- | ------------------------------------------------------- | ----------------- | --------------------------- |
| `data`               | `T[]`                                                   | required          | Array of data objects       |
| `columns`            | `DataTableColumn<T>[]`                                  | required          | Column definitions          |
| `selectionMode`      | `'single' \| 'multiple' \| 'checkbox' \| 'radiobutton'` | -                 | Enable row selection        |
| `selection`          | `T \| T[]`                                              | -                 | Selected row(s)             |
| `onSelectionChange`  | `(e) => void`                                           | -                 | Selection change callback   |
| `pagination`         | `boolean \| PaginationConfig`                           | `true`            | Enable/configure pagination |
| `onPageChange`       | `(e) => void`                                           | -                 | Page change callback        |
| `className`          | `string`                                                | `''`              | DataTable className         |
| `containerClassName` | `string`                                                | `''`              | Container className         |
| `stripedRows`        | `boolean`                                               | `true`            | Alternating row colors      |
| `loading`            | `boolean`                                               | `false`           | Show loading indicator      |
| `emptyMessage`       | `string \| ReactNode`                                   | `'No data found'` | Empty state message         |
| `globalFilter`       | `string`                                                | -                 | Global filter value         |
| `globalFilterFields` | `string[]`                                              | -                 | Fields to search            |

### DataTableColumn Props

| Prop             | Type                           | Default  | Description          |
| ---------------- | ------------------------------ | -------- | -------------------- |
| `field`          | `string`                       | required | Data field name      |
| `header`         | `string`                       | -        | Column header text   |
| `body`           | `(data, options) => ReactNode` | -        | Custom cell renderer |
| `sortable`       | `boolean`                      | `false`  | Enable sorting       |
| `filter`         | `boolean`                      | `false`  | Enable filtering     |
| `frozen`         | `boolean`                      | `false`  | Freeze column        |
| `frozenPosition` | `'left' \| 'right'`            | `'left'` | Freeze position      |
| `style`          | `CSSProperties`                | -        | Column style         |
| `headerStyle`    | `CSSProperties`                | -        | Header style         |
| `bodyStyle`      | `CSSProperties`                | -        | Body cell style      |

### PaginationConfig

| Prop                 | Type       | Default           | Description                |
| -------------------- | ---------- | ----------------- | -------------------------- |
| `rows`               | `number`   | `10`              | Rows per page              |
| `first`              | `number`   | `0`               | First row index            |
| `totalRecords`       | `number`   | `data.length`     | Total records              |
| `rowsPerPageOptions` | `number[]` | `[5, 10, 25, 50]` | Page size options          |
| `showPageInfo`       | `boolean`  | `true`            | Show "Showing X to Y of Z" |
| `showPrevNext`       | `boolean`  | `true`            | Show prev/next buttons     |
| `showPageNumbers`    | `boolean`  | `true`            | Show page numbers          |

## Complete Example

```tsx
'use client';

import { useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/data';
import { Button } from 'primereact/button';
import { Tag } from '@/components/misc';
import { useConfirmDialog } from '@/components/common';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export default function ProductsPage() {
  const confirmDialog = useConfirmDialog();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const products: Product[] = [
    // ... your data
  ];

  const handleDelete = (product: Product) => {
    confirmDialog.openDialog({
      title: 'Confirm Deletion',
      description: `Delete "${product.name}"?`,
      submitText: 'Delete',
      submitSeverity: 'danger',
      onConfirm: async () => {
        await deleteProduct(product.id);
      },
    });
  };

  const columns: DataTableColumn<Product>[] = [
    {
      field: 'id',
      header: 'ID',
      sortable: true,
      frozen: true,
      style: { minWidth: '80px' },
    },
    {
      field: 'name',
      header: 'Product Name',
      sortable: true,
      filter: true,
      style: { minWidth: '200px' },
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      style: { minWidth: '150px' },
    },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      body: (data) => `$${data.price.toFixed(2)}`,
    },
    {
      field: 'status',
      header: 'Status',
      body: (data) => {
        const severityMap = {
          'In Stock': 'success',
          'Low Stock': 'warning',
          'Out of Stock': 'danger',
        };
        return <Tag value={data.status} severity={severityMap[data.status]} />;
      },
    },
    {
      field: 'actions',
      header: 'Actions',
      frozen: true,
      frozenPosition: 'right',
      body: (data) => (
        <div className="flex gap-2">
          <Button
            icon="pi pi-pencil"
            rounded
            text
            onClick={() => handleEdit(data)}
          />
          <Button
            icon="pi pi-trash"
            rounded
            text
            severity="danger"
            onClick={() => handleDelete(data)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Toolbar */}
      <div className="mb-4 flex justify-between">
        <Button
          label={`Delete ${selectedProducts.length} selected`}
          icon="pi pi-trash"
          severity="danger"
          disabled={selectedProducts.length === 0}
        />

        <FormInputText
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          icon={<i className="pi pi-search" />}
        />
      </div>

      {/* DataTable */}
      <DataTable
        data={products}
        columns={columns}
        selectionMode="checkbox"
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value as Product[])}
        globalFilter={globalFilter}
        globalFilterFields={['name', 'category', 'status']}
        pagination={{
          rows: 10,
          rowsPerPageOptions: [5, 10, 25, 50],
        }}
        loading={loading}
        stripedRows
      />
    </div>
  );
}
```

## TypeScript Support

Full TypeScript support with generics:

```tsx
import { DataTableColumn } from '@/components/data';

interface MyData {
  id: number;
  name: string;
}

const columns: DataTableColumn<MyData>[] = [
  // TypeScript knows the structure of `data` in body function
  {
    field: 'name',
    body: (data) => data.name.toUpperCase(), // ✅ Type-safe
  },
];
```

## Best Practices

1. **Always provide a unique `id` field** in your data for proper row identification
2. **Use frozen columns sparingly** - Only for ID and Actions columns
3. **Custom rendering** - Use the `body` function for any custom formatting
4. **Keep columns minimal** - Only show necessary columns, hide others in details view
5. **Provide meaningful headers** - Clear, concise column headers
6. **Handle loading states** - Always show loading indicator during async operations
7. **Global filtering** - Specify which fields should be searchable

## Styling

The DataTable uses PrimeReact's theme system and automatically applies surface backgrounds. You can customize with:

```tsx
<DataTable
  className="custom-table"
  containerClassName="custom-container"
  // ... other props
/>
```

## Example Page

Visit `/examples/datatable` to see all features in action!

## Related Components

- `Tag` - For status indicators
- `Button` - For action buttons
- `FormInputText` - For search/filter input
- `useConfirmDialog` - For delete confirmations
