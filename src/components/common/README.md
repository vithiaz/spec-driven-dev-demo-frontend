# Common Components

Reusable common components used throughout the application.

## DialogConfirmation

A flexible confirmation dialog component with **global provider** for easy use across the entire application.

### Features

- ✅ **Global Provider** - Dialog automatically available on all pages
- ✅ **No Component Import** - Just use the hook `useConfirmDialog()`
- ✅ **No State Management** - Provider handles all state internally
- ✅ Customizable header title
- ✅ Close icon (configurable)
- ✅ Description text or custom content
- ✅ Children for custom body content
- ✅ Default footer with Cancel and Submit buttons
- ✅ Custom footer support
- ✅ Custom button text
- ✅ Loading state for async operations
- ✅ Disabled state for buttons
- ✅ Severity levels for buttons
- ✅ Optimized for CRUD operations (Create, Update, Delete)

## Quick Start

### 1. The dialog is already available globally (configured in root layout)

No setup needed! The `DialogConfirmationProvider` is already wrapped around your entire app.

### 2. Use in any page or component

```tsx
'use client';

import { useConfirmDialog } from '@/components/common';
import { Button } from 'primereact/button';

export default function MyPage() {
  const confirmDialog = useConfirmDialog();

  const handleDelete = (item) => {
    confirmDialog.openDialog(
      {
        title: 'Confirm Deletion',
        description: `Delete "${item.name}"? This cannot be undone.`,
        submitText: 'Delete',
        submitSeverity: 'danger',
        onConfirm: async () => {
          await api.deleteItem(item.id);
        },
        onSuccess: () => {
          console.log('Deleted successfully!');
        },
      },
      'delete',
      item
    );
  };

  return (
    <Button
      icon="pi pi-trash"
      onClick={() => handleDelete({ id: 1, name: 'My Item' })}
    />
  );
}
```

That's it! No need to import the DialogConfirmation component or manage visible state.

## Usage

### Basic Usage

```tsx
import { DialogConfirmation } from '@/components/common';
import { useState } from 'react';

function MyComponent() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button onClick={() => setVisible(true)}>Delete Item</button>

      <DialogConfirmation
        visible={visible}
        onHide={() => setVisible(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this item? This action cannot be undone."
        submitText="Delete"
        submitSeverity="danger"
        onSubmit={() => {
          // Handle delete
          console.log('Item deleted');
          setVisible(false);
        }}
      />
    </>
  );
}
```

### Global Hook (Recommended)

```tsx
import { useConfirmDialog } from '@/components/common';
import { Button } from 'primereact/button';

function MyComponent() {
  const confirmDialog = useConfirmDialog();

  const handleDelete = (item) => {
    confirmDialog.openDialog(
      {
        title: 'Confirm Deletion',
        description: 'Are you sure you want to delete this item?',
        submitText: 'Delete',
        submitSeverity: 'danger',
        onConfirm: async (data) => {
          // Perform async operation
          await deleteItem(data.id);
        },
        onSuccess: () => {
          console.log('Item deleted successfully');
        },
        onError: (error) => {
          console.error('Failed to delete:', error);
        },
      },
      'delete',
      item
    );
  };

  return (
    <Button
      label="Delete Item"
      icon="pi pi-trash"
      severity="danger"
      onClick={() => handleDelete({ id: 1, name: 'Item 1' })}
    />
  );
}
```

**Note:** No need to render the DialogConfirmation component - it's already available globally!

### CRUD Examples

#### Create Confirmation

```tsx
const dialog = useDialogConfirmation({
  onConfirm: async (data) => {
    await createItem(data);
  },
});

<DialogConfirmation
  visible={dialog.isVisible}
  onHide={dialog.close}
  title="Create New Item"
  description="Please review the information before creating."
  submitText="Create"
  submitSeverity="success"
  submitLoading={dialog.isLoading}
  onSubmit={dialog.confirm}
>
  {/* Custom form fields */}
  <div className="space-y-4">
    <FormInputText label="Name" value={name} onChange={setName} />
    <FormInputText label="Email" value={email} onChange={setEmail} />
  </div>
</DialogConfirmation>;
```

#### Update Confirmation

