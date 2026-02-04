# OpenSpec Apply - Common Pitfalls & Best Practices

> **Purpose**: Document common mistakes, anti-patterns, and lessons learned during OpenSpec implementation
> **When to reference**: During code review, implementation, testing, and debugging

---

## Table of Contents

1. [Component Common Pitfalls](#component-common-pitfalls)
   - Case 1: Button component with `label` instead of `buttonLabel`
   - Case 2: Using `any` type instead of proper TypeScript types
   - Case 3: TreeTable wrapper missing expand/collapse props
   - Case 4: Creating separate modal components for confirmation dialogs
   - Case 5: Missing `data-testid` on interactive elements
   - Case 6: Unused variables and imports
   - Case 7: Importing PrimeReact components directly
   - Case 8: Using fetch() instead of createInternalApiClient() in Server Actions
   - Case 9: Importing Menu directly from PrimeReact instead of wrapper
   - Case 10: Modifying shared components without checking all usages
2. [Tab Switching and State Preservation](#tab-switching-and-state-preservation)
3. [Form and Modal Implementation](#form-and-modal-implementation)
4. [Internationalization (i18n)](#internationalization-i18n)
5. [Module Organization and Types Location](#module-organization-and-types-location)
6. [Initial Implementation Cases](#initial-implementation-cases)
7. [Testing Pitfalls](#testing-pitfalls)
   - Pitfall 1: Not mocking React Query hooks
   - Pitfall 2: Not testing keyboard navigation
   - Pitfall 3: Test mocks targeting wrong module path after component migration
8. [Pagination Consistency](pagination-consistency.md)

---

## Component Common Pitfalls

### Case 1: Button component with `label` instead of `buttonLabel`

**Symptom**:

- Button shows only an icon without text beside it
- Or button shows text above it like a form label instead of inside the button

**Wrong Implementation**:

```tsx
// DepartmentTab.tsx - WRONG!
<Button
  label={t('department.button.add')} // ❌ Wrong prop
  icon="pi pi-plus"
  severity="success"
  onClick={() => setShowModal(true)}
/>
```

**Resolution**:

Use `buttonLabel` instead of `label`:

```tsx
// DepartmentTab.tsx - CORRECT!
<Button
  buttonLabel={t('department.button.add')} // ✅ Correct
  icon="pi pi-plus"
  severity="success"
  onClick={() => setShowModal(true)}
/>
```

**When to use each prop**:

| Scenario                    | Use `buttonLabel` | Use `label`       |
| --------------------------- | ----------------- | ----------------- |
| Modal footer actions        | ✅ Yes            | ❌ No             |
| Page header actions         | ✅ Yes            | ❌ No             |
| Table row actions           | ✅ Yes            | ❌ No             |
| Form submit buttons         | ✅ Yes            | ❌ No             |
| Form field with label above | ✅ Yes            | ✅ Yes (optional) |

---

### Case 2: Using `any` type instead of proper TypeScript types

**Wrong Implementation**:

```tsx
const validateField = (name: string, value: any): string | null => {
  // ❌ No type safety
};
```

**Resolution**:

```tsx
const validateField = (
  name: string,
  value: string | boolean // ✅ Proper union type
): string | null => {
  // TypeScript knows value type
};
```

---

### Case 3: TreeTable wrapper missing expand/collapse props

**Symptom**:

- ESLint errors about unused `expandedKeys` and `onToggle` props
- TreeTable expand/collapse functionality doesn't work

**Resolution**:

Add missing props to wrapper component:

```tsx
// src/components/data/treetable.tsx
export interface TreeTableProps<T = unknown> {
  // ... existing props
  expandedKeys?: TreeTableExpandedKeysType; // ✅ Add
  onToggle?: (keys: TreeTableExpandedKeysType) => void; // ✅ Add
}

// Forward to PrimeReact
<PrimeTreeTable expandedKeys={expandedKeys} onToggle={(e) => onToggle?.(e.value)} />;
```

---

### Case 4: Creating separate modal components for confirmation dialogs

**Symptom**:

- Creating a new modal component file for every confirmation dialog
- Duplicating modal state management code
- Extra props drilling (isVisible, onHide, onSuccess, etc.)

**Wrong Implementation**:

```tsx
// RemoveGroupMembersModal.tsx - WRONG! Separate component
export function RemoveGroupMembersModal({
  groupId,
  memberIds,
  isVisible,
  onHide,
  onSuccess,
}: RemoveGroupMembersModalProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  // ... duplicate state management
}

// GroupMembersList.tsx - Using separate modal
const [isRemoveMembersModalVisible, setIsRemoveMembersModalVisible] = useState(false);

<RemoveGroupMembersModal
  groupId={groupId}
  memberIds={selectedMembers}
  isVisible={isRemoveMembersModalVisible}
  onHide={() => setIsRemoveMembersModalVisible(false)}
  onSuccess={() => {
    /* ... */
  }}
/>;
```

**Resolution**:

Use `useDialogConfirmation` hook directly:

```tsx
// GroupMembersList.tsx - CORRECT! Using hook
import { useDialogConfirmation } from '@/hooks/useDialogConfirmation';
import { DialogConfirmation } from '@/components/common/DialogConfirmation';
import { removeGroupMembers } from '@/actions/user-management/group-members-api';

export function GroupMembersList({ groupId }: Props) {
  const toast = useToast();

  // ✅ Hook handles all state management
  const removeDialog = useDialogConfirmation({
    onConfirm: async () => {
      const result = await removeGroupMembers(groupId, selectedMembers);
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove members');
      }
    },
    onSuccess: () => {
      toast.success('Members removed successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div>
      {/* ✅ Direct button usage */}
      <Button onClick={() => removeDialog.open('delete')} />

      {/* ✅ Inline dialog - no separate component */}
      <DialogConfirmation
        visible={removeDialog.isVisible}
        onHide={removeDialog.close}
        title="Remove Members"
        description="Are you sure?"
        onSubmit={removeDialog.confirm}
        onCancel={removeDialog.cancel}
        submitSeverity="danger"
        submitLoading={removeDialog.isLoading}
      />
    </div>
  );
}
```

**Benefits**:

- ✅ Less code (no separate component file)
- ✅ Better colocation (logic + UI together)
- ✅ No props drilling
- ✅ Hook manages state automatically
- ✅ Consistent pattern across app

**When to use `useDialogConfirmation`**:

✅ **Use for:**

- Confirmation dialogs (delete, archive, cancel)
- Destructive actions requiring confirmation
- Simple dialogs with confirm/cancel buttons

❌ **Don't use for:**

- Complex forms with multiple fields
- Multi-step wizards
- Dialogs with complex layouts

**Common Mistakes with useDialogConfirmation**:

❌ **Wrong** - Manual state management with useState:

```tsx
// DON'T DO THIS
const [archiveDialog, setArchiveDialog] = useState({
  open: false,
  id: null,
  name: null,
});
const [isArchiving, setIsArchiving] = useState(false);

const handleArchiveClick = (id, name) => {
  setArchiveDialog({ open: true, id, name });
};

const handleArchiveConfirm = async () => {
  setIsArchiving(true);
  await archiveOrganization(archiveDialog.id);
  setIsArchiving(false);
  setArchiveDialog({ open: false, id: null, name: null });
};

<DialogConfirmation
  visible={archiveDialog.open}
  onHide={() => setArchiveDialog({ open: false, id: null, name: null })}
  title="Archive?"
  description={`Archive ${archiveDialog.name}?`}
  onSubmit={handleArchiveConfirm}
  submitLoading={isArchiving}
/>;
```

✅ **Correct** - Using useDialogConfirmation hook:

```tsx
// DO THIS INSTEAD
const { archiveOrganization } = useArchiveOrganization();

const archiveDialog = useDialogConfirmation({
  onConfirm: async (data) => {
    const { id } = data as { id: string; name: string };
    await archiveOrganization(id);
  },
  onSuccess: () => {
    toast.success('Organization archived successfully');
    refetch();
  },
  onError: () => {
    toast.error('Failed to archive organization');
  },
});

const handleArchiveClick = (id: string, name: string) => {
  archiveDialog.open('custom', { id, name }); // ✅ Pass data to hook
};

<DialogConfirmation
  visible={archiveDialog.isVisible} // ✅ Use hook's isVisible
  onHide={archiveDialog.close} // ✅ Use hook's close
  title="Archive Organization"
  description={`Archive ${(archiveDialog.actionData as { name: string })?.name}?`} // ✅ Get data from hook
  onSubmit={archiveDialog.confirm} // ✅ Use hook's confirm
  onCancel={archiveDialog.cancel} // ✅ Use hook's cancel
  submitLoading={archiveDialog.isLoading} // ✅ Use hook's isLoading
  submitSeverity="danger" // ✅ Dangerous action styling
  style={{ width: '400px' }} // ✅ Optional: set dialog width
/>;
```

**Redundant Props to Avoid**:

- ❌ `submitDisabled={dialog.isLoading}` - Button auto-disables when `submitLoading={true}`
- ❌ `cancelDisabled={dialog.isLoading}` - Cancel button auto-disables when `submitLoading={true}`
- ❌ `closable={!dialog.isLoading}` - Unnecessary manual control
- ❌ `dismissableMask={!dialog.isLoading}` - Unnecessary manual control
- ❌ `closeOnEscape={!dialog.isLoading}` - Unnecessary manual control

**Minimal Required Props**:

```tsx
// ✅ MINIMAL - Everything else is handled automatically
<DialogConfirmation
  visible={dialog.isVisible}
  onHide={dialog.close}
  title="Confirm Action"
  description="Are you sure?"
  submitText="Confirm"
  cancelText="Cancel"
  onSubmit={dialog.confirm}
  onCancel={dialog.cancel}
  submitLoading={dialog.isLoading}
  submitSeverity="danger" // optional: 'danger' | 'success' | 'info' | etc.
  style={{ width: '400px' }} // optional: dialog width
/>
```

**Server Action Pattern**:

Always use `createInternalApiClient()` in server actions:

```tsx
// ✅ CORRECT - Using internal API client
export async function removeGroupMembers(
  groupId: string,
  memberIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const httpClient = createInternalApiClient();
    await httpClient.delete(`/api/groups/${groupId}/members`, { memberIds });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove members' };
  }
}

// ❌ WRONG - Using fetch directly
export async function removeGroupMembers(...) {
  const response = await fetch(`${baseUrl}/api/...`, {
    method: 'DELETE',
    body: JSON.stringify({ memberIds }),
  });
}
```

**InternalApiClient DELETE with body**:

The internal API client supports DELETE requests with body data:

```tsx
// src/lib/axios/index.ts
class InternalApiClient {
  public async delete<T = unknown>(
    endpoint: string,
    data?: unknown // ✅ Optional body data
  ): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, { data });
    return response.data;
  }
}

// Usage
await httpClient.delete('/api/groups/123/members', {
  memberIds: ['id1', 'id2', 'id3'],
});
```

---

### Case 5: Missing `data-testid` on interactive elements

**Wrong Implementation**:

```tsx
<Button
  buttonLabel="Save"
  onClick={handleSave}
  // ❌ Missing data-testid
/>
```

**Resolution**:

```tsx
<Button
  buttonLabel="Save"
  onClick={handleSave}
  data-testid="save-button" // ✅ Added
/>
```

**Naming Convention**:

- Use kebab-case
- Pattern: `{element-purpose}-{element-type}`
- Examples: `add-organization-button`, `organization-name-input`

---

### Case 6: Unused variables and imports

**Wrong Implementation**:

```tsx
import { useState, useEffect, useCallback } from 'react'; // Only using useState

const handleSubmit = async (formData: FormData, userId: string) => {
  // userId never used
};
```

**Resolution**:

```tsx
import { useState } from 'react'; // ✅ Only import what's used

const handleSubmit = async (formData: FormData) => {
  // ✅ Remove unused parameters
};
```

**Type-Only Imports**:

```tsx
// ✅ Good - explicit type import
import type { OrganizationFormData } from '@/mappers/setting/organizationMapper';

// ❌ Less optimal - value import for type only
import { OrganizationFormData } from '@/mappers/setting/organizationMapper';
```

---

### Case 7: Importing PrimeReact components directly

**Wrong Implementation**:

```tsx
// ❌ BAD: Direct PrimeReact imports
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from 'primereact/progressbar';
import { Message } from 'primereact/message';
import { RadioButton } from 'primereact/radiobutton';
```

**Resolution**:

```tsx
// ✅ GOOD: Use project wrapper components
import { Modal } from '@/components/overlay/Modal';
import { FormInputText, FormRadioButton } from '@/components/form';
import { Button } from '@/components/button/Button';
import { Spinner } from '@/components/misc/Spinner';
import { ProgressBar } from '@/components/misc/ProgressBar';
import Message from '@/components/messages/Message';
```

**Why wrapper components**:

- Consistent styling across app
- Built-in accessibility features
- Integrated validation
- Easier to update globally

**Component Mapping Reference**:

| PrimeReact Component         | Use Instead                           |
| ---------------------------- | ------------------------------------- |
| `primereact/button`          | `@/components/button/Button`          |
| `primereact/inputtext`       | `@/components/form/FormInputText`     |
| `primereact/inputtextarea`   | `@/components/form/FormInputTextarea` |
| `primereact/inputnumber`     | `@/components/form/FormInputNumber`   |
| `primereact/dropdown`        | `@/components/form/FormDropdown`      |
| `primereact/multiselect`     | `@/components/form/FormMultiSelect`   |
| `primereact/calendar`        | `@/components/form/FormCalendar`      |
| `primereact/checkbox`        | `@/components/form/FormCheckbox`      |
| `primereact/radiobutton`     | `@/components/form/FormRadioButton`   |
| `primereact/inputswitch`     | `@/components/form/FormInputSwitch`   |
| `primereact/password`        | `@/components/form/FormPassword`      |
| `primereact/editor`          | `@/components/form/FormEditor`        |
| `primereact/chips`           | `@/components/form/FormChips`         |
| `primereact/inputmask`       | `@/components/form/FormInputMask`     |
| `primereact/datatable`       | `@/components/common/DataList`        |
| `primereact/treetable`       | `@/components/data/treetable`         |
| `primereact/dialog`          | `@/components/overlay/Modal`          |
| `primereact/sidebar`         | `@/components/overlay/Drawer`         |
| `primereact/tooltip`         | `@/components/overlay/Tooltip`        |
| `primereact/progressspinner` | `@/components/misc/Spinner`           |
| `primereact/progressbar`     | `@/components/misc/ProgressBar`       |
| `primereact/message`         | `@/components/messages/Message`       |
| `primereact/toast`           | `@/components/messages/Toast`         |
| `primereact/card`            | `@/components/panel/Card`             |
| `primereact/panel`           | `@/components/panel/Panel`            |
| `primereact/accordion`       | `@/components/panel/Accordion`        |
| `primereact/tabview`         | `@/components/panel/Tab`              |
| `primereact/steps`           | `@/components/panel/Stepper`          |
| `primereact/breadcrumb`      | `@/components/menu/Breadcrumbs`       |
| `primereact/tabmenu`         | `@/components/menu/TabMenu`           |
| `primereact/menu`            | `@/components/menu`                   |

**How to check if a wrapper exists**:

1. Search in `src/components/` directory for the component name
2. Check `lookup/architecture/component-library.md` for category mapping
3. Check `docs/components.md` for detailed props documentation

---

### Case 8: Using fetch() instead of createInternalApiClient() in Server Actions

**Symptom**:

- Server action uses native `fetch()` to call internal API routes
- Missing cookie forwarding in server-side context
- Inconsistent error handling across actions
- Authentication issues in certain scenarios

**Wrong Implementation**:

```typescript
// ❌ BAD: Using fetch() directly
'use server';

export async function getJobPositionListAction(
  params: GetJobPositionListParams
): Promise<Response> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/setting/job-positions?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'NETWORK_ERROR' };
  }
}
```

**Resolution**:

```typescript
// ✅ GOOD: Using createInternalApiClient()
'use server';

import { createInternalApiClient } from '@/lib/axios';
import { AxiosError } from 'axios';

export async function getJobPositionListAction(
  params: GetJobPositionListParams
): Promise<Response> {
  try {
    // Create internal API client - handles cookies, base URL, interceptors
    const internalApi = createInternalApiClient();

    // Build query parameters
    const queryParams: Record<string, string> = {};
    if (params.search) queryParams.search = params.search;
    if (params.page !== undefined) queryParams.page = String(params.page);
    // ... other params

    // Call internal API route
    const data = await internalApi.get<JobPositionListResponse>(
      '/api/setting/job-positions',
      queryParams
    );

    return { success: true, data };
  } catch (error) {
    // Handle axios errors with detailed messages
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 401) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Please log in',
        };
      } else if (status === 403) {
        return {
          success: false,
          error: 'FORBIDDEN',
          message: 'Permission denied',
        };
      } else if (status === 500) {
        return {
          success: false,
          error: 'SERVER_ERROR',
          message: 'Server error',
        };
      } else if (error.code === 'ECONNABORTED') {
        return { success: false, error: 'TIMEOUT', message: 'Request timeout' };
      } else if (!error.response) {
        return {
          success: false,
          error: 'NETWORK_ERROR',
          message: 'Network error',
        };
      }

      return {
        success: false,
        error: 'SERVER_ERROR',
        message: error.response?.data?.message || 'Request failed',
      };
    }

    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Request failed',
    };
  }
}
```

**Why `createInternalApiClient()` is better**:

| Feature               | fetch()           | createInternalApiClient() |
| --------------------- | ----------------- | ------------------------- |
| Cookie forwarding     | ❌ Manual         | ✅ Automatic              |
| Base URL handling     | ❌ Manual         | ✅ Automatic              |
| Error handling        | ❌ Manual         | ✅ Structured             |
| Request interceptors  | ❌ None           | ✅ Built-in               |
| Response interceptors | ❌ None           | ✅ Built-in               |
| TypeScript generics   | ❌ Manual casting | ✅ Type-safe              |
| Timeout handling      | ❌ Manual         | ✅ 30s default            |

**InternalApiClient Methods**:

```typescript
const internalApi = createInternalApiClient();

// GET with query params
const data = await internalApi.get<ResponseType>('/api/endpoint', {
  key: 'value',
});

// POST with body
const data = await internalApi.post<ResponseType>('/api/endpoint', {
  body: 'data',
});

// PATCH with body
const data = await internalApi.patch<ResponseType>('/api/endpoint/123', {
  status: 'active',
});

// DELETE (with optional body)
const data = await internalApi.delete<ResponseType>('/api/endpoint/123');
const data = await internalApi.delete<ResponseType>('/api/endpoint/123', {
  ids: ['a', 'b'],
});
```

**Checklist for Server Actions**:

- [ ] Import `createInternalApiClient` from `@/lib/axios`
- [ ] Import `AxiosError` from `axios` for error handling
- [ ] Use `internalApi.get/post/patch/delete` instead of `fetch()`
- [ ] Handle common HTTP status codes (401, 403, 404, 409, 500)
- [ ] Handle network errors (`!error.response`)
- [ ] Handle timeout errors (`error.code === 'ECONNABORTED'`)
- [ ] Return structured response with `success`, `error`, `message` fields

---

### Case 10: Modifying shared components without checking all usages

**Symptom**:

- After modifying a component, other pages/features break unexpectedly
- Props changes cause TypeScript errors in unrelated files
- Behavior changes affect features you didn't intend to modify
- Bug reports come from areas you didn't touch

**Wrong Implementation**:

```tsx
// ❌ BAD: Directly modifying shared component without checking usages

// SessionAttendancesSection.tsx - Used in multiple places
export function SessionAttendancesSection({ attendances }: Props) {
  // Changed default behavior without checking consumers
  const [paginationState, setPaginationState] = useState({ first: 0, rows: 5 }); // Changed from 10 to 5

  // Added required prop without making it optional
  // This breaks all existing usages!
}
```

```tsx
// ❌ BAD: Changing prop interface without updating consumers
interface SessionAttendancesSectionProps {
  attendances: Attendance[];
  showPagination: boolean; // ❌ New required prop - breaks existing usages
}
```

**Resolution**:

**Step 1: Always search for all usages before modifying**

```bash
# Search for component usages
grep -r "SessionAttendancesSection" --include="*.tsx" --include="*.ts" src/

# Or use IDE "Find All References" feature
```

**Step 2: Check the impact scope**

```tsx
// ✅ GOOD: Check all usages first
// Found usages:
// - src/app/(dashboard)/course-management/[id]/sessions/[sessionId]/SessionDetailPageClient.tsx
// - src/modules/learning-session/components/index.ts (export only)
//
// Impact: Only 1 consumer, safe to modify
```

**Step 3: Make changes backward-compatible when possible**

```tsx
// ✅ GOOD: New props are optional with sensible defaults
interface SessionAttendancesSectionProps {
  attendances: Attendance[];
  showPagination?: boolean; // ✅ Optional with default
  defaultPageSize?: number; // ✅ Optional with default
}

export function SessionAttendancesSection({
  attendances,
  showPagination = true, // ✅ Default maintains existing behavior
  defaultPageSize = 10, // ✅ Default maintains existing behavior
}: SessionAttendancesSectionProps) {
  // ...
}
```

**Step 4: If breaking changes are needed, update all consumers**

```tsx
// ✅ GOOD: When breaking change is necessary, update ALL usages
// 1. Modify component with new required prop
// 2. Update SessionDetailPageClient.tsx
// 3. Update any other consumers found in search
// 4. Run TypeScript check: yarn tsc --noEmit
// 5. Run tests for all affected modules
```

**Checklist before modifying shared components**:

- [ ] Search for all usages: `grep -r "ComponentName" --include="*.tsx" src/`
- [ ] List all files that import/use the component
- [ ] Determine if change is breaking or backward-compatible
- [ ] If breaking: plan updates for ALL consumers
- [ ] If adding props: make them optional with defaults
- [ ] If changing behavior: ensure it doesn't break existing consumers
- [ ] Run `yarn tsc --noEmit` after changes
- [ ] Run tests for all affected modules
- [ ] Document the change if it affects component API

**Common scenarios and solutions**:

| Scenario                  | Solution                                       |
| ------------------------- | ---------------------------------------------- |
| Adding new prop           | Make it optional with sensible default         |
| Removing prop             | Deprecate first, then remove in next version   |
| Changing prop type        | Create new prop, deprecate old one             |
| Changing default behavior | Add prop to control behavior, keep old default |
| Renaming prop             | Support both names temporarily, deprecate old  |

**Example: Safe prop addition**

```tsx
// Before
interface Props {
  data: Item[];
}

// After - backward compatible
interface Props {
  data: Item[];
  pageSize?: number; // ✅ Optional
  onPageChange?: (page: number) => void; // ✅ Optional
}

export function DataList({
  data,
  pageSize = 10, // ✅ Default value
  onPageChange, // ✅ Optional callback
}: Props) {
  // New pagination logic only activates if onPageChange is provided
  // Existing usages continue to work unchanged
}
```

**Example: Breaking change with proper migration**

```tsx
// Step 1: Add deprecation warning (if time permits)
/** @deprecated Use `items` prop instead. Will be removed in v2.0 */
data?: Item[];
items?: Item[];

// Step 2: Support both during transition
const itemList = items ?? data ?? [];

// Step 3: Update all consumers to use new prop

// Step 4: Remove deprecated prop in next major version
```

**When to create a new component instead**:

- Changes would break > 5 consumers
- New behavior is significantly different
- Original component serves different use case
- You need both old and new behavior to coexist

```tsx
// Instead of modifying DataTable, create specialized version
// ❌ Modifying: src/components/data/DataTable.tsx
// ✅ Creating: src/modules/course-management/components/SessionDataTable.tsx
```

---

## Tab Switching and State Preservation

### Problem: Tab switching causes component unmount and re-fetch

When switching between tabs using conditional rendering, the inactive tab component **unmounts completely**. When you switch back, the component **remounts from scratch**, causing:

1. Loading states appear again
2. Component state is lost (search, filters, pagination reset)
3. Hooks reinitialize
4. API calls may trigger

**Wrong Implementation**:

```tsx
// ❌ BAD: Conditional rendering causes unmount/remount
const renderTabContent = () => {
  switch (activeIndex) {
    case 0:
      return <UserListTab />; // Unmounts when activeIndex !== 0
    case 1:
      return <GroupListTab />; // Unmounts when activeIndex !== 1
    default:
      return null;
  }
};

return <div>{renderTabContent()}</div>;
```

**Resolution**:

```tsx
// ✅ GOOD: Both tabs stay mounted, just hidden
return (
  <div>
    <div style={{ display: activeIndex === 0 ? 'block' : 'none' }}>
      <UserListTab />
    </div>
    <div style={{ display: activeIndex === 1 ? 'block' : 'none' }}>
      <GroupListTab />
    </div>
  </div>
);
```

**Benefits**:

- ✅ Component state preserved when switching tabs
- ✅ No unnecessary loading states
- ✅ React Query cache works optimally
- ✅ User's position (pagination, filters) maintained
- ✅ Better UX - instant tab switching

**When to use this pattern**:

- ✅ Tabs contain stateful components
- ✅ Tabs fetch data independently
- ✅ User frequently switches between tabs
- ✅ Tab content is not extremely heavy

**When NOT to use**:

- ❌ Tabs are very heavy (memory constraints)
- ❌ State should reset on tab change
- ❌ Single-use tabs (user rarely switches back)

**Testing considerations**:

```tsx
// ✅ GOOD: Check parent element display style
expect(userTab.parentElement).toHaveStyle({ display: 'block' });
expect(groupTab.parentElement).toHaveStyle({ display: 'none' });

// ❌ BAD: Component is always in document when mounted
expect(screen.queryByTestId('user-list-tab')).not.toBeInTheDocument(); // Fails!
```

---

## Form and Modal Implementation

### Pitfall 1: Not handling empty or invalid names in code generation

**Wrong**:

```typescript
// ❌ BAD: No validation
export function generateGroupCode(name: string): string {
  return 'GROUP-' + name.toUpperCase().replace(/\s+/g, '-');
}
```

**Right**:

```typescript
// ✅ GOOD: Handle empty, special chars, trim
export function generateGroupCode(name: string): string {
  return (
    'GROUP-' +
    name
      .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special chars first
      .trim() // Then trim
      .replace(/\s+/g, '-') // Then replace spaces
      .toUpperCase()
  );
}
```

---

### Pitfall 2: Not handling duplicate name errors correctly

**Wrong**:

```typescript
// ❌ BAD: Generic error message
catch (error) {
  toast.error('Failed to create group');
}
```

**Right**:

```typescript
// ✅ GOOD: Specific error messages
catch (error) {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 409 ||
        (status === 400 && error.response?.data?.message?.includes('unique'))) {
      toast.error(t('GROUPS.CREATE_MODAL.MESSAGES.DUPLICATE'));
      return;
    }

    if (status === 403) {
      toast.error(t('GROUPS.CREATE_MODAL.MESSAGES.FORBIDDEN'));
      return;
    }
  }

  toast.error(t('GROUPS.CREATE_MODAL.MESSAGES.ERROR'));
}
```

---

### Pitfall 3: Not validating required fields server-side

**Wrong**:

```typescript
// ❌ BAD: No server-side validation
export async function POST(request: NextRequest) {
  const { name, description } = await request.json();

  // Directly insert without validation
  const { data, error } = await supabase.from('master-tags').insert({ name, description });
}
```

**Right**:

```typescript
// ✅ GOOD: Validate on server
export async function POST(request: NextRequest) {
  const { name, description } = await request.json();

  // Server-side validation
  if (!name || name.trim().length < 3 || name.trim().length > 255) {
    return NextResponse.json({ error: 'Name must be between 3-255 characters' }, { status: 400 });
  }

  if (!description || description.trim().length < 10 || description.trim().length > 500) {
    return NextResponse.json(
      { error: 'Description must be between 10-500 characters' },
      { status: 400 }
    );
  }

  // Now safe to proceed
  const { data, error } = await supabase.from('master-tags').insert({
    name: name.trim(),
    description: description.trim(),
  });
}
```

**Why**: Client-side validation can be bypassed. Server-side validation is the security boundary.

---

### Pitfall 4: Using wrong validation mode

**Wrong**:

```typescript
// ❌ BAD: Validates on every keystroke
const { control, handleSubmit } = useForm({
  mode: 'onChange', // Too aggressive
});
```

**Right**:

```typescript
// ✅ GOOD: Validate on blur
const { control, handleSubmit } = useForm({
  mode: 'onBlur', // Validates when user leaves field
  defaultValues: {
    name: '',
    description: '',
  },
});
```

---

### Pitfall 5: Not disabling save button correctly

**Wrong**:

```tsx
// ❌ BAD: Button always enabled
<Button label={t('BUTTONS.SAVE')} onClick={handleSubmit(onSubmit)} />
```

**Right**:

```tsx
// ✅ GOOD: Disable when invalid or loading
<Button
  label={t('BUTTONS.SAVE')}
  onClick={handleSubmit(onSubmit)}
  disabled={!formState.isValid || isSubmitting}
  loading={isSubmitting}
  data-testid="create-group-save-button"
/>
```

---

### Pitfall 6: Using optimistic updates instead of cache invalidation

**Wrong**:

```typescript
// ❌ BAD: Complex optimistic updates
const mutation = useMutation({
  mutationFn: createGroup,
  onMutate: async (newGroup) => {
    await queryClient.cancelQueries(['groups']);
    const previous = queryClient.getQueryData(['groups']);
    queryClient.setQueryData(['groups'], (old) => ({
      data: [newGroup, ...old.data],
      total: old.total + 1,
    }));
    return { previous };
  },
  onError: (err, newGroup, context) => {
    queryClient.setQueryData(['groups'], context.previous);
  },
});
```

**Right**:

```typescript
// ✅ GOOD: Simple cache invalidation
const mutation = useMutation({
  mutationFn: createGroup,
  onSuccess: () => {
    queryClient.invalidateQueries(['groups']);
    toast.success(t('GROUPS.CREATE_MODAL.MESSAGES.SUCCESS'));
    onClose();
  },
  onError: (error) => {
    handleError(error);
  },
});
```

**Why**: Cache invalidation is:

- Simpler to implement
- Backend-authoritative (IDs, timestamps from server)
- Proper sorting/pagination handling
- No rollback complexity

---

### Pitfall 7: Not resetting form on modal close

**Wrong**:

```tsx
// ❌ BAD: Form state persists
<Modal visible={showModal} onHide={() => setShowModal(false)}>
  <CreateGroupForm />
</Modal>
```

**Right**:

```tsx
// ✅ GOOD: Reset form when modal closes
const CreateGroupModal = ({ visible, onHide }) => {
  const { reset } = useForm();

  useEffect(() => {
    if (!visible) {
      reset(); // Clear form when modal closes
    }
  }, [visible, reset]);

  return (
    <Modal visible={visible} onHide={onHide}>
      {/* form */}
    </Modal>
  );
};
```

---

### Pitfall 8: Not managing focus on modal open

**Wrong**:

```tsx
// ❌ BAD: No focus management
<Modal visible={visible} onHide={onHide}>
  <FormInputText name="name" label="Name" />
</Modal>
```

**Right**:

```tsx
// ✅ GOOD: Auto-focus first field
<Modal
  visible={visible}
  onHide={onHide}
  onShow={() => {
    document.getElementById('create-group-name-input')?.focus();
  }}
>
  <FormInputText id="create-group-name-input" name="name" label="Name" autoFocus />
</Modal>
```

**Why**: WCAG 2.1 requires focus management in modals for keyboard/screen reader users.

---

### Pitfall 9: Missing ARIA labels for required fields

**Wrong**:

```tsx
// ❌ BAD: No ARIA attributes
<FormInputText name="name" label="Name" required />
```

**Right**:

```tsx
// ✅ GOOD: Wrapper adds aria-required automatically
<FormInputText
  name="name"
  label="Name"
  required // Adds aria-required="true" automatically
  error={errors.name?.message} // Adds aria-describedby for error
  data-testid="create-group-name-input"
/>
```

**Why**: Our wrapper components automatically add proper ARIA attributes.

---

## Internationalization (i18n)

### Case 1: Lowercase namespace causing MISSING_MESSAGE error

**Symptom**:

```
Error: MISSING_MESSAGE: Could not resolve `setting` in messages for locale `en`.
```

**Wrong Implementation**:

```json
// messages/setting/en.json - WRONG!
{
  "title": "Settings",
  "breadcrumbs": {
    "home": "Home"
  }
}
```

```typescript
const t = useTranslations('setting'); // Error!
```

**Resolution**:

```json
// messages/setting/en.json - CORRECT!
{
  "SETTING": {
    "title": "Settings",
    "breadcrumbs": {
      "home": "Home"
    }
  }
}
```

```typescript
const t = useTranslations('SETTING'); // ✅ Correct!
```

**Convention Reference**:

| Module Folder      | Namespace in JSON  | useTranslations()                     |
| ------------------ | ------------------ | ------------------------------------- |
| `auth`             | `AUTH`             | `useTranslations('AUTH')`             |
| `user-management`  | `USER_MANAGEMENT`  | `useTranslations('USER_MANAGEMENT')`  |
| `setting`          | `SETTING`          | `useTranslations('SETTING')`          |
| `learning-catalog` | `LEARNING_CATALOG` | `useTranslations('LEARNING_CATALOG')` |

**Key Rules**:

- ✅ Always UPPERCASE
- ✅ Use underscores for multi-word names (not hyphens)
- ✅ Convert kebab-case folder names to SCREAMING_SNAKE_CASE
- ✅ Both en.json and id.json must use same namespace
- ✅ Must be registered in `src/i18n/request.ts` MODULES array

---

### Case 2: Forgot to register module in i18n config

**Symptom**:

```
Error: MISSING_MESSAGE: Could not resolve `MY_MODULE` in messages
```

**Resolution**:

```typescript
// src/i18n/request.ts
const MODULES = [
  'auth',
  'feedback-template',
  'user-management',
  'my-module', // ✅ Add your module (kebab-case folder name)
];
```

**Important**:

- Use kebab-case folder name in MODULES array
- Restart dev server after adding

---

### Case 3: Mismatched keys between en.json and id.json

**Wrong**:

```json
// messages/setting/en.json
{
  "SETTING": {
    "PAGE_TITLE": "Settings"
  }
}
```

```json
// messages/setting/id.json
{
  "SETTING": {
    "TITLE": "Pengaturan" // ❌ Different key!
  }
}
```

**Right**:

```json
// Both files
{
  "SETTING": {
    "PAGE_TITLE": "Settings" // or "Pengaturan"
  }
}
```

**Key Rules**:

- ✅ Both files must have identical key structure
- ✅ Only values (translations) should differ
- ✅ Nested objects must match exactly

---

### Case 4: Hardcoded strings in components

**Wrong**:

```tsx
// ❌ BAD: Hardcoded English strings
<Modal header="Create Group">
  <FormInputText label="Group Name" placeholder="Enter group name" />
  <Button label="Save" />
</Modal>
```

**Right**:

```tsx
// ✅ GOOD: All strings from i18n
const t = useTranslations('USER_MANAGEMENT.GROUPS.CREATE_MODAL');

<Modal header={t('TITLE')}>
  <FormInputText label={t('FIELDS.NAME')} placeholder={t('FIELDS.NAME_PLACEHOLDER')} />
  <Button label={t('BUTTONS.SAVE')} />
</Modal>;
```

---

### Case 5: Wrong i18n key structure

**Wrong**:

```json
// ❌ BAD: Flat structure
{
  "createGroupTitle": "Create Group",
  "groupName": "Group Name",
  "saveBtn": "Save"
}
```

**Right**:

```json
// ✅ GOOD: Nested structure
{
  "GROUPS": {
    "CREATE_MODAL": {
      "TITLE": "Create Group",
      "FIELDS": {
        "NAME": "Group Name"
      },
      "BUTTONS": {
        "SAVE": "Save"
      }
    }
  }
}
```

---

### Checklist for Adding New i18n Module

1. [ ] Create `messages/<module>/en.json` with UPPERCASE namespace
2. [ ] Create `messages/<module>/id.json` with UPPERCASE namespace
3. [ ] Ensure both files have identical key structure
4. [ ] Add module (kebab-case) to MODULES array in `src/i18n/request.ts`
5. [ ] Use `useTranslations('UPPERCASE_NAME')` in code
6. [ ] Restart dev server
7. [ ] Verify in browser

---

## Initial Implementation Cases

### Case 1: Modal Component Location

**Initial Error**:
Attempted to import from `@/components/dialog/Dialog` but the correct component is `@/components/overlay/Modal`.

**Resolution**:
Updated import to use `Modal` from `@/components/overlay/Modal` which wraps PrimeReact Dialog with project-specific styling.

---

### Case 2: BreadcrumbItem Interface

**Initial Error**:
Used `href` property for breadcrumbs, but the correct property is `url` based on `BreadcrumbItem` interface.

**Resolution**:
Changed breadcrumb items from `{ label, href }` to `{ label, url }` to match the type definition.

---

### Case 3: UserTypeSelection Hook Not Needed

**Context**:
Task specified creating `useUserTypeSelection.ts` for modal state, but modal state is simple enough to manage with `useState`.

**Resolution**:
Skipped creating separate hook. Used `useState` in component directly. This follows the principle of keeping simple state local unless there's a need for reusability.

---

### Case 9: Importing Menu directly from PrimeReact instead of wrapper

**Symptom**:

- Tests fail looking for `data-testid` on individual menu items
- Menu items don't have consistent styling
- Test mocks are targeting wrong module path

**Wrong Implementation**:

```tsx
// ❌ BAD: Direct PrimeReact imports
import { Menu } from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';

// Component uses PrimeReact's model prop
const menuItems: MenuItem[] = [
  {
    label: t('ACTIONS.EDIT'),
    icon: 'pi pi-pencil',
    command: () => onActionClick?.('edit', row),
    // Custom template for data-testid - complex and inconsistent
    template: (item) => <button data-testid={`action-edit-${row.id}`}>{item.label}</button>,
  },
];

<Menu model={menuItems} popup ref={menuRef} />;
```

```tsx
// ❌ BAD: Test mocks primereact/menu directly
jest.mock('primereact/menu', () => {
  const MockMenu = React.forwardRef((props: { model: MenuItem[] }, ref) => (
    <div>
      {props.model.map((item, idx) => (
        <div key={idx}>{item.template ? item.template(item) : item.label}</div>
      ))}
    </div>
  ));
  return { Menu: MockMenu };
});
```

**Resolution**:

```tsx
// ✅ GOOD: Use wrapper component
import { Menu, type MenuItem, type MenuRef } from '@/components/menu';

// Component uses wrapper's items prop (not model)
const menuItems: MenuItem[] = [
  {
    label: t('ACTIONS.EDIT'),
    icon: 'pi pi-pencil',
    command: () => onActionClick?.('edit', row),
    // No custom template needed - wrapper handles testids
  },
  { separator: true },
  {
    label: t('ACTIONS.DELETE'),
    icon: 'pi pi-trash',
    className: 'text-red-600',
    command: () => onActionClick?.('delete', row),
  },
];

<Menu
  items={menuItems}
  popup
  ref={menuRef}
  popupAlignment="right"
  data-testid={`action-menu-${row.id}`}
/>;
```

```tsx
// ✅ GOOD: Test mocks the wrapper component
jest.mock('@/components/menu', () => {
  const React = require('react');
  const MockMenu = React.forwardRef(
    (
      props: {
        items: Array<{
          label?: string;
          command?: () => void;
          separator?: boolean;
        }>;
        popup?: boolean;
        popupAlignment?: string;
        'data-testid'?: string;
      },
      _ref: React.Ref<unknown>
    ) => (
      <div data-testid={props['data-testid']}>
        {props.items
          .filter((item) => !item.separator)
          .map((item, index) => (
            <button key={index} onClick={item.command} data-testid={`menu-item-${item.label}`}>
              {item.label}
            </button>
          ))}
      </div>
    )
  );
  MockMenu.displayName = 'MockMenu';
  return { Menu: MockMenu };
});

// Test assertions use label-based testids
expect(screen.getByTestId('menu-item-ACTIONS.EDIT')).toBeInTheDocument();
expect(screen.getByTestId('menu-item-ACTIONS.DELETE')).toBeInTheDocument();
```

**Key Differences**:

| Aspect            | PrimeReact Direct         | Wrapper Component         |
| ----------------- | ------------------------- | ------------------------- |
| Import path       | `primereact/menu`         | `@/components/menu`       |
| Items prop        | `model={items}`           | `items={items}`           |
| Ref type          | `Menu`                    | `MenuRef`                 |
| Custom templates  | Required for testids      | Not needed                |
| Test mock target  | `primereact/menu`         | `@/components/menu`       |
| Test item testids | Custom per implementation | `menu-item-${item.label}` |

**When migrating existing components**:

1. Update imports from `primereact/menu` to `@/components/menu`
2. Change ref type from `Menu` to `MenuRef`
3. Change `model={items}` to `items={items}`
4. Remove custom `template` functions from menu items
5. Update test mocks to target `@/components/menu`
6. Update test assertions to use `menu-item-${label}` pattern

**Example test assertion patterns**:

```tsx
// For i18n labels (translation keys)
expect(screen.getByTestId('menu-item-ACTIONS.EDIT')).toBeInTheDocument();
expect(screen.getByTestId('menu-item-ACTIONS.DELETE')).toBeInTheDocument();
expect(screen.getByTestId('menu-item-ACTIONS.ACTIVATE')).toBeInTheDocument();
expect(screen.getByTestId('menu-item-ACTIONS.DEACTIVATE')).toBeInTheDocument();

// For literal labels
expect(screen.getByTestId('menu-item-Edit')).toBeInTheDocument();
expect(screen.getByTestId('menu-item-Delete')).toBeInTheDocument();
```

---

## Testing Pitfalls

### Pitfall 1: Not mocking React Query hooks

**Wrong**:

```typescript
// ❌ BAD: No mocking, test tries real API calls
it('submits form on save', () => {
  render(<CreateGroupModal visible={true} onHide={jest.fn()} />);
  fireEvent.click(screen.getByTestId('create-group-save-button'));
});
```

**Right**:

```typescript
// ✅ GOOD: Mock the mutation hook
const mockMutate = jest.fn();
jest.mock('@/modules/user-management/hooks/useCreateGroup', () => ({
  useCreateGroup: () => ({
    mutate: mockMutate,
    isLoading: false,
    error: null,
  }),
}));

it('submits form on save', async () => {
  render(<CreateGroupModal visible={true} onHide={jest.fn()} />);

  await userEvent.type(screen.getByTestId('create-group-name-input'), 'IT Team');
  await userEvent.click(screen.getByTestId('create-group-save-button'));

  expect(mockMutate).toHaveBeenCalledWith({
    name: 'IT Team',
    description: 'Information Technology',
  });
});
```

---

### Pitfall 2: Not testing keyboard navigation

**Wrong**:

```typescript
// ❌ BAD: Only tests mouse clicks
it('opens modal on button click', () => {
  const { getByTestId } = render(<GroupListTab />);
  fireEvent.click(getByTestId('create-group-button'));
});
```

**Right**:

```typescript
// ✅ GOOD: Test keyboard too
it('opens modal on Enter key', async () => {
  const { getByTestId } = render(<GroupListTab />);
  const button = getByTestId('create-group-button');
  button.focus();
  await userEvent.keyboard('{Enter}');
  expect(getByTestId('create-group-modal')).toBeInTheDocument();
});

it('closes modal on Escape key', async () => {
  const { getByTestId } = render(
    <CreateGroupModal visible={true} onHide={mockOnHide} />
  );
  await userEvent.keyboard('{Escape}');
  expect(mockOnHide).toHaveBeenCalled();
});
```

---

### Pitfall 3: Test mocks targeting wrong module path after component migration

**Symptom**:

- Tests fail after migrating component from direct PrimeReact import to wrapper
- Error: "Unable to find element by data-testid"
- Mock is not being applied because it targets wrong path

**Wrong Implementation**:

```tsx
// Component was updated to use wrapper:
import { Menu } from '@/components/menu'; // ✅ Component uses wrapper

// But test still mocks PrimeReact directly:
jest.mock('primereact/menu', () => {
  // ❌ This mock is never used!
  // Component imports from @/components/menu, not primereact/menu
});
```

**Resolution**:

When migrating a component from direct PrimeReact imports to wrapper components, **always update the test mocks to match**:

```tsx
// ✅ GOOD: Mock matches the import path used by component
jest.mock('@/components/menu', () => {
  const React = require('react');
  const MockMenu = React.forwardRef((props, ref) => {
    // Mock implementation
  });
  return { Menu: MockMenu };
});
```

**Checklist for component migration**:

- [ ] Update component imports to use wrapper
- [ ] Update component props (e.g., `model` → `items`)
- [ ] Update ref types (e.g., `Menu` → `MenuRef`)
- [ ] **Update test mock to target wrapper path**
- [ ] **Update test assertions for new testid patterns**
- [ ] Run tests to verify

**Common wrapper migrations and their test mock paths**:

| Component | PrimeReact Path        | Wrapper Path                  |
| --------- | ---------------------- | ----------------------------- |
| Menu      | `primereact/menu`      | `@/components/menu`           |
| Dialog    | `primereact/dialog`    | `@/components/overlay/Modal`  |
| DataTable | `primereact/datatable` | `@/components/data/datatable` |
| Button    | `primereact/button`    | `@/components/button`         |
| InputText | `primereact/inputtext` | `@/components/form`           |
| Dropdown  | `primereact/dropdown`  | `@/components/form`           |

---

## Module Organization and Types Location

### Case 1: Putting feature-specific types in global types directory

**Symptom**:

- Types for a specific feature are placed in `src/types/` instead of within the feature module
- Import inconsistency across the codebase
- Unclear ownership of types
- Difficult to refactor or move features

**Wrong Implementation**:

```
src/
├── types/
│   └── activity-log.ts        # ❌ Feature-specific types in global location
└── modules/
    └── profile/
        └── activity-log/
            ├── components/
            ├── hooks/
            └── (no types folder)
```

```typescript
// ❌ BAD: Importing feature-specific types from global location
import type { ActivityLogItem } from '@/types/activity-log';
```

**Resolution**:

Move feature-specific types to the module folder:

```
src/
├── types/
│   └── (only shared/global types)
└── modules/
    └── profile/
        └── activity-log/
            ├── components/
            ├── hooks/
            └── types.ts           # ✅ Feature types here
```

```typescript
// ✅ GOOD: Module-specific types
import type { ActivityLogItem } from '@/modules/profile/activity-log/types';
```

**When to use global types (`src/types/`)**:

✅ **Use for:**

- Truly shared types used across multiple modules (e.g., `User`, `ApiResponse`)
- Authentication types used everywhere
- Common utility types
- App-wide configuration types

❌ **Don't use for:**

- Feature-specific domain types
- Types only used within one module
- Component prop types specific to a feature
- API response types for a single feature

**Migration Steps**:

1. Create types file in module: `src/modules/<module>/<feature>/types.ts`
2. Move type definitions with identity comments
3. Update all imports across codebase:
   ```bash
   find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s|from '@/types/feature-name'|from '@/modules/module/feature/types'|g" {} +
   ```
4. Run TypeScript check: `yarn tsc --noEmit`
5. Run tests: `yarn test <feature>`
6. Delete old types file

**Common pitfalls during migration**:

1. **Forgetting test files**: Include `__tests__/` in search-and-replace
2. **Missing constants**: Check `src/constants/` for imports
3. **API routes**: Update `src/app/api/` and `src/actions/` imports
4. **Mappers**: Check `src/mappers/` directory
5. **Circular dependencies**: Keep types independent or use shared types

**Example: Activity Log Types Migration**

Before:

```typescript
// src/types/activity-log.ts - WRONG location
export type ActivityCategory = 'ALL' | 'PROGRAM' | 'COURSE';
export interface ActivityLogItem {
  id: string;
  activityType: string;
  // ...
}
```

After:

```typescript
// src/modules/profile/activity-log/types.ts - CORRECT location
export type ActivityCategory = 'ALL' | 'PROGRAM' | 'COURSE';
export interface ActivityLogItem {
  id: string;
  activityType: string;
  // ...
}
```

**Consistency check**:

Other modules using correct pattern:

- ✅ `src/modules/user-management/types/`
- ✅ `src/modules/setting/types/`
- ✅ `src/modules/profile/activity-log/types.ts`

---

### Case 2: Inconsistent type file naming across modules

**Symptom**:

- Some modules use `types.ts` file
- Others use `types/` folder with `index.ts`
- Confusion about which pattern to follow

**Wrong Implementation**:

```
src/modules/
├── user-management/
│   └── types/               # ❌ Using folder
│       └── index.ts
└── profile/
    └── activity-log/
        └── types.ts         # ❌ Using file
```

**Resolution**:

Choose one consistent pattern for all modules. Recommended: Use `types.ts` file for simpler features, `types/` folder for complex features with many types.

**Pattern A: Single File** (Recommended for most features)

```
src/modules/<module>/<feature>/
└── types.ts                 # ✅ All types in one file
```

Use when:

- Feature has < 10 type definitions
- Types are closely related
- No need for internal organization

**Pattern B: Types Folder** (For complex features)

```
src/modules/<module>/<feature>/
└── types/
    ├── index.ts             # Re-exports all types
    ├── api.ts               # API-related types
    ├── components.ts        # Component prop types
    └── domain.ts            # Domain/business types
```

Use when:

- Feature has > 10 type definitions
- Types can be logically grouped
- Better organization needed

**Migration example**:

```typescript
// Before: types.ts
export interface ActivityLogItem { ... }
export interface ActivityLogApiResponse { ... }
export type ActivityCategory = ...;
// ... 20+ more types

// After: types/index.ts
export * from './api';
export * from './domain';
export * from './components';

// After: types/domain.ts
export interface ActivityLogItem { ... }
export type ActivityCategory = ...;

// After: types/api.ts
export interface ActivityLogApiResponse { ... }
```

**Import remains the same**:

```typescript
// Both patterns work with same import
import type { ActivityLogItem } from '@/modules/profile/activity-log/types';
```

---

## Pagination Consistency

✅ **RESOLVED** - Unified pagination implemented across all modules.

See [pagination-consistency.md](pagination-consistency.md) for detailed documentation on the pagination consistency issue and its resolution.
