# ACL Best Practices

> **Purpose**: Implementation patterns for Access Control List (ACL) in UI components
>
> **Architecture Reference**: `lookup/architecture/acl.md`

---

## Checklist for New Features

When implementing a new feature, complete these ACL steps:

- [ ] Register table mapping in `src/constants/acl.ts`
- [ ] Add permission checks to list pages (Create button, bulk actions)
- [ ] Add permission checks to table row actions (Edit, Delete)
- [ ] Add permission checks to Add/Edit pages (redirect if unauthorized)
- [ ] Test with different user roles

---

## 1. Register Feature Table Mapping

**File**: `src/constants/acl.ts`

```typescript
export const FEATURE_TABLE_MAP = {
  // For simple features (single table)
  'my-feature': 'my_table_name',

  // For modules with sub-features
  'my-module': {
    _default: 'main_table',
    'sub-feature-1': 'sub_table_1',
    'sub-feature-2': 'sub_table_2',
  },
};
```

**Table naming**: Use `snake_case` matching the database table name.

---

## 2. List Page Pattern

### Import and Setup

```typescript
'use client';

import { useACL } from '@/hooks/useACL';

export function MyListPage() {
  const { hasPermission, isLoading: aclLoading } = useACL();

  // Define permission checks
  const canCreate = hasPermission('my_table', 'insert');
  const canUpdate = hasPermission('my_table', 'update');
  const canDelete = hasPermission('my_table', 'delete');

  // ...rest of component
}
```

### Conditional Create Button

```tsx
{
  canCreate && (
    <Button
      label={t('ADD_ITEM')}
      icon="pi pi-plus"
      onClick={handleCreate}
      data-testid="btn-add-item"
    />
  );
}
```

### Conditional Bulk Actions

```tsx
{
  canDelete && selectedItems.length > 0 && (
    <BulkActionBar selectedCount={selectedItems.length} onDelete={handleBulkDelete} />
  );
}
```

---

## 3. Table Row Actions Pattern

### Pass Permissions as Props

```tsx
// In parent component
<MyTable data={items} canUpdate={canUpdate} canDelete={canDelete} />
```

### Conditionally Render Actions

```tsx
// In table component
interface MyTableProps {
  data: Item[];
  canUpdate: boolean;
  canDelete: boolean;
}

export function MyTable({ data, canUpdate, canDelete }: MyTableProps) {
  const actionBodyTemplate = (rowData: Item) => (
    <div className="flex gap-2">
      {canUpdate && (
        <Button
          icon="pi pi-pencil"
          onClick={() => handleEdit(rowData.id)}
          data-testid={`btn-edit-${rowData.id}`}
        />
      )}
      {canDelete && (
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={() => handleDelete(rowData.id)}
          data-testid={`btn-delete-${rowData.id}`}
        />
      )}
    </div>
  );

  return (
    <DataTable value={data}>
      {/* columns */}
      <Column body={actionBodyTemplate} header="Actions" />
    </DataTable>
  );
}
```

---

## 4. Add/Edit Page Protection

### Redirect Unauthorized Users

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useACL } from '@/hooks/useACL';
import { useToast } from '@/hooks/useToast';

export function AddItemPageClient() {
  const router = useRouter();
  const { showError } = useToast();
  const { hasPermission, isLoading } = useACL();

  const canCreate = hasPermission('my_table', 'insert');

  // Redirect if no permission
  useEffect(() => {
    if (!isLoading && !canCreate) {
      showError(t('ERROR.UNAUTHORIZED'));
      router.replace('/my-feature');
    }
  }, [isLoading, canCreate, router, showError]);

  // Show loading while checking permissions
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Don't render if unauthorized (will redirect)
  if (!canCreate) {
    return null;
  }

  return (
    // ... page content
  );
}
```

### Edit Page Pattern

```tsx
export function EditItemPageClient({ id }: { id: string }) {
  const { hasPermission, isLoading } = useACL();
  const canUpdate = hasPermission('my_table', 'update');

  useEffect(() => {
    if (!isLoading && !canUpdate) {
      showError(t('ERROR.UNAUTHORIZED'));
      router.replace('/my-feature');
    }
  }, [isLoading, canUpdate]);

  // ... rest of component
}
```

---

## 5. Menu Item Visibility (Role-Based)

Menu items use **role checks** (not permissions) in `AppLayout`:

```tsx
// In AppLayout or navigation config
const menuItems = [
  {
    label: 'User Management',
    icon: 'pi pi-users',
    to: '/user-management',
    roles: ['super_admin', 'learning_organizer'], // Only these roles see this menu
  },
];
```

---

## 6. Common Patterns

### Loading State Handling

Always account for ACL loading state:

```tsx
const { hasPermission, isLoading } = useACL();

// Option 1: Disable button while loading
<Button disabled={isLoading || !canCreate} />;

// Option 2: Hide entirely until loaded
{
  !isLoading && canCreate && <Button />;
}
```

### Multiple Permission Checks

```tsx
const { hasAnyPermission, hasPermission } = useACL();

// Check if user has ANY of these permissions
const canManageUsers = hasAnyPermission([
  { table: 'user_profile', command: 'insert' },
  { table: 'user_profile', command: 'update' },
  { table: 'user_profile', command: 'delete' },
]);

// Check specific permissions
const canCreate = hasPermission('user_profile', 'insert');
const canEdit = hasPermission('user_profile', 'update');
```

### Feature-Based Access (Alternative)

Use `canAccess` for feature-based checks:

```tsx
const { canAccess } = useACL();

// Uses FEATURE_TABLE_MAP to resolve table
const canCreateOrg = canAccess('settings:organization:create');
const canViewSettings = canAccess('settings');
```

---

## 7. Don'ts

| Don't                                       | Do Instead                             |
| ------------------------------------------- | -------------------------------------- |
| ❌ Hardcode role checks for CRUD            | ✅ Use `hasPermission(table, command)` |
| ❌ Show disabled buttons without permission | ✅ Hide buttons entirely               |
| ❌ Check permissions in server components   | ✅ Use client components with `useACL` |
| ❌ Forget loading state                     | ✅ Always check `isLoading`            |
| ❌ Use camelCase for table names            | ✅ Use `snake_case` matching DB        |

---

## 8. Testing ACL

### Manual Testing

1. Login as user with limited permissions
2. Verify buttons/actions are hidden appropriately
3. Try direct URL access to Add/Edit pages
4. Confirm redirect with error toast for unauthorized access

### E2E Testing

```typescript
test('should hide create button for users without insert permission', async ({ page }) => {
  // Login as restricted user
  await loginAsUser(page, 'restricted-user@example.com');

  await page.goto('/my-feature');

  // Button should not exist
  await expect(page.getByTestId('btn-add-item')).not.toBeVisible();
});
```