```tsx
const dialog = useDialogConfirmation({
  onConfirm: async (data) => {
    await updateItem(data.id, data.updates);
  },
});

<DialogConfirmation
  visible={dialog.isVisible}
  onHide={dialog.close}
  title="Update Item"
  description="Confirm the changes you want to make."
  submitText="Update"
  submitSeverity="info"
  submitLoading={dialog.isLoading}
  onSubmit={dialog.confirm}
/>;
```

#### Delete Confirmation

```tsx
const dialog = useDialogConfirmation({
  onConfirm: async (data) => {
    await deleteItem(data.id);
  },
});

<DialogConfirmation
  visible={dialog.isVisible}
  onHide={dialog.close}
  title="Confirm Deletion"
  description={`Are you sure you want to delete "${dialog.actionData?.name}"? This action cannot be undone.`}
  submitText="Delete"
  cancelText="Cancel"
  submitSeverity="danger"
  submitLoading={dialog.isLoading}
  onSubmit={dialog.confirm}
/>;
```

### Custom Footer

```tsx
<DialogConfirmation
  visible={visible}
  onHide={() => setVisible(false)}
  title="Custom Actions"
  description="This dialog has custom footer buttons."
  footer={
    <div className="flex gap-2 justify-between w-full">
      <Button label="Help" icon="pi pi-question" severity="help" />
      <div className="flex gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          outlined
          onClick={() => setVisible(false)}
        />
        <Button label="Save Draft" severity="info" onClick={saveDraft} />
        <Button label="Publish" severity="success" onClick={publish} />
      </div>
    </div>
  }
>
  <p>Custom content here</p>
</DialogConfirmation>
```

### With Custom Description Component

```tsx
<DialogConfirmation
  visible={visible}
  onHide={() => setVisible(false)}
  title="Warning"
  description={
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <i className="pi pi-exclamation-triangle text-yellow-600 text-xl" />
        <div>
          <h4 className="font-semibold text-yellow-800">Important Notice</h4>
          <p className="text-yellow-700 text-sm mt-1">
            This action will affect multiple records. Please proceed with
            caution.
          </p>
        </div>
      </div>
    </div>
  }
  submitText="I Understand"
  submitSeverity="warning"
  onSubmit={handleSubmit}
/>
```

### Without Cancel Button

```tsx
<DialogConfirmation
  visible={visible}
  onHide={() => setVisible(false)}
  title="Information"
  description="This is an informational dialog."
  showCancelButton={false}
  submitText="OK"
  onSubmit={() => setVisible(false)}
/>
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

<DialogConfirmation
  visible={visible}
  onHide={() => setVisible(false)}
  title="Processing"
  description="Please wait while we process your request."
  submitText="Submit"
  submitLoading={loading}
  submitDisabled={loading}
  onSubmit={async () => {
    setLoading(true);
    await performAction();
    setLoading(false);
    setVisible(false);
  }}
/>;
```

## Props

### DialogConfirmation Props

| Prop                   | Type                                                                    | Default            | Description                        |
| ---------------------- | ----------------------------------------------------------------------- | ------------------ | ---------------------------------- |
| `visible`              | `boolean`                                                               | required           | Controls dialog visibility         |
| `onHide`               | `() => void`                                                            | required           | Callback when dialog should close  |
| `title`                | `string`                                                                | `'Confirm Action'` | Dialog header title                |
| `description`          | `string \| ReactNode`                                                   | -                  | Description text or custom content |
| `children`             | `ReactNode`                                                             | -                  | Custom body content                |
| `showCloseIcon`        | `boolean`                                                               | `true`             | Show close icon in header          |
| `footer`               | `ReactNode`                                                             | -                  | Custom footer (overrides default)  |
| `showCancelButton`     | `boolean`                                                               | `true`             | Show cancel button                 |
| `showSubmitButton`     | `boolean`                                                               | `true`             | Show submit button                 |
| `cancelText`           | `string`                                                                | `'Cancel'`         | Cancel button text                 |
| `submitText`           | `string`                                                                | `'Submit'`         | Submit button text                 |
| `onCancel`             | `() => void`                                                            | -                  | Cancel button callback             |
| `onSubmit`             | `() => void`                                                            | -                  | Submit button callback             |
| `submitDisabled`       | `boolean`                                                               | `false`            | Disable submit button              |
| `cancelDisabled`       | `boolean`                                                               | `false`            | Disable cancel button              |
| `submitLoading`        | `boolean`                                                               | `false`            | Show loading on submit button      |
| `submitSeverity`       | `'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'help'` | `'secondary'`      | Submit button severity             |
| `cancelSeverity`       | `'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'help'` | `'secondary'`      | Cancel button severity             |
| `className`            | `string`                                                                | `''`               | Dialog className                   |
| `containerClassName`   | `string`                                                                | `''`               | Container className                |
| `headerClassName`      | `string`                                                                | `''`               | Header className                   |
| `contentClassName`     | `string`                                                                | `''`               | Content className                  |
| `footerClassName`      | `string`                                                                | `''`               | Footer className                   |
| `descriptionClassName` | `string`                                                                | `''`               | Description className              |

### useDialogConfirmation Return

| Property     | Type                              | Description                           |
| ------------ | --------------------------------- | ------------------------------------- |
| `state`      | `DialogConfirmationState`         | Full state object                     |
| `open`       | `(action?, data?) => void`        | Open dialog with action type and data |
| `close`      | `() => void`                      | Close dialog and reset state          |
| `confirm`    | `() => Promise<void>`             | Execute confirmation action           |
| `cancel`     | `() => void`                      | Cancel and close dialog               |
| `setLoading` | `(loading: boolean) => void`      | Set loading state                     |
| `setError`   | `(error: string \| null) => void` | Set error message                     |
| `isVisible`  | `boolean`                         | Shorthand for state.visible           |
| `isLoading`  | `boolean`                         | Shorthand for state.loading           |
| `actionType` | `ConfirmationAction`              | Current action type                   |
| `actionData` | `unknown`                         | Data passed to dialog                 |

### useDialogConfirmation Options

| Option      | Type                               | Description                          |
| ----------- | ---------------------------------- | ------------------------------------ |
| `onConfirm` | `(data?) => void \| Promise<void>` | Called when confirmed                |
| `onCancel`  | `() => void`                       | Called when cancelled                |
| `onSuccess` | `(data?) => void`                  | Called after successful confirmation |
| `onError`   | `(error: Error) => void`           | Called if confirmation fails         |

## Best Practices

1. **Use the hook** - The `useDialogConfirmation` hook provides built-in state management and async handling
2. **Pass data** - Store relevant data when opening the dialog using `dialog.open('delete', itemData)`
3. **Handle errors** - Use the `onError` callback to handle failures gracefully
4. **Loading states** - Always show loading state during async operations
5. **Appropriate severity** - Use correct button severity (danger for delete, success for create, etc.)
6. **Clear descriptions** - Provide clear, concise descriptions of what will happen

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  DialogConfirmationProps,
  UseDialogConfirmationOptions,
  UseDialogConfirmationReturn,
  ConfirmationAction,
  DialogConfirmationState,
} from '@/components/common';
```

## Styling

The component uses PrimeReact's Dialog component and inherits the application theme. You can customize styling using the className props:

- `className` - Main dialog styling
- `containerClassName` - Outer container
- `headerClassName` - Header section
- `contentClassName` - Content area
- `footerClassName` - Footer section
- `descriptionClassName` - Description text

## Accessibility

- Proper ARIA attributes from PrimeReact Dialog
- Keyboard support (ESC to close)
- Focus management
- Screen reader friendly
- Disabled state properly communicated

---

### DataList

A reusable data list component that integrates with Supabase for easy data fetching, filtering, and pagination.

**Key Features:**

- ✅ **Supabase Integration** - Auto-fetches data from any table
- ✅ **Filtering** - Support for multiple filter operators
- ✅ **Search** - Multi-field text search
- ✅ **Sorting** - Ascending/descending ordering
- ✅ **Pagination** - Client or server-side
- ✅ **Realtime** - Optional live updates
- ✅ **Custom Queries** - Override default query logic
- ✅ **TypeScript** - Full type safety

#### Basic Usage

```tsx
import { DataList, DataTableColumn } from '@/components/data';

interface Book {
  id: number;
  title: string;
  author: string;
  created_at: string;
}

function BooksPage() {
  const columns: DataTableColumn<Book>[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'title', header: 'Title', sortable: true },
    { field: 'author', header: 'Author', sortable: true },
    {
      field: 'created_at',
      header: 'Created',
      body: (data) => formatDate(data.created_at),
    },
  ];

  return <DataList table="books" columns={columns} pagination={{ rows: 10 }} />;
}
```

#### With Filters

```tsx
<DataList
  table="books"
  columns={columns}
  filters={[
    { field: 'author', operator: 'eq', value: 'John Doe' },
    { field: 'created_at', operator: 'gte', value: '2024-01-01' },
  ]}
/>
```

#### With Search

```tsx
const [searchTerm, setSearchTerm] = useState('');

<DataList
  table="books"
  columns={columns}
  search={{
    value: searchTerm,
    fields: ['title', 'author'],
  }}
/>;
```

#### With Sorting

```tsx
<DataList
  table="books"
  columns={columns}
  sort={{ field: 'created_at', order: 'desc' }}
/>
```

#### With Custom Query

```tsx
<DataList
  table="books"
  columns={columns}
  customQuery={async (client) => {
    const { data } = await client
      .from('books')
      .select('*, author:authors(name)')
      .eq('published', true);
    return data || [];
  }}
/>
```

#### With Selection

```tsx
const [selected, setSelected] = useState<Book[]>([]);

<DataList
  table="books"
  columns={columns}
  selectionMode="checkbox"
  selection={selected}
  onSelectionChange={(e) => setSelected(e.value as Book[])}
/>;
```

#### With Realtime Updates

```tsx
<DataList
  table="books"
  columns={columns}
  enableRealtime={true}
  // Data will automatically refresh when table changes
/>
```

#### With Pagination

**Client-side Pagination (Default)**

```tsx
<DataList
  table="books"
  columns={columns}
  pagination={{
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  }}
  // All data loaded at once, paginated in browser
  // Good for small to medium datasets (< 1000 records)
/>
```

**Server-side Pagination**

```tsx
<DataList
  table="books"
  columns={columns}
  pagination={{
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  }}
  serverSidePagination={true}
  // Only current page loaded from database
  // Better performance for large datasets
  // Automatically refetches when page changes
/>
```

**Controlled Pagination**

```tsx
const handlePageChange = (event) => {
  console.log('Page:', event.page);
  console.log('Rows:', event.rows);
  console.log('First:', event.first);
};

<DataList
  table="books"
  columns={columns}
  pagination={{ rows: 10 }}
  serverSidePagination={true}
  onPageChange={handlePageChange}
/>;
```

#### DataList Props

| Prop                   | Type                                   | Default         | Description                         |
| ---------------------- | -------------------------------------- | --------------- | ----------------------------------- |
| `table`                | `SupabaseTable`                        | **required**    | Supabase table name                 |
| `columns`              | `DataTableColumn[]`                    | **required**    | Column definitions                  |
| `select`               | `string`                               | `'*'`           | Supabase select query               |
| `customQuery`          | `CustomQueryFn`                        | -               | Custom query function               |
| `filters`              | `DataListFilter[]`                     | `[]`            | Filter conditions                   |
| `search`               | `{ value, fields }`                    | -               | Search configuration                |
| `sort`                 | `{ field, order }`                     | -               | Sort configuration                  |
| `pagination`           | `boolean \| PaginationConfig`          | `true`          | Pagination settings                 |
| `serverSidePagination` | `boolean`                              | `false`         | Enable server-side pagination       |
| `onPageChange`         | `(event) => void`                      | -               | Page change callback                |
| `enableRealtime`       | `boolean`                              | `true`          | Enable realtime updates             |
| `realtimeTable`        | `SupabaseTable`                        | `table`         | Table to watch for realtime updates |
| `queryKey`             | `string[]`                             | auto-generated  | Custom query key                    |
| `selectionMode`        | `'single' \| 'multiple' \| 'checkbox'` | -               | Selection mode                      |
| `selection`            | `T \| T[]`                             | -               | Selected items                      |
| `onSelectionChange`    | `(e) => void`                          | -               | Selection change handler            |
| `loading`              | `boolean`                              | auto            | Loading state                       |
| `emptyMessage`         | `string \| ReactNode`                  | 'No data found' | Empty state message                 |
| `dataKey`              | `string`                               | `'id'`          | Unique row identifier               |

#### Filter Operators

```tsx
type FilterOperator =
  | 'eq' // equals
  | 'neq' // not equals
  | 'gt' // greater than
  | 'gte' // greater than or equal
  | 'lt' // less than
  | 'lte' // less than or equal
  | 'like' // pattern match (case-sensitive)
  | 'ilike' // pattern match (case-insensitive)
  | 'in'; // in array
```

#### Pagination Modes

**Client-side vs Server-side Pagination**

| Feature                 | Client-side       | Server-side          |
| ----------------------- | ----------------- | -------------------- |
| **Data Loading**        | All at once       | Per page             |
| **Performance (small)** | ✅ Fast           | ⚠️ Slower            |
| **Performance (large)** | ❌ Slow           | ✅ Fast              |
| **Memory Usage**        | ❌ High           | ✅ Low               |
| **Realtime Updates**    | ✅ Full dataset   | ⚠️ Current page only |
| **Best For**            | < 1000 records    | > 1000 records       |
| **Network Requests**    | 1 initial request | Request per page     |

**When to use Server-side Pagination:**

- Large datasets (> 1000 records)
- Limited memory/bandwidth
- Need to show total count without loading all data
- Database-level filtering and sorting

**When to use Client-side Pagination:**

- Small to medium datasets (< 1000 records)
- Need instant pagination response
- Frequently changing pages
- All data needed in memory anyway

#### Complete Example

```tsx
'use client';

import { useState } from 'react';
import { DataList, DataTableColumn } from '@/components/data';
import { FormInputText } from '@/components/form';
import { Tag } from '@/components/misc';
import { Button } from 'primereact/button';
import { formatDate } from '@/utils';

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'published' | 'draft';
  created_at: string;
}

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

  const columns: DataTableColumn<Book>[] = [
    {
      field: 'id',
      header: 'ID',
      sortable: true,
      frozen: true,
      style: { width: '80px' },
    },
    {
      field: 'title',
      header: 'Title',
      sortable: true,
      style: { minWidth: '200px' },
    },
    {
      field: 'author',
      header: 'Author',
      sortable: true,
    },
    {
      field: 'status',
      header: 'Status',
      body: (data) => (
        <Tag
          value={data.status}
          severity={data.status === 'published' ? 'success' : 'warning'}
        />
      ),
    },
    {
      field: 'created_at',
      header: 'Created',
      sortable: true,
      body: (data) => formatDate(data.created_at),
    },
    {
      field: 'actions',
      header: 'Actions',
      frozen: true,
      frozenPosition: 'right',
      body: (data) => (
        <div className="flex gap-2">
          <Button icon="pi pi-pencil" rounded text />
          <Button icon="pi pi-trash" rounded text severity="danger" />
        </div>
      ),
    },
  ];

  const filters = statusFilter
    ? [{ field: 'status', operator: 'eq' as const, value: statusFilter }]
    : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Books</h1>

      {/* Toolbar */}
      <div className="mb-4 flex gap-4">
        <FormInputText
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<i className="pi pi-search" />}
        />

        <Button
          label="Published"
          outlined={statusFilter !== 'published'}
          onClick={() =>
            setStatusFilter(statusFilter === 'published' ? '' : 'published')
          }
        />

        <Button
          label="Draft"
          outlined={statusFilter !== 'draft'}
          onClick={() =>
            setStatusFilter(statusFilter === 'draft' ? '' : 'draft')
          }
        />

        {selectedBooks.length > 0 && (
          <Button
            label={`Delete ${selectedBooks.length} selected`}
            icon="pi pi-trash"
            severity="danger"
          />
        )}
      </div>

      {/* DataList with Supabase Integration */}
      <DataList<Book>
        table="books"
        columns={columns}
        select="*"
        filters={filters}
        search={{
          value: searchTerm,
          fields: ['title', 'author'],
        }}
        sort={{ field: 'created_at', order: 'desc' }}
        pagination={{
          rows: 10,
          rowsPerPageOptions: [5, 10, 25, 50],
        }}
        serverSidePagination={false}
        selectionMode="checkbox"
        selection={selectedBooks}
        onSelectionChange={(e) => setSelectedBooks(e.value as Book[])}
        enableRealtime={true}
        stripedRows
      />
    </div>
  );
}
```

---
